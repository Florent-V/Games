<script setup lang="ts">
import { useSnakeGame } from '../composables/useSnakeGame';
import GameBoard from '../components/GameBoard.vue';

const { snakeBody, food, score, isGameOver, startGame } = useSnakeGame();
</script>

<template>
  <div class="w-full max-w-lg mx-auto flex flex-col items-center gap-4 p-4">
    <!-- Header -->
    <div class="flex justify-between items-center w-full">
      <h1 class="text-4xl font-bold">Snake</h1>
      <div class="card bg-base-200 p-2">
        <div class="text-center">
          <div class="text-xs text-base-content/70">SCORE</div>
          <div class="text-2xl font-bold">{{ score }}</div>
        </div>
      </div>
    </div>

    <!-- Game Area -->
    <div class="card bg-base-100 shadow-xl w-full aspect-square">
      <div class="card-body relative p-2 sm:p-4">
        <GameBoard :snake-body="snakeBody" :food="food" />
        <!-- Overlay -->
        <div
          v-if="isGameOver"
          class="absolute inset-2 sm:inset-4 rounded-lg bg-black/50 flex flex-col items-center justify-center text-white gap-4"
        >
          <h2 class="text-5xl font-extrabold">Game Over</h2>
          <button @click="startGame" class="btn btn-primary">Play Again</button>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="text-center">
      <button v-if="!isGameOver" @click="startGame" class="btn btn-secondary mb-2">
        Start Game
      </button>
      <p class="text-sm text-base-content/60">Use Arrow Keys or WASD to move.</p>
    </div>
  </div>
</template>
