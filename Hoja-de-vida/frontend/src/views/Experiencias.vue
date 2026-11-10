<script setup>
import { ref, onMounted } from 'vue'
import { listarExperiencias } from '../services/api'

const datos = ref([])
const estado = ref('cargando')
const fmt = (d) => (d ? new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', timeZone: 'UTC' }) : '')

onMounted(async () => {
  try {
    datos.value = await listarExperiencias()
    estado.value = 'ok'
  } catch {
    estado.value = 'error'
  }
})
</script>

<template>
  <main>
    <div class="tarjeta">
      <h2>Experiencias profesionales</h2>
      <p>Datos obtenidos desde mi API (Node.js, Express y MongoDB).</p>
    </div>
    <div v-if="estado === 'cargando'" class="tarjeta"><p>Cargando...</p></div>
    <div v-else-if="estado === 'error'" class="tarjeta"><p>API no disponible en este momento.</p></div>
    <div v-else-if="!datos.length" class="tarjeta"><p>Sin experiencias registradas.</p></div>
    <template v-else>
      <div v-for="e in datos" :key="e._id" class="tarjeta">
        <h2>{{ e.cargo }} · {{ e.empresa }}</h2>
        <p>{{ fmt(e.fechaInicio) }} – {{ e.actual ? 'Actualidad' : fmt(e.fechaFin) }}<template v-if="e.ubicacion"> · {{ e.ubicacion }}</template></p>
        <p>{{ e.descripcion }}</p>
        <div class="acciones" style="margin-bottom: 1.4rem">
          <span v-for="t in e.tecnologias" :key="t" class="etiqueta">{{ t }}</span>
        </div>
      </div>
    </template>
  </main>
</template>
