<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style>
/* Police globale */
* {
  font-family: 'Montserrat Alternates', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Montserrat Alternates', sans-serif;
}

#app {
  font-family: 'Montserrat Alternates', sans-serif;
}
</style>
