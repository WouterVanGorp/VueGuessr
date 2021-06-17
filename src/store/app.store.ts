import Peer from 'peerjs';
import { createLogger, createStore } from 'vuex';

import { GlobalState } from '../models';

let peer: Peer;
let connection: Peer.DataConnection;

export const store = createStore({
  state: (): GlobalState => ({
    username: '',
    peerId: '',
    messages: [],
    peerIds: []
  }),

  getters: {
    username: (state) => state.username,
    peerId: (state) => state.peerId,
    messages: (state) => state.messages,
  },

  mutations: {
    setUsername: (state, username: string) => (state.username = username),
    setPeerId: (state, peerId: string) => (state.peerId = peerId),
    addMessage: (state, message) => state.messages.push(message),
  },

  actions: {
    hostGame({ commit, dispatch }, username: { username: string }) {
      commit('setUsername', username);
      dispatch('setupPeer', { isHost: true });
    },

    joinGame(
      { commit, dispatch },
      { username, connectionId }: { username: string; connectionId: string }
    ) {
      commit('setUsername', username);
      dispatch('setupPeer', { isHost: false, connectionId });
    },

    setupPeer({ commit, dispatch, state }, { isHost, connectionId }) {
      peer = new Peer(state.username + '-' + new Date().getTime());

      peer.on('open', (peerId) => {
        commit('setPeerId', peerId);
        if (isHost) dispatch('listenForPeers');
        else dispatch('connectToPeer', connectionId);
      });

      peer.on('close', (data) => {
        debugger;
      });
      peer.on('disconnected', (data) => {
        debugger;
      });
      peer.on('error', (data) => {
        debugger;
      });
    },

    listenForPeers({ dispatch }) {
      peer.on('connection', (conn) => {
        connection = conn;
        dispatch('listenToConnection');
      });
    },

    connectToPeer({ dispatch }, connectionId: string) {
      connection = peer.connect(connectionId);
      dispatch('listenToConnection');
    },

    listenToConnection({ commit }) {
      connection.on('data', (data) => {
        commit('addMessage', data.message);
      });

      connection.on('close', (data) => {
        debugger;
      });

      connection.on('error', (data) => {
        debugger;
      });
    },

    sendMessage({ state, commit }, content: string) {
      commit('addMessage', { content, sender: state.username });
      connection.send({ message: { content, sender: state.username } });
    },
  },
  modules: {},
  plugins: import.meta.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});
