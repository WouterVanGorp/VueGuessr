export interface GlobalState {
  username: string;
  peerId: string;
  messages: { sender: string; content: string }[];
  peerIds: string[];
}
