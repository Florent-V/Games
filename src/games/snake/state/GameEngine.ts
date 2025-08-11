import { Snake } from './Snake';
import type { Coordinates } from '../types';
import { BOARD_SIZE } from '../constants';

export class GameEngine {
  public snake: Snake;
  public food: Coordinates;
  public score: number;
  public isGameOver: boolean;

  constructor() {
    this.score = 0;
    this.isGameOver = false;
    const startPosition = { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) };
    this.snake = new Snake(startPosition);
    this.food = this.createFood();
  }

  // The main game loop logic
  public update(): void {
    if (this.isGameOver) return;

    this.snake.move();

    if (this.snake.checkWallCollision() || this.snake.checkSelfCollision()) {
      this.isGameOver = true;
      return;
    }

    // Check for food collision
    if (this.snake.head.x === this.food.x && this.snake.head.y === this.food.y) {
      this.snake.grow();
      this.score++;
      this.food = this.createFood();
    }
  }

  private createFood(): Coordinates {
    let foodPosition: Coordinates;
    do {
      foodPosition = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (this.snake.body.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y));
    return foodPosition;
  }
}
