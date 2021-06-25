import { Module } from 'vuex';
import { GameMessage, GAME_TYPE, GlobalState } from '../models';
import { router } from '../router';

export interface GameState {
  isActive: boolean;
  
  players: {username: string, id: string }[],
}

export const gameStore: Module<GameState, GlobalState> = {
  namespaced: true,
  state: (): GameState => ({
    isActive: false,
    players: []
  }),

  getters: {
    isGameActive: (state) => state.isActive,
  },

  mutations: {
    setActive: (state) => (state.isActive = true),
  },

  actions: {
    startGame({ commit }) {
      router.push({ name: 'game' });
      commit('setActive');
    },

    processData({ dispatch }, data: GameMessage) {
      if (data.gameType === GAME_TYPE.START) dispatch('startGame');
    },
  },
};
