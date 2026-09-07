import assert from 'node:assert/strict';
import { once } from 'node:events';
import { get } from 'node:http';
import { spawn } from 'node:child_process';

function request(port, path) {
  return new Promise((resolve, reject) => {
    const client = get({ host: '127.0.0.1', port, path }, (response) => {
      response.resume();
      response.on('end', () => resolve(response.statusCode));
    });
    client.on('error', reject);
  });
}

const server = spawn(process.execPath, ['scripts/serve-ui-catalog.mjs'], {
  cwd: process.cwd(),
  env: { ...process.env, UI_CATALOG_PORT: '0' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

try {
  let output = '';
  server.stdout.on('data', (chunk) => { output += chunk; });
  await Promise.race([
    once(server.stdout, 'data'),
    once(server, 'exit').then(([code]) => Promise.reject(new Error(`Server exited early: ${code}`))),
  ]);
  const port = Number(output.match(/127\.0\.0\.1:(\d+)/)?.[1]);
  assert.ok(port > 0, 'Server did not report an ephemeral port.');

  assert.equal(await request(port, '/%ZZ'), 400, 'Malformed encoding must be rejected.');
   assert.equal(await request(port, '/framework-preview.html?v=1'), 200, 'Query strings must not affect file lookup.');
   assert.equal(await request(port, '/ui-web-tokens.css'), 200, 'The generated public SDK token asset must be served.');
  assert.equal(await request(port, '/missing.html'), 404, 'Missing files must return 404.');
  assert.equal(await request(port, '/%2e%2e%2fpackage.json'), 403, 'Traversal must be rejected.');
  assert.equal(await request(port, '/framework-preview.html'), 200, 'Server must remain available after invalid requests.');
  console.log('UI catalog server verification passed.');
} finally {
  server.kill();
  await once(server, 'exit');
}
