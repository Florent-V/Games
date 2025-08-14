// src/game/composables/useGame.ts
import { ref, readonly, computed, watch } from 'vue';
import type { Direction } from '@/games/2048/types';
import { useInputHandler } from './useInputHandler.ts';
import { ANIMATION_DURATION } from '@/games/2048/constants';
import {
  saveGameState,
  loadGameState,
  clearGameState,
  saveBestScore,
  loadBestScore,
} from './usePersistence.ts';
import { Grid } from '@/games/2048/state/Grid.ts';
import type { Tile } from '@/games/2048/state/Tile.ts';
import { usePowerUps } from '@/games/2048/power-ups';

type GameState = {
  tiles: Tile[];
  score: number;
  gameMode: 'classic' | 'power-up';
  history: { tiles: Tile[]; score: number }[];
};

const grid = new Grid();
const score = ref(0);
const bestScore = ref(loadBestScore());
const animating = ref(false);
const isGameOver = computed(() => grid.availableCells().length === 0);
const gameMode = ref<'classic' | 'power-up'>('classic');
const history = ref<{ tiles: Tile[]; score: number }[]>([]);

const { initializePowerUps, checkAll, getPowerUp } = usePowerUps(
  grid,
  score,
  history
);

// Load game on startup
const savedState = loadGameState();
if (savedState) {
  grid.loadState(savedState.tiles);
  score.value = savedState.score;
  gameMode.value = savedState.gameMode || 'classic';
  history.value = savedState.history || [];
} else {
  grid.setup();
}

initializePowerUps();

// Watch for changes to save the game
watch(
  () => [grid.tiles, score.value, gameMode.value, history.value],
  () => {
    if (!animating.value) {
      saveGameState({
        tiles: grid.tiles,
        score: score.value,
        gameMode: gameMode.value,
        history: history.value,
      });
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

  const currentTiles = JSON.parse(JSON.stringify(grid.tiles));
  const currentScore = score.value;

  const result = grid.move(dir);
  if (result.moved) {
    history.value.push({
      tiles: currentTiles,
      score: currentScore,
    });

    score.value += result.score;

    animating.value = true;
    setTimeout(() => {
      grid.applyMerges();

      if (gameMode.value === 'power-up') {
        checkAll();
      }

      const undoPowerUp = getPowerUp('undo');
      if (undoPowerUp) {
        while (history.value.length > undoPowerUp.count.value) {
          history.value.shift();
        }
      } else {
        history.value = [];
      }

      grid.spawnRandomTile();
      grid.finalizeMove();
      animating.value = false;
    }, ANIMATION_DURATION);
  }
}

function restart(mode: 'classic' | 'power-up' = 'classic') {
  clearGameState();
  score.value = 0;
  gameMode.value = mode;
  history.value = [];
  initializePowerUps();
  grid.setup();
}

export function useGame() {
  useInputHandler({ onMove: move });

  return {
    tiles: readonly(grid.tiles),
    score: readonly(score),
    bestScore: readonly(bestScore),
    animating: readonly(animating),
    isGameOver: readonly(isGameOver),
    gameMode: readonly(gameMode),
    getPowerUp,
    move,
    restart,
  };
}
