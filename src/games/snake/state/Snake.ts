import type { Coordinates, Direction } from '../types';
import { BOARD_SIZE } from '../constants';

export class Snake {
  body: Coordinates[];
  direction: Direction;
  private directionQueue: Direction[] = [];
  private growthPending: number = 0;

  constructor(startPosition: Coordinates) {
    this.direction = 'Right';
    // Initialize a 3-segment body starting from the head
    this.body = [
      { ...startPosition },
      { x: startPosition.x - 1, y: startPosition.y },
      { x: startPosition.x - 2, y: startPosition.y },
    ];
  }

  get head(): Coordinates {
    return this.body[0];
  }

  // Called when food is eaten
  grow() {
    this.growthPending += 1; // Increase the number of segments to add
  }

  changeDirection(newDirection: Direction) {
    // The next direction is the last one in the queue, or the current one if queue is empty
    const nextDirection =
      this.directionQueue.length > 0
        ? this.directionQueue[this.directionQueue.length - 1]
        : this.direction;

    // Prevent adding an immediate 180-degree turn to the queue
    if (
      (newDirection === 'Up' && nextDirection === 'Down') ||
      (newDirection === 'Down' && nextDirection === 'Up') ||
      (newDirection === 'Left' && nextDirection === 'Right') ||
      (newDirection === 'Right' && nextDirection === 'Left')
    ) {
      return;
    }

    // Limit queue size to 2 to prevent too many buffered moves and erratic behavior
    if (this.directionQueue.length < 2) {
      this.directionQueue.push(newDirection);
    }
  }

  move() {
    if (this.directionQueue.length > 0) {
      this.direction = this.directionQueue.shift()!;
    }

    const newHead = { ...this.head };
    switch (this.direction) {
      case 'Up':
        newHead.y--;
        break;
      case 'Down':
        newHead.y++;
        break;
      case 'Left':
        newHead.x--;
        break;
      case 'Right':
        newHead.x++;
        break;
    }

    this.body.unshift(newHead); // Add new head

    // If the snake is not pending growth, remove the tail. Otherwise, let it grow.
    if (this.growthPending > 0) {
      this.growthPending--;
    } else {
      this.body.pop(); // Remove tail
    }
  }

  checkSelfCollision(): boolean {
    const [head, ...body] = this.body;
    return body.some((segment) => segment.x === head.x && segment.y === head.y);
  }

  checkWallCollision(): boolean {
    const { x, y } = this.head;
    return x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE;
  }
}
