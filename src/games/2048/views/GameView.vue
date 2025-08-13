<script setup lang="ts">
import GameBoard from '@/games/2048/components/GameBoard.vue';
import { useGame } from '@/games/2048/composables/useGame';

const { tiles, score, isGameOver, restart, move, bestScore } = useGame();
</script>

<template>
  <div class="game-2048-container flex flex-col items-center justify-start w-full py-10">
    <header class="w-full max-w-md px-4 flex items-center justify-between mb-6">
      <h1 class="text-4xl font-extrabold">2048</h1>
      <div class="flex gap-3 items-center">
        <div class="score-box">
          <span class="text-sm text-gray-500">BEST</span>
          <span class="text-xl font-bold text-gray-800">{{ bestScore }}</span>
        </div>
        <div class="score-box">
          <span class="text-sm text-gray-500">SCORE</span>
          <span class="text-xl font-bold text-gray-800">{{ score }}</span>
        </div>
        <button class="btn btn-primary btn-sm" @click="restart">New Game</button>
      </div>
    </header>

    <main class="relative w-full max-w-md">
      <GameBoard :tiles="tiles" @move="move" />
      <div v-if="isGameOver" class="game-over-overlay">
        <h2 class="text-3xl font-bold">Game Over!</h2>
        <button class="btn btn-secondary mt-4" @click="restart">Try Again</button>
      </div>
    </main>

    <footer class="mt-8 text-sm text-center text-gray-500">
      <p>Join the numbers and get to the <strong>2048 tile!</strong></p>
    </footer>
  </div>
</template>
