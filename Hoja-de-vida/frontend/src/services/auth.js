import { reactive } from 'vue'
import { getToken, setToken, clearToken, login as apiLogin } from './api'

export const auth = reactive({ logueado: !!getToken() })

export async function iniciarSesion(usuario, password) {
  const { token } = await apiLogin(usuario, password)
  setToken(token)
  auth.logueado = true
}

export function cerrarSesion() {
  clearToken()
  auth.logueado = false
}
