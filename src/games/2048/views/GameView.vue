<script setup lang="ts">
import GameBoard from '@/games/2048/components/GameBoard.vue';
import { useGame } from '@/games/2048/composables/useGame';
import { ref, computed } from 'vue';

const { tiles, score, isGameOver, restart, move, bestScore, gameMode, powerUps, getPowerUp } = useGame();
const showRules = ref(false);
const showModeSelection = ref(false);

const undoPowerUp = computed(() => getPowerUp('undo'));

function selectMode(mode: 'classic' | 'power-up') {
  restart(mode);
  showModeSelection.value = false;
}
</script>

<template>
  <div class="game-2048-container flex flex-col items-center justify-start w-full py-10 gap-10">
    <div class="w-full max-w-md px-4 text-center">
      <h1 class="text-6xl font-extrabold mb-4">2048</h1>
      <div class="flex items-center justify-between">
        <button class="btn btn-secondary" @click="showModeSelection = true">New Game</button>
        <div class="flex gap-3 items-center">
          <div class="bg-primary text-primary-content p-3 rounded-md text-center flex flex-col w-24">
            <span class="text-2xl font-bold">{{ bestScore }}</span>
            <span class="text-sm">BEST</span>
          </div>
          <div class="bg-primary text-primary-content p-3 rounded-md text-center flex flex-col w-24">
            <span class="text-2xl font-bold">{{ score }}</span>
            <span class="text-sm">SCORE</span>
          </div>
        </div>
        <button class="btn btn-secondary" @click="showRules = true">Rules</button>
      </div>
    </div>

    <main class="relative">
      <GameBoard :tiles="tiles" @move="move" />
      <div v-if="isGameOver" class="game-over-overlay">
        <h2 class="text-3xl font-bold">Game Over!</h2>
        <button class="btn btn-secondary mt-4" @click="showModeSelection = true">Try Again</button>
      </div>
    </main>

    <div v-if="gameMode === 'power-up' && undoPowerUp" class="flex items-center gap-4">
      <button class="btn btn-lg btn-ghost" @click="undoPowerUp.action" :disabled="undoPowerUp.count.value === 0">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8a5 5 0 010 10H9" /></svg>
        <div class="badge badge-secondary">{{ undoPowerUp.count.value }}</div>
      </button>
    </div>

    <div class="text-sm text-center text-gray-500">
      <p>Join the numbers and get to the <strong>2048 tile!</strong></p>
    </div>

    <!-- Rules Modal -->
    <div v-if="showRules" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-base-100 p-8 rounded-lg max-w-md">
        <h2 class="text-2xl font-bold mb-4">How to play</h2>
        <p class="mb-4">Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</p>
        <p>Join the numbers and get to the <strong>2048 tile!</strong></p>
        <button class="btn btn-primary mt-6" @click="showRules = false">Got it!</button>
      </div>
    </div>

    <!-- Mode Selection Modal -->
    <div v-if="showModeSelection" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-base-100 p-8 rounded-lg max-w-md text-center">
        <h2 class="text-2xl font-bold mb-4">Choose a game mode</h2>
        <div class="flex justify-center gap-4">
          <button class="btn btn-primary" @click="selectMode('classic')">Classic</button>
          <button class="btn btn-secondary" @click="selectMode('power-up')">Power-up</button>
        </div>
      </div>
    </div>
  </div>
</template>
