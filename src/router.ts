import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { Lobby, Login, Game } from './views';
import { store } from './store/app.store';

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: Login },
  { path: '/lobby', name: 'lobby', component: Lobby },
  { path: '/game', name: 'game', component: Game },
  { path: '/', redirect: '/home' },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const username = store.getters.username;
  if (to.name !== 'login' && !username) next({ name: 'login' });
  else next();
});
