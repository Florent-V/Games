import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameView from '../games/2048/views/GameView.vue'
import SnakeView from '@/games/snake/views/SnakeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game/2048',
      name: 'game-2048',
      component: GameView
    },
    {
      path: '/game/snake',
      name: 'game-snake',
      component: SnakeView
    },
    {
      path: '/game/tetris',
      name: 'game-tetris',
      component: SnakeView
    }
  ]
})

export default router
