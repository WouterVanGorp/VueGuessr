import { store } from './store/index';// path to store file

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: typeof store;
  }
}