<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Coordinates } from '../types';
import { BOARD_SIZE } from '../constants';

const props = defineProps<{
  snakeBody: Coordinates[];
  food: Coordinates | null;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

// Refs to store the resolved colors from CSS variables
const colors = ref({
  primary: '#000',
  primaryFocus: '#000',
  accentFocus: '#000',
  base300: '#000',
});

const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scale = canvas.width / BOARD_SIZE;

  // Clear canvas
  ctx.fillStyle = colors.value.base300;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  if (props.food) {
    ctx.fillStyle = colors.value.accentFocus;
    ctx.fillRect(props.food.x * scale, props.food.y * scale, scale, scale);
  }

  // Draw snake
  props.snakeBody.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? colors.value.primaryFocus : colors.value.primary;
    ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
  });
};

onMounted(() => {
  const canvas = canvasRef.value!;

  // Helper function to reliably get computed background colors
  const getColor = (className: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.className = className; // e.g., 'bg-primary'
    tempDiv.style.display = 'none'; // Hide it
    document.body.appendChild(tempDiv);
    const color = getComputedStyle(tempDiv).backgroundColor;
    document.body.removeChild(tempDiv);
    return color;
  };

  // Resolve DaisyUI theme colors to actual RGB/HEX values
  colors.value = {
    primary: getColor('bg-primary'),
    primaryFocus: getColor('bg-primary-focus'),
    accentFocus: getColor('bg-error'),
    base300: getColor('bg-base-300'),
  };

  // Set canvas size for sharp rendering
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);

  // Initial draw
  draw();
});

// Re-draw whenever the game state changes
watch([() => props.snakeBody, () => props.food], draw, { deep: true });
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full"></canvas>
</template>
