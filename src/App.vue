<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavigationBar from '@/assets/NavigationBar.vue'
</script>

<template>
  <v-app style="max-width: 1300px; margin: 0 auto;">
    <NavigationBar />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

body {
  font-family: 'Cabin', sans-serif;
}

h2 {
  font-family: 'Playfair Display', serif;
}

a,
a:link,
a:visited {
  text-decoration: none;
  color: inherit;
}
</style>
