// src/game/composables/useGame.ts
import { ref, readonly, computed, watch } from 'vue';
import type { Direction } from '@/games/2048/types';
import { useInputHandler } from './useInputHandler.ts';
import { ANIMATION_DURATION } from '@/games/2048/constants';
import { saveGameState, loadGameState, clearGameState, saveBestScore, loadBestScore } from './usePersistence.ts';
import { Grid } from '@/games/2048/state/Grid.ts'

const grid = new Grid();
const score = ref(0);
const bestScore = ref(loadBestScore());
const animating = ref(false);
const isGameOver = computed(() => grid.availableCells().length === 0);

// Load game on startup
const savedState = loadGameState();
if (savedState) {
  grid.loadState(savedState.tiles);
  score.value = savedState.score;
} else {
  grid.setup();
}

// Watch for changes to save the game
watch(
  () => grid.tiles,
  (tiles) => {
    if (!animating.value) { // Only save when not animating
      saveGameState({ tiles, score: score.value });
    }
  },
  { deep: true }
);

// Watch for best score
watch(score, (newScore) => {
  if (newScore > bestScore.value) {
    bestScore.value = newScore;
    saveBestScore(newScore);
  }
});

function move(dir: Direction) {
  if (animating.value) return;

  const result = grid.move(dir);
  if (result.moved) {
    score.value += result.score;
    animating.value = true;
    setTimeout(() => {
      grid.applyMerges();
      grid.spawnRandomTile();
      grid.finalizeMove();
      saveGameState({ tiles: grid.tiles, score: score.value });
      animating.value = false;
    }, ANIMATION_DURATION);
  }
}

function restart() {
  clearGameState();
  score.value = 0;
  grid.setup();
}

export function useGame() {
  useInputHandler({ onMove: move });

  return {
    tiles: grid.tiles,
    score: readonly(score),
    bestScore: readonly(bestScore),
    animating: readonly(animating),
    isGameOver: readonly(isGameOver),
    move,
    restart,
  };
}
