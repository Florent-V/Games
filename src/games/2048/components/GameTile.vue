<script setup lang="ts">
import { computed } from 'vue';
import { Tile } from '@/games/2048/state/Tile.ts';

const props = defineProps<{ tile: Tile }>();

const positionStyle = computed(() => {
  const to = { row: props.tile.row, col: props.tile.col };
  const from = props.tile.prevRow !== undefined ? { row: props.tile.prevRow, col: props.tile.prevCol } : to;

  return {
    '--from-row': from.row,
    '--from-col': from.col,
    '--to-row': to.row,
    '--to-col': to.col,
    'zIndex': props.tile.merged ? 10 : 1,
  };
});

const tileClass = computed(() => {
  const val = props.tile.value;
  const classes: Record<string, boolean> = {
    new: props.tile.prevRow === undefined,
    merged: !!props.tile.merged,
  };
  classes[`tile-${val <= 2048 ? val : 2048}`] = true;
  return classes;
});

</script>

<template>
  <div class="tile" :class="tileClass" :style="positionStyle">
    <div class="tile-inner">{{ tile.value }}</div>
  </div>
</template>
