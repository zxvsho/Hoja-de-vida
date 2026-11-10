<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listarExperiencias, crearExperiencia, actualizarExperiencia, eliminarExperiencia } from '../services/api'
import { auth } from '../services/auth'

const router = useRouter()
const lista = ref([])
const error = ref('')
const msg = ref('')
const editandoId = ref(null)
const mostrarForm = ref(false)

const vacio = () => ({ empresa: '', cargo: '', descripcion: '', ubicacion: '', fechaInicio: '', fechaFin: '', actual: false, tecnologias: '' })
const form = reactive(vacio())
const fmt = (d) => (d ? new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', timeZone: 'UTC' }) : '—')
const aInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '')

function manejar(e) {
  if (e.status === 401) {
    auth.logueado = false
    router.push({ name: 'login', query: { redirect: '/admin' } })
  } else {
    error.value = e.message
  }
}

async function cargar() {
  try {
    lista.value = await listarExperiencias()
  } catch (e) {
    error.value = e.message
  }
}

function nueva() {
  Object.assign(form, vacio())
  editandoId.value = null
  mostrarForm.value = true
  error.value = msg.value = ''
}

function editar(e) {
  Object.assign(form, {
    empresa: e.empresa, cargo: e.cargo, descripcion: e.descripcion || '', ubicacion: e.ubicacion || '',
    fechaInicio: aInput(e.fechaInicio), fechaFin: aInput(e.fechaFin), actual: !!e.actual,
    tecnologias: (e.tecnologias || []).join(', '),
  })
  editandoId.value = e._id
  mostrarForm.value = true
  error.value = msg.value = ''
}

async function guardar() {
  error.value = msg.value = ''
  const datos = {
    empresa: form.empresa.trim(), cargo: form.cargo.trim(), descripcion: form.descripcion.trim(),
    ubicacion: form.ubicacion.trim(), fechaInicio: form.fechaInicio, actual: form.actual,
    fechaFin: form.actual || !form.fechaFin ? null : form.fechaFin,
    tecnologias: form.tecnologias.split(',').map((t) => t.trim()).filter(Boolean),
  }
  try {
    if (editandoId.value) await actualizarExperiencia(editandoId.value, datos)
    else await crearExperiencia(datos)
    msg.value = editandoId.value ? 'Experiencia actualizada.' : 'Experiencia creada.'
    mostrarForm.value = false
    await cargar()
  } catch (e) {
    manejar(e)
  }
}

async function borrar(e) {
  if (!confirm(`¿Eliminar "${e.cargo} · ${e.empresa}"?`)) return
  error.value = msg.value = ''
  try {
    await eliminarExperiencia(e._id)
    msg.value = 'Experiencia eliminada.'
    await cargar()
  } catch (err) {
    manejar(err)
  }
}

onMounted(cargar)
</script>

<template>
  <main>
    <div class="tarjeta">
      <h2>Administrar experiencias</h2>
      <div class="barra">
        <span class="mensaje-exito">{{ msg }}</span>
        <button type="button" @click="nueva">Nueva experiencia</button>
      </div>
      <p v-if="error" class="mensaje-error" style="margin-left: 1.6rem">{{ error }}</p>

      <form v-if="mostrarForm" @submit.prevent="guardar">
        <label>Empresa *</label><input v-model="form.empresa" required />
        <label>Cargo *</label><input v-model="form.cargo" required />
        <label>Descripción</label><textarea v-model="form.descripcion" rows="3"></textarea>
        <label>Ubicación</label><input v-model="form.ubicacion" />
        <label>Fecha de inicio *</label><input v-model="form.fechaInicio" type="date" required />
        <label class="check"><input v-model="form.actual" type="checkbox" /> Trabajo actual</label>
        <template v-if="!form.actual">
          <label>Fecha de fin</label><input v-model="form.fechaFin" type="date" :min="form.fechaInicio" />
        </template>
        <label>Tecnologías (separadas por coma)</label><input v-model="form.tecnologias" placeholder="Node.js, Express, MongoDB" />
        <div class="acciones">
          <button type="submit">{{ editandoId ? 'Actualizar' : 'Crear' }}</button>
          <button type="button" class="sec" @click="mostrarForm = false">Cancelar</button>
        </div>
      </form>

      <div class="tabla-wrap" style="margin-top: 1rem">
        <table>
          <thead><tr><th>Cargo</th><th>Empresa</th><th>Periodo</th><th></th></tr></thead>
          <tbody>
            <tr v-if="!lista.length"><td colspan="4">Sin experiencias registradas.</td></tr>
            <tr v-for="e in lista" :key="e._id">
              <td>{{ e.cargo }}</td>
              <td>{{ e.empresa }}</td>
              <td>{{ fmt(e.fechaInicio) }} – {{ e.actual ? 'Actualidad' : fmt(e.fechaFin) }}</td>
              <td>
                <div class="acciones">
                  <button type="button" @click="editar(e)">Editar</button>
                  <button type="button" class="peligro" @click="borrar(e)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
