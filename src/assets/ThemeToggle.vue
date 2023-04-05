<template>
    <v-btn @click="toggleTheme">toggle theme</v-btn>
</template>
  
<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { useTheme } from 'vuetify'

const theme = useTheme()

const storedTheme = useLocalStorage('theme', theme.global.name.value)

if (storedTheme.value) {
  theme.global.name.value = storedTheme.value
}

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  storedTheme.value = theme.global.name.value
}

</script>