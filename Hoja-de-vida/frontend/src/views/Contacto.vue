<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ nombre: '', correo: '', mensaje: '' })
const errores = reactive({ nombre: '', correo: '', mensaje: '' })
const exito = ref('')

function validar() {
  errores.nombre = form.nombre.trim().length < 3 ? 'Escribe tu nombre completo (mínimo 3 caracteres).' : ''
  errores.correo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim()) ? '' : 'Ingresa un correo válido, ej: nombre@correo.com'
  errores.mensaje = form.mensaje.trim().length < 10 ? 'Tu mensaje debe tener al menos 10 caracteres.' : ''
  return !errores.nombre && !errores.correo && !errores.mensaje
}

function enviar() {
  exito.value = ''
  if (!validar()) return
  exito.value = `¡Gracias, ${form.nombre.trim()}! Tu mensaje fue validado correctamente.`
  Object.assign(form, { nombre: '', correo: '', mensaje: '' })
}
const limpiar = (k) => (errores[k] = '')
</script>

<template>
  <main>
    <div class="grid-dos-x">
      <div class="tarjeta">
        <h2>Datos de contacto</h2>
        <ul class="contacto-lista">
          <li>📧 <a href="mailto:miguelandrescuellotarriba600@gmail.com">miguelandrescuellotarriba600@gmail.com</a></li>
          <li>🐙 <a href="https://github.com/zxvsho" target="_blank" rel="noopener">github.com/zxvsho</a></li>
          <li>📍 Magangué, Bolívar, Colombia</li>
        </ul>
      </div>
      <div class="tarjeta">
        <h2>Escríbeme</h2>
        <form novalidate @submit.prevent="enviar">
          <input v-model="form.nombre" :class="{ 'campo-invalido': errores.nombre }" type="text" placeholder="Tu nombre" @input="limpiar('nombre')" />
          <span class="mensaje-error">{{ errores.nombre }}</span>
          <input v-model="form.correo" :class="{ 'campo-invalido': errores.correo }" type="email" placeholder="Tu correo" @input="limpiar('correo')" />
          <span class="mensaje-error">{{ errores.correo }}</span>
          <textarea v-model="form.mensaje" :class="{ 'campo-invalido': errores.mensaje }" rows="4" placeholder="Tu mensaje" @input="limpiar('mensaje')"></textarea>
          <span class="mensaje-error">{{ errores.mensaje }}</span>
          <button type="submit">Enviar</button>
          <p class="mensaje-exito" role="status">{{ exito }}</p>
        </form>
        <p style="margin-top: 0.8rem; font-size: 0.85rem; color: var(--texto-suave)">* Este formulario valida los datos en el navegador (no envía datos reales aún).</p>
      </div>
    </div>
  </main>
</template>
