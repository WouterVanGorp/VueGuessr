import Peer from 'peerjs';
import { createLogger, createStore } from 'vuex';

import { GlobalState } from '../models';

let peer: Peer;
let connections: { peerId: string; connection: Peer.DataConnection }[] = [];
let getConnection = (peerId: string) =>
  connections.find((c) => c.peerId === peerId)?.connection;

export const store = createStore({
  state: (): GlobalState => ({
    username: '',
    messages: [],
    isHost: false,
    peerId: '',
    peerIds: [],
  }),

  getters: {
    username: (state) => state.username,
    peerId: (state) => state.peerId,
    messages: (state) => state.messages,
  },

  mutations: {
    setUsername: (state, username: string) => (state.username = username),
    setHost: (state) => (state.isHost = true),
    setPeerId: (state, peerId: string) => (state.peerId = peerId),
    addMessage: (state, message) => state.messages.push(message),
  },

  actions: {
    hostGame({ commit, dispatch }, username: { username: string }) {
      commit('setHost');
      commit('setUsername', username);
      dispatch('setupPeer');
    },

    joinGame(
      { commit, dispatch },
      { username, connectionId }: { username: string; connectionId: string }
    ) {
      commit('setUsername', username);
      dispatch('setupPeer', connectionId);
    },

    setupPeer({ commit, dispatch, state }, connectionId: string) {
      peer = new Peer(state.username + '-' + new Date().getTime());

      peer.on('open', (peerId) => {
        commit('setPeerId', peerId);
        dispatch('listenForPeers');
        if (!state.isHost) dispatch('connectToPeer', connectionId);
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

    listenForPeers({ dispatch, state }) {
      peer.on('connection', (connection) => {
        connections.push({ peerId: connection.peer, connection });
        dispatch('listenToConnection', connection.peer);
      });
    },

    sendPeersToClient({ state }, peerId) {
      const connection = getConnection(peerId);
      if (!connection) return;

      const peers = connections
        .map((c) => c.peerId)
        .filter((c) => c !== state.peerId && c !== connection.peer);

      if (!peers.length) return;
      connection.send({
        type: 'peers',
        peers,
      });
    },

    connectToPeer({ dispatch }, peerId: string) {
      const connection = peer.connect(peerId);
      connections.push({ peerId, connection });
      dispatch('listenToConnection', peerId);
    },

    listenToConnection({ commit, dispatch, state }, peerId: string) {
      const connection = connections.find(
        (c) => c.peerId === peerId
      )?.connection;
      if (!connection) return;

      if (state.isHost)
        connection.on('open', () => {
          dispatch('sendPeersToClient', connection.peer);
        });

      connection.on('data', (data) => {
        if (data.type === 'chatMessage') commit('addMessage', data);
        else if (data.type === 'peers')
          data.peers.forEach((p: string) => dispatch('connectToPeer', p));
      });

      connection.on('close', (data) => {
        connections = connections.filter(c => c.peerId !== connection.peer);
      });

      connection.on('error', (data) => {
        debugger;
      });
    },

    sendMessage({ state, commit }, content: string) {
      commit('addMessage', { content, sender: state.username });
      connections
        .map((c) => c.connection)
        .forEach((c) =>
          c.send({ type: 'chatMessage', content, sender: state.username })
        );
    },
  },
  modules: {},
  plugins: import.meta.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});
