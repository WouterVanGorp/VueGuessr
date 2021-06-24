import Peer from 'peerjs';
import { Module } from 'vuex';
import { GlobalState, PeerState } from '../../models';

let peer: Peer;
let connections: { peerId: string; connection: Peer.DataConnection }[] = [];
let getConnection = (peerId: string) =>
  connections.find((c) => c.peerId === peerId)?.connection;

export const peerStore: Module<PeerState, GlobalState> = {
  namespaced: true,
  state: (): PeerState => ({
    isHost: false,
    peerId: '',
    hostId: '',
    peerIds: [],
  }),

  getters: {
    peerId: (state) => state.peerId,
    hostId: (state) => state.hostId,
  },

  mutations: {
    setHost: (state) => (state.isHost = true),
    setPeerId: (state, peerId: string) => (state.peerId = peerId),
    setHostId: (state, hostId: string) => (state.hostId = hostId),
  },

  actions: {
    hostGame({ commit, dispatch }) {
      commit('setHost');
      dispatch('setupPeer');
    },

    joinGame({ commit, dispatch }, connectionId: string) {
      dispatch('setupPeer', connectionId);
      commit('setHostId', connectionId);
    },

    setupPeer({ commit, dispatch, state, rootState }, connectionId: string) {
      peer = new Peer(rootState.username + '-' + new Date().getTime());

      peer.on('open', (peerId) => {
        commit('setPeerId', peerId);
        dispatch('listenForPeers');

        if (state.isHost) commit('setHostId', peerId);
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
      const connection = getConnection(peerId);
      if (!connection) return;

      if (state.isHost)
        connection.on('open', () => {
          dispatch('sendPeersToClient', connection.peer);
        });

      connection.on('data', (data) => {
        if (data.type === 'chatMessage')
          commit('addMessage', data, { root: true });
        else if (data.type === 'peers')
          data.peers.forEach((p: string) => dispatch('connectToPeer', p));
      });

      connection.on('close', () => {
        connections = connections.filter((c) => c.peerId !== connection.peer);
      });

      connection.on('error', (data) => {
        debugger;
      });
    },

    sendMessage({ rootState, commit }, content: string) {
      commit(
        'addMessage',
        { content, sender: rootState.username },
        { root: true }
      );

      connections
        .map((c) => c.connection)
        .forEach((c) =>
          c.send({ type: 'chatMessage', content, sender: rootState.username })
        );
    },
  },
};
