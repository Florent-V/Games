<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from './layout/AppHeader.vue';
import AppFooter from './layout/AppFooter.vue';
</script>

<template>
  <div class="flex items-center min-h-screen flex-col bg-base-200">
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-grow container mx-auto p-4">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
/* You can add component-specific styles here if needed */
</style>
