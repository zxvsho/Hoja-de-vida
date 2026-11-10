const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

process.env.ADMIN_PASSWORD = 'a-test-password';
process.env.JWT_SECRET = 'test-secret-with-at-least-32-characters';
process.env.BLOB_READ_WRITE_TOKEN = '';
process.env.CORS_ORIGIN = 'https://zxvsho.github.io';

const { app, validateExperience } = require('./server');
let server;
let origin;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

test('reports missing Vercel Blob storage as unavailable JSON', async () => {
  const response = await fetch(`${origin}/api/health`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    status: 'unavailable',
    error: 'El almacenamiento de Vercel Blob no está configurado.',
  });
});

test('requires an admin session before writes', async () => {
  const response = await fetch(`${origin}/api/experiencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ empresa: 'Acme', cargo: 'Developer' }),
  });
  assert.equal(response.status, 401);
  assert.match((await response.json()).error, /Inicia sesión/);
});

test('creates and clears an HttpOnly admin session', async () => {
  const login = await fetch(`${origin}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://zxvsho.github.io',
    },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
  });
  assert.equal(login.status, 200);
  assert.match(login.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(login.headers.get('set-cookie'), /SameSite=None/i);
  assert.match(login.headers.get('set-cookie'), /Secure/i);
  assert.match(login.headers.get('set-cookie'), /Partitioned/i);
  const cookie = login.headers.get('set-cookie').split(';', 1)[0];

  const session = await fetch(`${origin}/api/auth/session`, {
    headers: { Cookie: cookie },
  });
  assert.deepEqual(await session.json(), { authenticated: true });

  const logout = await fetch(`${origin}/api/auth/logout`, {
    method: 'POST',
    headers: {
      Cookie: cookie,
      Origin: 'https://zxvsho.github.io',
    },
  });
  assert.equal(logout.status, 200);
});

test('rejects invalid experience input and untrusted mutation origins', async () => {
  assert.match(validateExperience({ cargo: 'Developer' }), /empresa/);
  assert.match(
    validateExperience({
      empresa: 'Acme',
      cargo: 'Developer',
      fechaInicio: 'not-a-date',
    }),
    /fecha de inicio/,
  );

  const response = await fetch(`${origin}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://example.com',
    },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
  });
  assert.equal(response.status, 403);
});

test('keeps unknown API routes as JSON 404 responses', async () => {
  const response = await fetch(`${origin}/api/unknown`);
  assert.equal(response.status, 404);
  assert.match(response.headers.get('content-type'), /application\/json/);
});

test('handles browser CORS preflight requests', async () => {
  const response = await fetch(`${origin}/api/auth/login`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://zxvsho.github.io',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });
  assert.equal(response.status, 204);
  assert.equal(
    response.headers.get('access-control-allow-origin'),
    'https://zxvsho.github.io',
  );
  assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
});
