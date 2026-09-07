import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, isAbsolute, relative, sep } from 'node:path';

const root = resolve(import.meta.dirname, '../apps/catalog/dist');
const mime = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };
const port = Number(process.env.UI_CATALOG_PORT ?? 8095);

function isInsideRoot(file) {
  const pathFromRoot = relative(root, file);
  return pathFromRoot !== '' && pathFromRoot !== '..' && !pathFromRoot.startsWith(`..${sep}`) && !isAbsolute(pathFromRoot);
}

export function createCatalogServer() {
  return createServer(async (request, response) => {
    let file;
    try {
      const pathname = new URL(request.url ?? '/', 'http://catalog.local').pathname;
      const decodedPath = decodeURIComponent(pathname);
      const requested = ['/', '/downloads', '/downloads/'].includes(decodedPath)
        ? 'framework-preview.html'
        : decodedPath.replace(/^[/\\]+/, '');
      file = resolve(root, requested);
    } catch {
      response.writeHead(400).end();
      return;
    }

    if (!isInsideRoot(file)) {
      response.writeHead(403).end();
      return;
    }

    try {
      const body = await readFile(file);
      response.writeHead(200, { 'content-type': mime[extname(file)] ?? 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
}

if (import.meta.main) {
  const server = createCatalogServer();
  server.listen(port, '127.0.0.1', () => {
    const address = server.address();
    const boundPort = typeof address === 'object' && address ? address.port : port;
    console.log(`UI catalog dist server: http://127.0.0.1:${boundPort}/framework-preview.html`);
  });
}
