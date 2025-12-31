import { COLS } from "./constants.js";
import { drawBoard, renderLastText, updateControls } from "./engine.js";
import { state } from "./state.js";
import { parseCoord } from "./validation.js";


/* ---------- Coordinate helpers ---------- */

// Convert (colIndex,rowIndex) -> "A1"
export function coordKey(colIndex, rowIndex) {
  return `${COLS[colIndex]}${rowIndex + 1}`;
}



/* ---------- Game helpers ---------- */

export function shipCoordSet(playerIndex) {
  const set = new Set();
  for (const ship of state.players[playerIndex].ships) {
    for (const c of ship.coords) set.add(c);
  }
  return set;
}

export function resolveAttack(targetPlayerIndex, coord) {
  const target = state.players[targetPlayerIndex];

  // Repeat attacks allowed; keep consistent result
  if (target.attacksReceived.has(coord)) {
    return target.attacksReceived.get(coord);
  }

  // Step 1 rule: SINK if you hit ANY coordinate of an unsunk ship.
  let result = "MISS";

  for (const ship of target.ships) {
    if (!ship.sunk && ship.coords.includes(coord)) {
      ship.sunk = true;
      result = "SINK";
      break;
    }
  }

  target.attacksReceived.set(coord, result);
  return result;
}

export function allShipsSunk(playerIndex) {
  return state.players[playerIndex].ships.every((s) => s.sunk);
}

/* ---------- Attacks / turns ---------- */

export function onAttack(attackerIndex) {
  if (state.winner !== null) return;
  if (state.currentPlayer !== attackerIndex) return;

  const input = document.getElementById(`input-${attackerIndex}`);
  const hint = document.getElementById(`hint-${attackerIndex}`);

  const parsed = parseCoord(input.value);
  if (!parsed.ok) {
    hint.textContent = parsed.error;
    return; // invalid coord does NOT consume turn
  }

  const targetIndex = attackerIndex === 0 ? 1 : 0;
  const result = resolveAttack(targetIndex, parsed.key);

  state.lastText = `Player ${attackerIndex + 1} attacked ${parsed.key}: ${result}`;
  input.value = "";

  if (allShipsSunk(targetIndex)) {
    state.winner = attackerIndex;
  } else {
    // Turn always switches after a valid attack, even if repeated coordinate
    state.currentPlayer = attackerIndex === 0 ? 1 : 0;
  }

  drawBoard(0);
  drawBoard(1);
  updateControls();
  renderLastText();
}