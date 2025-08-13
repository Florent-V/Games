// Using a simple config for now, but this could be enhanced with a validation library like Zod.

export interface PowerUpConfig {
  id: string;
  enabled: boolean;
  triggerValue?: number;
}

export const powerUpsConfig: PowerUpConfig[] = [
  {
    id: 'undo',
    enabled: import.meta.env.VITE_APP_POWERUP_UNDO_ENABLED === 'true' || true,
    triggerValue: Number(import.meta.env.VITE_APP_POWERUP_UNDO_TRIGGER_VALUE) || 128,
  },
];

export function getPowerUpConfig(id: string): PowerUpConfig | undefined {
  return powerUpsConfig.find((c) => c.id === id);
}

export function getEnabledPowerUps(): PowerUpConfig[] {
  return powerUpsConfig.filter((c) => c.enabled);
}
