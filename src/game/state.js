import p1Ships from "../data/player1Ships.js";
import p2Ships from "../data/player2Ships.js";

export const state = {
  currentPlayer: 0, 
  lastText: "",
  winner: null,
  players: [
    { ships: structuredClone(p1Ships), attacksReceived: new Map() },
    { ships: structuredClone(p2Ships), attacksReceived: new Map() },
  ],
};