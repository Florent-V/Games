import { ref, readonly } from 'vue';
import { GameEngine } from '../state/GameEngine';
import { useInputHandler } from './useInputHandler';
import { INITIAL_SPEED_MS } from '../constants';
import type { Coordinates } from '../types';

export function useSnakeGame() {
  let gameEngine = new GameEngine();

  // Reactive state for the UI
  const snakeBody = ref<Coordinates[]>([]);
  const food = ref<Coordinates | null>(null);
  const score = ref(0);
  const isGameOver = ref(false);

  let gameInterval: number | undefined;

  // Function to sync the reactive state with the engine state
  const syncState = () => {
    snakeBody.value = [...gameEngine.snake.body.map((segment) => ({ ...segment }))];
    food.value = { ...gameEngine.food };
    score.value = gameEngine.score;
    isGameOver.value = gameEngine.isGameOver;
  };

  const stopGame = () => {
    if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = undefined;
    }
  };

  const update = () => {
    gameEngine.update();
    syncState();

    if (gameEngine.isGameOver) {
      stopGame();
    }
  };

  const startGame = () => {
    stopGame();
    gameEngine = new GameEngine(); // Create a new game instance
    syncState(); // Initial sync
    gameInterval = window.setInterval(update, INITIAL_SPEED_MS);
  };

  useInputHandler((direction) => {
    gameEngine.snake.changeDirection(direction);
  });

  // Initial state sync before game starts
  syncState();

  return {
    snakeBody: readonly(snakeBody),
    food: readonly(food),
    score: readonly(score),
    isGameOver: readonly(isGameOver),
    startGame,
  };
}
