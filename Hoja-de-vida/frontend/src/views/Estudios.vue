<template>
  <main>
    <div class="tarjeta">
      <div class="linea-tiempo" style="margin: 1.4rem 1.6rem">
        <h3>Ingeniería de Software</h3>
        <p><strong>Universidad de Cartagena</strong> — Sede Magangué (Montecarlos)</p>
        <p>Actualmente cursando el programa, con formación en desarrollo de software, bases de datos, física, cálculo y competencias generales.</p>
      </div>
      <div class="linea-tiempo" style="margin: 0 1.6rem 1.6rem">
        <h3>Educación básica y media</h3>
        <p>Formación previa completada antes de ingresar a la universidad.</p>
      </div>
    </div>
    <div class="tarjeta">
      <h2>Cursos y áreas trabajadas</h2>
      <span v-for="c in cursos" :key="c" class="etiqueta">{{ c }}</span>
    </div>
  </main>
</template>

<script setup>
const cursos = ['Programación', 'Bases de Datos', 'Física', 'Cálculo', 'Desarrollo Web', 'Trabajo Colaborativo (CIPA)']
</script>
