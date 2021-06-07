import { createApp } from 'vue';

const Vue = createApp(App);

import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
Vue.use(ElementPlus);


import { store } from './store';
Vue.use(store);


import { router } from './router';
Vue.use(router);


import App from './App.vue';
Vue.mount('#app');
