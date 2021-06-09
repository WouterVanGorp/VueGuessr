import { Message } from "./Message";

export interface GlobalState {
  username: string;
  messages: Message[];
}
