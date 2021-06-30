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

    setHostName: (state, hostName: string) => {
      const hostConn = state.connectionsInfo.find(
        (c) => c.peerId === state.hostId
      );
      if (!hostConn) return;
      hostConn.username = hostName;
    },

    addConnection: (state, conInfo: ConnectionInfo) =>
      state.connectionsInfo.push(conInfo),
    removeConnection: (state, peerId: string) =>
      (state.connectionsInfo = state.connectionsInfo.filter(
        (c) => c.peerId !== peerId
      )),
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
          connection,
          username: connection.metadata.username,
        });
        dispatch('listenToConnection', connection.peer);
      });
    },

    connectToPeer({ dispatch, commit, rootState }, peerId: string) {
      const connection = peer.connect(peerId, {
        metadata: { username: rootState.username },
      });
      commit('addConnection', { peerId: connection.peer, connection });
      dispatch('listenToConnection', peerId);
    },

    listenToConnection({ dispatch, commit, state }, peerId: string) {
      const connection = state.connectionsInfo.find(
        (c) => c.peerId === peerId
      )?.connection;
      if (!connection) return;

      if (state.isHost)
        connection.on('open', () => {
          dispatch('sendPeersToClient', connection.peer);
        });

      connection.on('data', (data) => {
        dispatch('processData', data);
      });

      connection.on('close', () => {
        commit('RemoveConnection', connection.peer);
      });

      connection.on('error', (data) => {
        debugger;
      });
    },

    sendPeersToClient({ state, rootState }, peerId) {
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
        hostName: rootState.username, // ALleen maar de host triggert deze functie
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
      else if (data.type === DATA_TYPE.PEERS) {
        data.peers.forEach((p: string) => dispatch('connectToPeer', p));
        commit('setHostName', data.hostName);
      } else if (data.type === DATA_TYPE.GAME)
        dispatch('game/processData', data, { root: true });
    },
  },
};
