export interface Player {
  id: number;
  name: string;
  score: number;
  color: string;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentScore: number;
  diceValue: number;
  isRolling: boolean;
  gameWinner: Player | null;
  turnTimeLeft?: number;
  timerEnabled: boolean;
  turnDuration: number;
}

export interface GameSettings {
  numberOfPlayers: number;
  playerNames: string[];
  timerEnabled: boolean;
  turnDuration: number;
  targetScore: number;
}