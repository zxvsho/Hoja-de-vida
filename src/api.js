const API_URL = (
  import.meta.env.VITE_API_URL || "/api/experiencias"
).replace(/\/+$/, "");
const API_ROOT = API_URL.replace(/\/experiencias$/, "");

async function requestAt(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("La API devolvió una respuesta que no es JSON válido.");
  }

  if (!response.ok) {
    const error = new Error(
      data?.error || data?.mensaje || `Error HTTP ${response.status}`,
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

function request(path = "", options = {}) {
  return requestAt(`${API_URL}${path}`, options);
}

function requestAuth(path, options) {
  return requestAt(`${API_ROOT}/auth/${path}`, options);
}

export function verificarSesionAdmin() {
  return requestAuth("session").then((session) => session.authenticated);
}

export function iniciarSesionAdmin(password) {
  return requestAuth("login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function cerrarSesionAdmin() {
  return requestAuth("logout", { method: "POST" });
}

export async function listarExperiencias() {
  const experiencias = await request();
  if (!Array.isArray(experiencias)) {
    throw new Error("La API devolvió un listado de experiencias con formato inválido.");
  }
  return experiencias;
}

export function crearExperiencia(experiencia) {
  return request("", {
    method: "POST",
    body: JSON.stringify(experiencia),
  });
}

export function actualizarExperiencia(id, experiencia) {
  return request(`/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(experiencia),
  });
}

export function eliminarExperiencia(id) {
  return request(`/${encodeURIComponent(id)}`, { method: "DELETE" });
}
