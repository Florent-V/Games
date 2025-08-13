import { onMounted, onBeforeUnmount } from 'vue';
import type { Direction } from '../types';

export function useInputHandler(onDirectionChange: (dir: Direction) => void) {
  const handleKeyDown = (e: KeyboardEvent) => {
    let direction: Direction | null = null;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        direction = 'Up';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        direction = 'Down';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        direction = 'Left';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        direction = 'Right';
        break;
    }

    if (direction) {
      e.preventDefault();
      onDirectionChange(direction);
    }
  };

  onMounted(() => window.addEventListener('keydown', handleKeyDown));
  onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyDown));
}
