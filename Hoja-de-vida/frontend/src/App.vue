<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, cerrarSesion } from './services/auth'

const router = useRouter()
const abierto = ref(false)
const mostrarArriba = ref(false)
const temas = [
  ['violeta', '🟣 Violeta'], ['gruvbox', '🟠 Gruvbox'], ['nord', '🔵 Nord'],
  ['tokyo-night', '🌌 Tokyo Night'], ['catppuccin', '🌸 Catppuccin'], ['kanagawa', '🍃 Kanagawa'],
]
const tema = ref(localStorage.getItem('temaPreferido') || 'violeta')

function cambiarTema() {
  document.documentElement.setAttribute('data-theme', tema.value)
  localStorage.setItem('temaPreferido', tema.value)
}
function salir() {
  cerrarSesion()
  abierto.value = false
  router.push('/')
}
const onScroll = () => (mostrarArriba.value = window.scrollY > 300)
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header>
    <div class="nav-container">
      <div class="logo">Miguel</div>
      <div class="nav-controles">
        <select v-model="tema" class="selector-tema" aria-label="Elegir tema de colores" @change="cambiarTema">
          <option v-for="[v, n] in temas" :key="v" :value="v">{{ n }}</option>
        </select>
        <button class="nav-toggle" type="button" aria-label="Alternar navegación" @click="abierto = !abierto">☰</button>
      </div>
      <nav class="menu" :class="{ abierto }" @click="abierto = false">
        <ul>
          <li><router-link to="/" exact-active-class="router-link-exact-active">Inicio</router-link></li>
          <li><router-link to="/sobre-mi">Sobre mí</router-link></li>
          <li><router-link to="/estudios">Estudios</router-link></li>
          <li><router-link to="/experiencias">Experiencias</router-link></li>
          <li><router-link to="/contacto">Contacto</router-link></li>
          <li v-if="auth.logueado"><router-link to="/admin">Admin</router-link></li>
          <li v-if="auth.logueado"><a href="#" @click.prevent="salir">Salir</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <router-view />

  <footer><p>&copy; 2026 Miguel — Universidad de Cartagena</p></footer>
  <button v-show="mostrarArriba" id="btnArriba" type="button" aria-label="Volver arriba"
    @click="scrollTo({ top: 0, behavior: 'smooth' })">↑</button>
</template>
