const { del, get, list, put } = require('@vercel/blob');

const PREFIX = 'experiencias/';

function assertBlobConfigured() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('El almacenamiento de Vercel Blob no está configurado.');
  }
}

async function getBlobJson(pathname) {
  const blob = await get(pathname, { access: 'private', useCache: false });
  if (!blob) return null;
  if (blob.statusCode !== 200) {
    throw new Error(`No se pudo leer el registro (${blob.statusCode}).`);
  }
  return new Response(blob.stream).json();
}

async function findBlobByPathname(pathname) {
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor });
    const match = page.blobs.find((blob) => blob.pathname === pathname);
    if (match) return match;
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return null;
}

async function saveExperience(experience) {
  assertBlobConfigured();
  await put(
    `${PREFIX}${experience._id}.json`,
    JSON.stringify(experience),
    {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    },
  );
  return experience;
}

async function listExperiences() {
  assertBlobConfigured();
  const experiences = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor });
    for (const blob of page.blobs) {
      const experience = await getBlobJson(blob.pathname);
      if (experience) experiences.push(experience);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return experiences.sort(
    (left, right) => new Date(right.fechaInicio) - new Date(left.fechaInicio),
  );
}

async function findExperience(id) {
  assertBlobConfigured();
  const pathname = `${PREFIX}${id}.json`;
  if (!(await findBlobByPathname(pathname))) return null;
  return getBlobJson(pathname);
}

async function deleteExperience(id) {
  assertBlobConfigured();
  const pathname = `${PREFIX}${id}.json`;
  const blob = await findBlobByPathname(pathname);
  if (!blob) return false;
  await del(blob.url);
  return true;
}

async function checkStorage() {
  assertBlobConfigured();
  await list({ prefix: PREFIX, limit: 1 });
}

module.exports = {
  deleteExperience,
  findExperience,
  listExperiences,
  saveExperience,
  checkStorage,
};
