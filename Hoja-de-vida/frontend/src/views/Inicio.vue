<template>
  <section class="hero">
    <img :src="`${base}img/perfil.png`" alt="Foto de Miguel" />
    <h1>Miguel</h1>
    <p>Estudiante de Ingeniería de Software · Universidad de Cartagena</p>
  </section>
  <main>
    <div class="tarjeta">
      <h2>Bienvenido</h2>
      <p>Esta es mi hoja de vida digital, donde comparto un poco sobre mí, mi formación académica y mis datos de contacto. Navega usando el menú superior para conocer más.</p>
    </div>
    <div class="tarjeta">
      <h2>Habilidades destacadas</h2>
      <span v-for="h in habilidades" :key="h" class="etiqueta">{{ h }}</span>
    </div>
  </main>
</template>

<script setup>
const base = import.meta.env.BASE_URL
const habilidades = ['Linux', 'Open Source', 'Arch Linux', 'Terminal / CLI', 'HTML & CSS', 'Bases de Datos', 'Vue.js']
</script>
