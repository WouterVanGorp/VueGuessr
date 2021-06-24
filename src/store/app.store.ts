import { createLogger, createStore } from 'vuex';

import { GlobalState } from '../models';
import { peerStore } from './peer/peer.store';


export const store = createStore({
  state: (): GlobalState => ({
    username: '',
    messages: []
  }),

  getters: {
    username: (state) => state.username,
    messages: (state) => state.messages,
  },

  mutations: {
    setUsername: (state, username: string) => (state.username = username),
    addMessage: (state, message) => state.messages.push(message),
  },

  actions: {
    hostGame({ commit, dispatch }, username: string) {
      commit('setUsername', username);
      dispatch('peer/hostGame');
    },

    joinGame(
      { commit, dispatch },
      { username, connectionId }: { username: string; connectionId: string }
    ) {
      commit('setUsername', username);
      dispatch('peer/joinGame', connectionId);
    },
  },
  modules: {
    peer: peerStore
  },
  plugins: import.meta.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});
