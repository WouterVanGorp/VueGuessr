import Peer from 'peerjs';

export interface ConnectionInfo {
  peerId: string;
  username: string;
  connection: Peer.DataConnection;
}

export interface PeerState {
  isHost: boolean;
  peerId: string;
  hostId: string;
  connectionsInfo: ConnectionInfo[];
}
