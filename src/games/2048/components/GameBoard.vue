<script setup lang="ts">
import type { Tile } from '@/games/2048/state/Tile.ts';
import GameTile from './GameTile.vue';
import { TILE_COUNT } from '@/games/2048/constants';

defineProps<{ tiles: Tile[] }>();

const emit = defineEmits<{ (e: 'move', dir: 'up' | 'down' | 'left' | 'right'): void }>();

let startX = 0,
  startY = 0,
  moved = false;

function onTouchStart(e: TouchEvent) {
  const t = e.touches[0];
  startX = t.clientX;
  startY = t.clientY;
  moved = false;
}

function onTouchMove() {
  moved = true;
}

function onTouchEnd(e: TouchEvent) {
  if (!moved) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;
  const absX = Math.abs(dx),
    absY = Math.abs(dy);
  if (Math.max(absX, absY) < 30) return;

  if (absX > absY) {
    emit('move', dx > 0 ? 'right' : 'left');
  } else {
    emit('move', dy > 0 ? 'down' : 'up');
  }
}
</script>

<template>
  <div
    class="game-board"
    @touchstart.prevent="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend.prevent="onTouchEnd"
  >
    <div v-for="i in TILE_COUNT" :key="i" class="grid-cell"></div>
    <GameTile v-for="tile in tiles" :key="tile.id" :tile="tile" />
  </div>
</template>
