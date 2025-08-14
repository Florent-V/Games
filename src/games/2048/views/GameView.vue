<script setup lang="ts">
import GameBoard from '@/games/2048/components/GameBoard.vue';
import { useGame } from '@/games/2048/composables/useGame';
import { ref, computed } from 'vue';
import { getPowerUpConfig } from '@/games/2048/power-ups/config';

const { tiles, score, isGameOver, restart, move, bestScore, gameMode, getPowerUp } = useGame();
const showRules = ref(false);
const showModeSelection = ref(false);

const undoPowerUp = computed(() => getPowerUp('undo'));

const powerUpDescriptions: Record<string, string> = {
  undo: 'Cancels the last move.',
  move: 'Move a tile to an adjacent empty cell.',
  switch: 'Switch two tiles.',
  rotate: 'Rotate the board 90 degrees.',
  erase: 'Remove a tile from the board.',
  bomb: 'Destroy a tile and its neighbors.',
};

function getTooltipText(id: string): string {
  const config = getPowerUpConfig(id);
  const description = powerUpDescriptions[id] || 'Power-up not implemented yet.';
  const triggerValue = config?.triggerValue || 'N/A';
  return `${description} (Threshold: ${triggerValue})`;
}

function isPowerUpEnabled(id: string): boolean {
  return id === 'undo';
}

function selectMode(mode: 'classic' | 'power-up') {
  restart(mode);
  showModeSelection.value = false;
}
</script>

<template>
  <div class="game-2048-container flex flex-col items-center justify-start w-full py-10 gap-10">

    <h1 class="text-6xl font-extrabold mb-4">2048</h1>

    <div class="w-full max-w-md px-4 text-center">
      <div class="flex items-center justify-between">
        <button class="btn btn-secondary" @click="showModeSelection = true">New Game</button>
        <div class="flex gap-3 items-center">
          <div class="bg-primary text-primary-content p-3 rounded-md text-center flex flex-col w-24">
            <span class="text-sm">BEST</span>
            <span class="text-2xl font-bold">{{ bestScore }}</span>
          </div>
          <div class="bg-primary text-primary-content p-3 rounded-md text-center flex flex-col w-24">
            <span class="text-sm">SCORE</span>
            <span class="text-2xl font-bold">{{ score }}</span>
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



    <div v-if="gameMode === 'power-up'" class="bg-base-300 rounded-lg p-6 shadow-lg">
      <!-- Barre de boutons d'icônes -->
      <div class="flex flex-wrap gap-8 justify-center">

        <!-- Bouton Messages -->
        <div class="relative tooltip tooltip-primary" :data-tip="getTooltipText('undo')">
          <button id="undo" class="btn btn-accent btn-lg brightness-120 w-12 h-12 p-0 flex items-center justify-center"  @click="undoPowerUp.action" :disabled="undoPowerUp.count.value === 0">
            <v-icon name="fa-undo" class="h-5 w-5" />
          </button>
          <div class="notification-badge bg-error text-error-content">{{ undoPowerUp.count }}</div>
        </div>

        <div class="relative tooltip tooltip-primary" :data-tip="getTooltipText('move')">
          <button id="move" class="btn btn-accent btn-lg brightness-120 w-12 h-12 p-0 flex items-center justify-center" :disabled="!isPowerUpEnabled('move')">
            <v-icon name="md-moveup-round" class="h-5 w-5" />
          </button>
          <div class="notification-badge bg-error text-error-content">0</div>
        </div>

        <div class="relative tooltip tooltip-primary" :data-tip="getTooltipText('switch')">
          <button id="switch" class="btn btn-accent btn-lg brightness-120 w-12 h-12 p-0 flex items-center justify-center" :disabled="!isPowerUpEnabled('switch')">
            <v-icon name="hi-switch-horizontal" class="h-5 w-5" />
          </button>
          <div class="notification-badge bg-error text-error-content">0</div>
        </div>

        <div class="relative tooltip tooltip-primary" :data-tip="getTooltipText('rotate')">
          <button id="rotate" class="btn btn-accent btn-lg brightness-120 w-12 h-12 p-0 flex items-center justify-center" :disabled="!isPowerUpEnabled('rotate')">
            <v-icon name="md-rotate90degreesccw-round" class="h-5 w-5" />
          </button>
          <div class="notification-badge bg-error text-error-content">0</div>
        </div>

        <div class="relative tooltip tooltip-primary" :data-tip="getTooltipText('erase')">
          <button id="erase" class="btn btn-accent btn-lg brightness-120 w-12 h-12 p-0 flex items-center justify-center" :disabled="!isPowerUpEnabled('erase')">
            <v-icon name="bi-eraser" class="h-5 w-5" />
          </button>
          <div class="notification-badge bg-error text-error-content">0</div>
        </div>

        <div class="relative tooltip tooltip-primary" :data-tip="getTooltipText('bomb')">
          <button id="bomb" class="btn btn-accent btn-lg brightness-120 w-12 h-12 p-0 flex items-center justify-center" :disabled="!isPowerUpEnabled('bomb')">
            <v-icon name="fa-bomb" class="h-5 w-5" />
          </button>
          <div class="notification-badge bg-error text-error-content">0</div>
        </div>

      </div>
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

<style scoped>
/* Styles personnalisés pour les badges */
.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  z-index: 10;
}

.tooltip:before {
  max-width: 250px;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 1rem;
  transition: all 0.2s ease-in-out;
}
</style>
