<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { iniciarSesion } from '../services/auth'

const router = useRouter()
const route = useRoute()
const usuario = ref('')
const password = ref('')
const error = ref('')
const cargando = ref(false)

async function entrar() {
  error.value = ''
  cargando.value = true
  try {
    await iniciarSesion(usuario.value.trim(), password.value)
    router.push(route.query.redirect || '/admin')
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <main style="max-width: 460px">
    <div class="tarjeta">
      <h2>Acceso administrador</h2>
      <form @submit.prevent="entrar">
        <input v-model="usuario" type="text" placeholder="Usuario" autocomplete="username" required />
        <input v-model="password" type="password" placeholder="Contraseña" autocomplete="current-password" required />
        <span class="mensaje-error">{{ error }}</span>
        <button type="submit" :disabled="cargando">{{ cargando ? 'Entrando...' : 'Entrar' }}</button>
      </form>
    </div>
  </main>
</template>
