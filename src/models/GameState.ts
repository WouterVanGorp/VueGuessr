export interface GameState {
  isActive: boolean;
  isChallenger: boolean;
  challenge: string;
  players: { username: string; id: string }[];
}
