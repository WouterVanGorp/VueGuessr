import { DATA_TYPE } from "./DataTypes";
import { GAME_TYPE } from "./GameTypes";

export type DataMessage = { type: DATA_TYPE, [key: string]: any };
export type GameMessage = { gameType: GAME_TYPE, [key: string]: any };
