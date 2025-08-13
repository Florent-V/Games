// src/game/state/grid.ts
import { reactive } from 'vue';
import { GRID_SIZE } from '@/games/2048/constants';
import type { Direction } from '@/games/2048/types';
import { Tile } from '@/games/2048/state/Tile.ts';

export class Grid {
  tiles: Tile[] = reactive([]);
  private size = GRID_SIZE;

  constructor() {
    this.setup();
  }

  setup() {
    this.tiles.length = 0;
    Tile.nextId = 1; // Reset ID counter
    this.spawnRandomTile();
    this.spawnRandomTile();
  }

  loadState(tiles: Tile[]) {
    this.tiles.length = 0;
    const newTiles = tiles.map(t => new Tile(t.row, t.col, t.value));
    this.tiles.push(...newTiles);
    // Ensure next ID is greater than any loaded ID
    Tile.nextId = Math.max(...this.tiles.map(t => t.id)) + 1;
  }

  spawnRandomTile() {
    const available = this.availableCells();
    console.log("available", available);
    if (available.length > 0) {
      const { row, col } = available[Math.floor(Math.random() * available.length)];
      this.tiles.push(new Tile(row, col));
    }
  }

  availableCells(): { row: number; col: number }[] {
    const cells: { row: number; col: number }[] = [];
    const used = new Set(this.tiles.map(t => `${t.row}:${t.col}`));
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!used.has(`${r}:${c}`)) {
          cells.push({ row: r, col: c });
        }
      }
    }
    return cells;
  }

  move(dir: Direction): { moved: boolean; score: number } {
    this.prepareForMove();

    const vector = this.getVector(dir);
    const traversals = this.buildTraversals(vector);
    let moved = false;
    let score = 0;

    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        const row = dir === 'up' || dir === 'down' ? y : x;
        const col = dir === 'left' || dir === 'right' ? y : x;
        const tile = this.getTileAt(row, col);

        if (tile) {
          const { farthest, next } = this.findFarthestPosition(tile, vector);
          const canMerge = next && next.value === tile.value && !next.merged;

          if (canMerge && next) {
            next.merged = true;
            next.mergedFrom = [tile];
            // Move tile to be merged to the same spot for animation
            this.moveTile(tile, next.row, next.col);
            score += next.value;
            moved = true;
          } else {
            // Move tile
            if (farthest.row !== tile.row || farthest.col !== tile.col) {
              this.moveTile(tile, farthest.row, farthest.col);
              moved = true;
            }
          }
        }
      });
    });

    return { moved, score };
  }

  finalizeMove() {
    this.tiles.forEach(t => {
      t.merged = false;
      t.mergedFrom = undefined;
    });
  }

  applyMerges() {
    const idsToRemove = new Set<number>();
    for (const tile of this.tiles) {
      if (tile.merged) {
        tile.value *= 2; // Update value here, at the end of the animation
        if (tile.mergedFrom) {
          tile.mergedFrom.forEach(source => idsToRemove.add(source.id));
        }
      }
    }

    for (let i = this.tiles.length - 1; i >= 0; i--) {
      if (idsToRemove.has(this.tiles[i].id)) {
        this.tiles.splice(i, 1);
      }
    }
  }

  private prepareForMove() {
    this.tiles.forEach(t => {
      t.prevRow = t.row;
      t.prevCol = t.col;
      t.merged = false;
      t.mergedFrom = undefined;
    });
  }

  private getTileAt(row: number, col: number): Tile | undefined {
    return this.tiles.find(t => t.row === row && t.col === col);
  }

  private moveTile(tile: Tile, row: number, col: number) {
    tile.row = row;
    tile.col = col;
  }

  private removeTile(tile: Tile) {
    const index = this.tiles.indexOf(tile);
    if (index > -1) {
      this.tiles.splice(index, 1);
    }
  }

  private getVector(dir: Direction): { x: number; y: number } {
    const map = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    return map[dir];
  }

  private buildTraversals(vector: { x: number; y: number }): { x: number[]; y: number[] } {
    const traversals = { x: [] as number[], y: [] as number[] };
    for (let i = 0; i < this.size; i++) {
      traversals.x.push(i);
      traversals.y.push(i);
    }
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();
    return traversals;
  }

  private findFarthestPosition(tile: Tile, vector: { x: number; y: number }): { farthest: { row: number; col: number }; next: Tile | undefined } {
    let current = { row: tile.row, col: tile.col };
    let farthest = { ...current };
    let nextPos;

    do {
      farthest = { ...current };
      current.row += vector.y;
      current.col += vector.x;
      nextPos = this.getTileAt(current.row, current.col);
    } while (this.isWithinBounds(current) && !nextPos);

    return { farthest, next: nextPos };
  }

  private isWithinBounds(pos: { row: number; col: number }): boolean {
    return pos.row >= 0 && pos.row < this.size && pos.col >= 0 && pos.col < this.size;
  }
}
