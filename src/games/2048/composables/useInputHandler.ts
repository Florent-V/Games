// src/game/composables/useInputHandler.ts
import { onMounted, onBeforeUnmount } from 'vue';
import type { Direction } from '@/games/2048/types';

export function useInputHandler(options: {
  onMove: (dir: Direction) => void;
}) {
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, Direction | undefined> = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right',
      W: 'up', S: 'down', A: 'left', D: 'right'
    };
    const dir = map[e.key];
    if (dir) {
      e.preventDefault();
      options.onMove(dir);
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', onKey);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey);
  });
}
