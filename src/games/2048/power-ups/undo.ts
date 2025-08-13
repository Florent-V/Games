import { ref } from 'vue';
import type { PowerUp } from './types';
import { getPowerUpConfig } from './config';
import type { Grid } from '@/games/2048/state/Grid';

const config = getPowerUpConfig('undo');

const undoCount = ref(0);

function check(grid: Grid) {
  if (!config || !config.enabled || !config.triggerValue) return;

  const newTiles = grid.tiles.filter((t) => t.merged && t.value === config.triggerValue);
  console.log('New tiles with trigger value:', newTiles);
  if (newTiles.length > 0) {
    undoCount.value += newTiles.length;
    console.log('Undo count incremented to:', undoCount.value);
  }
}

export function createUndoPowerUp(history: Ref<{ tiles: any[]; score: number }[]>, grid: Grid, score: Ref<number>): PowerUp {
  const undoCount = ref(0);
  function action() {
    if (undoCount.value > 0 && history.value.length > 0) {
      const lastState = history.value.pop();
      if (lastState) {
        grid.loadState(lastState.tiles);
        score.value = lastState.score;
        undoCount.value--;
      }
    }
  }

  return {
    id: 'undo',
    name: 'Undo',
    description: 'Cancels the last move.',
    count: undoCount,
    check,
    action,
  };
}
