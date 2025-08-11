// src/game/composables/usePersistence.ts
import type { Tile } from '@/game/state/Tile.ts';

const GAME_STATE_KEY = '2048-game-state';
const BEST_SCORE_KEY = '2048-best-score';

export interface GameState {
  tiles: Tile[];
  score: number;
}

export function saveGameState(state: GameState): void {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

export function loadGameState(): GameState | null {
  const savedState = localStorage.getItem(GAME_STATE_KEY);
  if (!savedState) return null;
  try {
    return JSON.parse(savedState) as GameState;
  } catch (e) {
    console.error("Failed to parse saved game state.", e);
    return null;
  }
}

export function clearGameState(): void {
  localStorage.removeItem(GAME_STATE_KEY);
}

export function loadBestScore(): number {
  return parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);
}

export function saveBestScore(score: number): void {
  localStorage.setItem(BEST_SCORE_KEY, String(score));
}
