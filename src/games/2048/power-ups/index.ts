import { ref } from 'vue';
import type { PowerUp } from './types';
import { getEnabledPowerUps, powerUpsConfig } from './config';
import { createUndoPowerUp } from './undo';
import type { Grid } from '@/games/2048/state/Grid';

export function usePowerUps(grid: Grid, score: Ref<number>, history: Ref<{ tiles: any[]; score: number }[]>) {
  const powerUps = ref<PowerUp[]>([]);

  function initializePowerUps() {
    const enabledPowerUps = getEnabledPowerUps();
    powerUps.value = enabledPowerUps.map((config) => {
      if (config.id === 'undo') {
        return createUndoPowerUp(history, grid, score);
      }
      // Add other power-ups here
      throw new Error(`Unknown power-up: ${config.id}`);
    });

    console.table(
      powerUpsConfig.map(({ id, enabled, triggerValue }) => ({
        PowerUp: id,
        Status: enabled ? '✅ Enabled' : '❌ Disabled',
        'Trigger Value': triggerValue || 'N/A',
      }))
    );
  }

  function checkAll() {
    powerUps.value.forEach((p) => p.check(grid));
  }

  function getPowerUp(id: string): PowerUp | undefined {
    return powerUps.value.find((p) => p.id === id);
  }

  return {
    initializePowerUps,
    checkAll,
    getPowerUp,
  };
}
