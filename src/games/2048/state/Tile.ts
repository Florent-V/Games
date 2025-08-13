// src/game/state/tile.ts

export class Tile {
  static nextId = 1;

  id: number;
  value: number;
  row: number;
  col: number;
  merged: boolean;
  mergedFrom?: Tile[];
  prevRow?: number;
  prevCol?: number;

  constructor(row: number, col: number, value?: number) {
    this.id = Tile.nextId++;
    this.row = row;
    this.col = col;
    this.value = value || (Math.random() < 0.9 ? 2 : 4);
    this.merged = false;
  }
}
