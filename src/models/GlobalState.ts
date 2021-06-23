export interface GlobalState {
  username: string;
  messages: { sender: string; content: string }[];
  isHost: boolean;
  peerId: string;
  peerIds: string[];
}
