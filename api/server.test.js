const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

process.env.ADMIN_PASSWORD = 'a-test-password';
process.env.JWT_SECRET = 'test-secret-with-at-least-32-characters';
process.env.NODE_ENV = 'production';

const { app } = require('./server');
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

test('requires authentication before accepting experience changes', async () => {
  const response = await fetch(`${origin}/api/experiencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ empresa: 'Acme', cargo: 'Developer' }),
  });

  assert.equal(response.status, 401);
  assert.match((await response.json()).error, /Inicia sesión/);
});

test('serves the SPA routes but keeps unknown API routes as JSON 404s', async () => {
  const page = await fetch(`${origin}/admin`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /<div id="root"><\/div>/);

  const unknownApi = await fetch(`${origin}/api/unknown`);
  assert.equal(unknownApi.status, 404);
  assert.doesNotMatch(unknownApi.headers.get('content-type'), /text\/html/);
});

test('creates an HttpOnly admin session and can end it', async () => {
  const invalidLogin = await fetch(`${origin}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'wrong-password' }),
  });
  assert.equal(invalidLogin.status, 401);

  const login = await fetch(`${origin}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
  });
  assert.equal(login.status, 200);
  assert.match(login.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(login.headers.get('set-cookie'), /SameSite=None/i);
  assert.match(login.headers.get('set-cookie'), /Secure/i);
  const cookie = login.headers.get('set-cookie').split(';', 1)[0];

  const session = await fetch(`${origin}/api/auth/session`, {
    headers: { Cookie: cookie },
  });
  assert.equal(session.status, 200);
  assert.deepEqual(await session.json(), { authenticated: true });

  const logout = await fetch(`${origin}/api/auth/logout`, {
    method: 'POST',
    headers: { Cookie: cookie },
  });
  assert.equal(logout.status, 200);

  const expiredSession = await fetch(`${origin}/api/auth/session`, {
    headers: { Cookie: logout.headers.get('set-cookie').split(';', 1)[0] },
  });
  assert.equal(expiredSession.status, 200);
  assert.deepEqual(await expiredSession.json(), { authenticated: false });
});
