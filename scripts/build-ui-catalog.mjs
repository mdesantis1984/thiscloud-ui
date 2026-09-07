import { cp, copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { build } from 'esbuild';
import JavaScriptObfuscator from 'javascript-obfuscator';

const root = resolve(import.meta.dirname, '..');
const catalog = resolve(root, 'apps/catalog');
const source = resolve(catalog, 'framework-preview.html');
const css = resolve(catalog, 'catalog.css');
const script = resolve(catalog, 'catalog.js');
const assets = resolve(catalog, 'assets');
const output = resolve(catalog, 'dist');
const webSource = resolve(root, 'packages/ui-web/src/index.js');
const webTokens = resolve(root, 'packages/ui-web/src/tokens.css');
const webOutput = resolve(root, 'packages/ui-web/dist');
const profile = process.argv[2] ?? 'production';

function insideCatalog(path) {
  const value = relative(catalog, path);
  return value && !value.startsWith(`..${sep}`) && value !== '..';
}

if (!insideCatalog(output)) throw new Error('Refusing to clean an output path outside the catalog.');
if (!['development', 'production'].includes(profile)) throw new Error(`Unknown profile: ${profile}`);

const [html, cssSource, scriptSource, webTokensSource] = await Promise.all([
  readFile(source, 'utf8'),
  readFile(css, 'utf8'),
  readFile(script, 'utf8'),
  readFile(webTokens, 'utf8'),
]);

if (/<style\b|<script\b(?![^>]*\bsrc=)/i.test(html)) {
  throw new Error('The catalog shell must reference external CSS and JavaScript only.');
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await mkdir(webOutput, { recursive: true });
await cp(assets, resolve(output, 'assets'), { recursive: true });

await Promise.all([
  build({ entryPoints: [webSource], bundle: true, format: 'esm', platform: 'browser', loader: { '.html': 'text', '.css': 'text' }, outfile: resolve(webOutput, 'index.js'), logLevel: 'info' }),
  build({ entryPoints: [webSource], bundle: true, format: 'iife', globalName: 'ThiscloudUiWeb', platform: 'browser', loader: { '.html': 'text', '.css': 'text' }, outfile: resolve(output, 'ui-web.js'), logLevel: 'info' }),
  copyFile(webTokens, resolve(webOutput, 'tokens.css')),
  build({ stdin: { contents: webTokensSource, sourcefile: 'tokens.css', loader: 'css', resolveDir: resolve(root, 'packages/ui-web/src') }, bundle: false, minify: profile === 'production', outfile: resolve(output, 'ui-web-tokens.css'), logLevel: 'info' }),
]);

await build({
  stdin: { contents: cssSource, sourcefile: 'catalog.css', loader: 'css', resolveDir: catalog },
  // Local font URLs remain stable because assets are copied to the same relative path.
  bundle: false,
  minify: profile === 'production',
  outfile: resolve(output, 'catalog.css'),
  logLevel: 'info',
});

const bundled = await build({
  stdin: { contents: scriptSource, sourcefile: 'catalog.js', loader: 'js', resolveDir: catalog },
  bundle: true,
  format: 'iife',
  minify: profile === 'production',
  write: false,
  logLevel: 'info',
});

let javascript = bundled.outputFiles[0].text;
if (profile === 'production') {
  javascript = JavaScriptObfuscator.obfuscate(javascript, {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: false,
    seed: 242026,
    sourceMap: false,
    stringArray: true,
    stringArrayThreshold: 0.35,
  }).getObfuscatedCode();
}

await Promise.all([
  writeFile(resolve(output, 'framework-preview.html'), html),
  writeFile(resolve(output, 'catalog.js'), javascript),
]);
