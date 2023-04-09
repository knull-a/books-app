<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NavigationBar from '@/components/NavigationBar.vue'
import HeaderBar from '@/components/HeaderBar.vue';
import { useUserStore } from '@/stores/users';

const userStore = useUserStore()
onMounted(() => {
  userStore.getUser()
})
</script>

<template>
  <v-app>
    <header>
      <HeaderBar />
    </header>
      <NavigationBar />
      <v-main style="max-width: 1300px; margin: 0 auto">
        <RouterView />
      </v-main>
  </v-app>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

.wrapper {
  max-width: 1300px;
  margin: 0 auto;
}

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
