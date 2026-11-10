const BASE = (import.meta.env.VITE_API_URL || '') + '/api'
const TOKEN_KEY = 'token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && auth) clearToken()
    const err = new Error(data.error || `Error ${res.status}`)
    err.status = res.status
    throw err
  }
  return data
}

export const login = (usuario, password) => request('/auth/login', { method: 'POST', body: { usuario, password } })
export const listarExperiencias = () => request('/experiencias')
export const crearExperiencia = (d) => request('/experiencias', { method: 'POST', body: d, auth: true })
export const actualizarExperiencia = (id, d) => request(`/experiencias/${id}`, { method: 'PUT', body: d, auth: true })
export const eliminarExperiencia = (id) => request(`/experiencias/${id}`, { method: 'DELETE', auth: true })
