<script setup lang="ts">
import { shallowRef } from 'vue';
import { RouterLink } from 'vue-router';
import Game2048Icon from '@/components/Game2048Icon.vue'
import SnakeIcon from '@/components/SnakeIcon.vue';
import TetrisIcon from '@/components/TetrisIcon.vue';

const games = shallowRef([
  {
    name: '2048',
    description: 'Faites glisser les tuiles pour fusionner les nombres et atteindre 2048.',
    routeName: 'game-2048',
    icon: Game2048Icon
  },
  {
    name: 'Snake',
    description: 'Mangez la nourriture, grandissez, mais ne vous mordez pas la queue !',
    routeName: 'game-snake',
    icon: SnakeIcon
  },
  {
    name: 'Tetris',
    description: 'Empilez les blocs pour compléter des lignes et marquer des points.',
    routeName: 'game-tetris',
    icon: TetrisIcon,
    disabled: true
  },
]);

</script>

<template>
  <div class="p-4 sm:p-8">
    <header class="text-center mb-10">
      <h1 class="text-4xl sm:text-5xl font-extrabold">Ma Collection de Jeux</h1>
      <p class="text-lg text-base-content/70 mt-2">Une sélection de jeux classiques réinventés.</p>
    </header>

    <main>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <RouterLink
          v-for="game in games"
          :key="game.name"
          :to="{ name: game.routeName }"
          :class="[
            'card bg-base-100 shadow-lg transition-shadow duration-300 ease-in-out',
            { 'hover:shadow-2xl transform hover:-translate-y-1': !game.disabled, 'cursor-not-allowed': game.disabled }
          ]"
          :is="game.disabled ? 'div' : 'RouterLink'"
        >
          <figure class="px-10 pt-10">
            <component
              :is="game.icon"
              class="w-16 h-16 text-primary"
              :class="{ 'opacity-50': game.disabled }"
            />
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title text-2xl font-bold">{{ game.name }}</h2>
            <p class="text-base-content/80">{{ game.description }}</p>
            <div class="card-actions mt-4">
              <button class="btn btn-primary" :disabled="game.disabled">Jouer</button>
            </div>
          </div>
        </RouterLink>
      </div>
    </main>
  </div>
</template>
