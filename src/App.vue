<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavigationBar from '@/assets/NavigationBar.vue'
</script>

<template>
  <v-app>
    <NavigationBar />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&display=swap');

body {
  font-family: 'Cabin', sans-serif;
}
a,
a:link,
a:visited {
  text-decoration: none;
  color: inherit;
}
</style>
