import Peer from 'peerjs';
import { Module } from 'vuex';
import { DATA_TYPE, GlobalState, PeerState, ConnectionInfo } from '../models';
import { DataMessage } from '../models/DataMessage';

let peer: Peer;

export const peerStore: Module<PeerState, GlobalState> = {
  namespaced: true,
  state: (): PeerState => ({
    isHost: false,
    peerId: '',
    hostId: '',
    connectionsInfo: [],
  }),

  getters: {
    peerId: (state) => state.peerId,
    hostId: (state) => state.hostId,
    isHost: (state) => state.isHost,
    getUsernames: (state) => state.connectionsInfo.map((c) => c.username),
  },

  mutations: {
    setHost: (state) => (state.isHost = true),
    setPeerId: (state, peerId: string) => (state.peerId = peerId),
    setHostId: (state, hostId: string) => (state.hostId = hostId),

    addConnection: (state, conInfo: ConnectionInfo) =>
      state.connectionsInfo.push(conInfo),
    removeConnection: (state, peerId: string) =>
      (state.connectionsInfo = state.connectionsInfo.filter(
        (c) => c.peerId !== peerId
      )),
    setPeerUsername: (state, { peerId, username }: ConnectionInfo) => {
      const connection = state.connectionsInfo.find((c) => c.peerId === peerId);
      if (!connection) return;
      connection.username = username;
    },
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

      peer.on('close', () => {
        debugger;
      });
      peer.on('disconnected', () => {
        debugger;
      });
      peer.on('error', (data) => {
        debugger;
      });
    },

    listenForPeers({ dispatch, commit, rootGetters }) {
      peer.on('connection', (connection) => {
        if (rootGetters['game/isGameActive']) return;
        commit('addConnection', {
          peerId: connection.peer,
          connection
        });
        dispatch('listenToConnection', connection.peer);
      });
    },

    connectToPeer({ dispatch, commit }, peerId: string) {
      const connection = peer.connect(peerId);
      commit('addConnection', { peerId: connection.peer, connection });
      dispatch('listenToConnection', peerId);
    },

    listenToConnection({ dispatch, commit, state, rootState }, peerId: string) {
      const connection = state.connectionsInfo.find(
        (c) => c.peerId === peerId
      )?.connection;
      if (!connection) return;

      connection.on('open', () => {
        if (state.isHost) dispatch('sendPeersToClient', connection.peer);
        connection.send({
          type: DATA_TYPE.USERNAME,
          username: rootState.username,
          peerId: state.peerId,
        });
      });

      connection.on('data', (data) => {
        dispatch('processData', data);
      });

      connection.on('close', () => {
        commit('removeConnection', connection.peer);
      });

      connection.on('error', (data) => {
        debugger;
      });
    },

    sendPeersToClient({ state }, peerId) {
      const connection = state.connectionsInfo.find(
        (c) => c.peerId === peerId
      )?.connection;
      if (!connection) return;

      const peers = state.connectionsInfo
        .map((c) => c.peerId)
        .filter((c) => c !== state.peerId && c !== connection.peer);

      connection.send({
        type: DATA_TYPE.PEERS,
        peers,
      });
    },

    sendMessage({ rootState, commit, dispatch }, content: string) {
      commit(
        'addMessage',
        { content, sender: rootState.username },
        { root: true }
      );

      dispatch('sendData', {
        type: DATA_TYPE.CHAT,
        content,
        sender: rootState.username,
      });
    },

    sendData({ state }, data: DataMessage) {
      const connections = state.connectionsInfo;
      connections.map((c) => c.connection).forEach((c) => c.send(data));
    },

    processData({ dispatch, commit }, data: DataMessage) {
      if (data.type === DATA_TYPE.CHAT)
        commit('addMessage', data, { root: true });
      else if (data.type === DATA_TYPE.PEERS)
        data.peers.forEach((p: string) => dispatch('connectToPeer', p));
      else if (data.type === DATA_TYPE.USERNAME)
        commit('setPeerUsername', {
          username: data.username,
          peerId: data.peerId,
        });
      else if (data.type === DATA_TYPE.GAME)
        dispatch('game/processData', data, { root: true });
    },
  },
};
