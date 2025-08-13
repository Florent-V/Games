import type { Ref } from 'vue';
import type { Grid } from '@/games/2048/state/Grid.ts';

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  count: Ref<number>;
  check: (grid: Grid) => void;
  action: (...args: any[]) => void;
}
