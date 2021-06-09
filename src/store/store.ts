import { createLogger, createStore } from 'vuex';
import { GlobalState, Message } from '../models';

export const store = createStore({
  state: (): GlobalState => ({
    username: 'test',
    messages: [],
  }),
  getters: {
    username: (state) => state.username,
    messages: (state) => state.messages,
  },
  mutations: {
    setUsername: (state, { username }) => (state.username = username),
    addMessage: (state, message: Message) => state.messages.push(message),
  },
  actions: {
    sendMessage({ commit, state }, content: string) {
      const message = { content, sender: state.username };
      commit('addMessage', message);
    },
  },
  modules: {},
  plugins: import.meta.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});
