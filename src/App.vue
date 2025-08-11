<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, watchEffect } from 'vue'

// --- Theme Management ---
const themes = ref([
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
]);
const currentTheme = ref(localStorage.getItem('theme') || 'dark');

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', currentTheme.value);
  localStorage.setItem('theme', currentTheme.value);
});

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
};
</script>

<template>
  <div class="flex min-h-screen flex-col bg-base-200">
    <!-- Navbar -->
    <header class="navbar bg-base-100 shadow-md">
      <div class="navbar-start">
        <a class="btn btn-ghost text-xl normal-case">2048 Game</a>
      </div>

      <div class="navbar-center">
        <!-- Future menu items can go here -->
        <ul class="menu menu-horizontal p-0">
          <!-- <li><a>Menu 1</a></li> -->
          <!-- <li><a>Menu 2</a></li> -->
        </ul>
      </div>

      <div class="navbar-end">
        <!-- Theme Toggle Icon -->
        <label class="swap swap-rotate btn btn-ghost btn-circle">
          <input type="checkbox" @click="toggleTheme" :checked="currentTheme === 'light'" />
          <!-- sun icon -->
          <v-icon name="md-lightmode-outlined" class="swap-on h-5 w-5 fill-current" />
          <!-- moon icon -->
          <v-icon name="md-darkmode-outlined" class="swap-off h-5 w-5 fill-current" />
        </label>

        <!-- Theme Dropdown -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
          </label>
          <ul tabindex="0" class="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
            <li v-for="theme in themes" :key="theme">
              <a @click="currentTheme = theme">{{ theme }}</a>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto p-4">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="footer footer-center bg-base-300 p-4 text-base-content">
      <aside>
        <p>Copyright © {{ new Date().getFullYear() }} - Made with ❤️ by Florent Vasseur</p>
      </aside>
    </footer>
  </div>
</template>

<style scoped>
/* You can add component-specific styles here if needed */
</style>