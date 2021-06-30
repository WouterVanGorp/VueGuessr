import { Module } from 'vuex';

import { router } from './../router';
import {
  DATA_TYPE,
  GameMessage,
  GameState,
  GAME_TYPE,
  GlobalState,
} from './../models';

export const gameStore: Module<GameState, GlobalState> = {
  namespaced: true,
  state: (): GameState => ({
    isActive: false,
    players: [],
    isChallenger: false,
    challenge: '',
  }),

  getters: {
    isGameActive: (state) => state.isActive,
    isChallenger: (state) => state.isChallenger,
    challenge: (state) => state.challenge,
  },

  mutations: {
    setActive: (state) => (state.isActive = true),
    setChallenger: (state, isChallenger: boolean) =>
      (state.isChallenger = isChallenger),
    setChallenge: (state, challenge: string) => (state.challenge = challenge),
  },

  actions: {
    startGame({ commit, rootGetters }) {
      router.push({ name: 'game' });
      commit('setActive');
      if (rootGetters['peer/isHost']) commit('setChallenger', true);
    },

    newRound({ commit }) {
      commit('setChallenge', '');
    },

    setChallenge({ dispatch, commit }, challenge: string) {
      commit('setChallenge', challenge);
      dispatch(
        'peer/sendData',
        {
          type: DATA_TYPE.GAME,
          gameType: GAME_TYPE.CHALLENGE,
          challenge,
        },
        { root: true }
      );
    },

    processData({ dispatch, commit }, data: GameMessage) {
      if (data.gameType === GAME_TYPE.START) dispatch('startGame');
      else if (data.gameType === GAME_TYPE.NEW_ROUND) dispatch('newRound');
      else if (data.gameType === GAME_TYPE.CHALLENGE) commit('setChallenge', data.challenge);
    },
  },
};
