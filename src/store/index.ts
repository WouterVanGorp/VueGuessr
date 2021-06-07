import { createLogger, createStore } from 'vuex';

export interface GlobalState {
  username: string;
}

export const store = createStore({
  state: (): GlobalState => ({
    username: '',
  }),
  getters: {
    username: (state) => state.username,
  },
  mutations: {
    setUsername: (state, { username }) => (state.username = username),
  },
  actions: {},
  modules: {},
  plugins: import.meta.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});
