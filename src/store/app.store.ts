import { createLogger, createStore } from 'vuex';

import { DATA_TYPE, GAME_TYPE, GlobalState } from '../models';
import { gameStore } from './game/game.store';
import { peerStore } from './peer/peer.store';

export const store = createStore({
  state: (): GlobalState => ({
    username: '',
    messages: [],
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

    startGame({ dispatch }) {
      dispatch('peer/sendData', {
        type: DATA_TYPE.GAME,
        gameType: GAME_TYPE.START,
      });
      dispatch('game/startGame');
    },
  },
  modules: {
    peer: peerStore,
    game: gameStore,
  },
  plugins: import.meta.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});
