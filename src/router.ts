import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { Home, Login } from './views';
import { store } from './store/store'

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: Login },
  { path: '/home', name: 'home', component: Home },
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
