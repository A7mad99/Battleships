import { state } from "./state.js";
import { SIZE, COLS, ROWS, ICON_WATER, ICON_SHIP } from "./constants.js";
import { coordKey,onAttack , shipCoordSet} from "./helpers.js";

/* ---------- Rendering ---------- */

export function createPlayerCard(playerIndex) {
  const card = document.createElement("section");
  card.className = "player-card";

  const title = document.createElement("h2");
  title.className = "player-title";
  title.textContent = `Player ${playerIndex + 1}`;
  card.appendChild(title);

  // board wrapper (axes + grid)
  const boardWrap = document.createElement("div");
  boardWrap.className = "board-wrapper";

  // corner
  const corner = document.createElement("div");
  corner.className = "axis-corner";
  boardWrap.appendChild(corner);

  // top axis letters A-F
  const topAxis = document.createElement("div");
  topAxis.className = "top-axis";
  for (let colIndex = 0; colIndex < SIZE; colIndex++) {
    const el = document.createElement("div");
    el.textContent = COLS[colIndex];
    topAxis.appendChild(el);
  }
  boardWrap.appendChild(topAxis);

  // grid (left axis numbers + cells)
  const grid = document.createElement("div");
  grid.className = "grid";
  grid.dataset.player = String(playerIndex);
  boardWrap.appendChild(grid);

  card.appendChild(boardWrap);

  // controls
  const controls = document.createElement("div");
  controls.className = "controls";

  const input = document.createElement("input");
  input.className = "coord-input";
  input.placeholder = "e.g. A1";
  input.id = `input-${playerIndex}`;

  const btn = document.createElement("button");
  btn.className = "attack-btn";
  btn.textContent = "Attack";
  btn.id = `btn-${playerIndex}`;

  controls.appendChild(input);
  controls.appendChild(btn);
  card.appendChild(controls);

  const hint = document.createElement("div");
  hint.className = "hint";
  hint.id = `hint-${playerIndex}`;
  card.appendChild(hint);

  const last = document.createElement("div");
  last.className = "last";
  last.id = `last-${playerIndex}`;
  card.appendChild(last);

  btn.addEventListener("click", () => onAttack(playerIndex));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onAttack(playerIndex);
  });

  return card;
}

export function drawBoard(playerIndex) {
  const grid = document.querySelector(`.grid[data-player="${playerIndex}"]`);
  if (!grid) return;

  grid.innerHTML = "";

  const shipsHere = shipCoordSet(playerIndex);
  const attacks = state.players[playerIndex].attacksReceived;

  // Rows are numbers 1..6 down left
  for (let rowIndex = 0; rowIndex < SIZE; rowIndex++) {
    // Left axis label = row number
    const rowLabel = document.createElement("div");
    rowLabel.className = "axis-left";
    rowLabel.textContent = String(ROWS[rowIndex]);
    grid.appendChild(rowLabel);

    // Cells across columns A..F
    for (let colIndex = 0; colIndex < SIZE; colIndex++) {
      const key = coordKey(colIndex, rowIndex); // LETTER from col, NUMBER from row

      const cell = document.createElement("div");
      cell.className = "cell";

      const hasShip = shipsHere.has(key);
      if (hasShip) cell.classList.add("ship");

      const attack = attacks.get(key);
      if (attack === "MISS") cell.classList.add("miss");
      if (attack === "SINK") cell.classList.add("hit");

      cell.textContent = hasShip ? ICON_SHIP : ICON_WATER;

      grid.appendChild(cell);
    }
  }
}

export function updateControls() {
  for (let p = 0; p < 2; p++) {
    const input = document.getElementById(`input-${p}`);
    const btn = document.getElementById(`btn-${p}`);
    const hint = document.getElementById(`hint-${p}`);

    const disabled = state.winner !== null || state.currentPlayer !== p;
    input.disabled = disabled;
    btn.disabled = disabled;

    hint.textContent =
      state.winner !== null
        ? `Game over. Player ${state.winner + 1} wins.`
        : state.currentPlayer === p
        ? "Your turn."
        : "Waiting for opponent...";
  }
}

export function renderLastText() {
  for (let p = 0; p < 2; p++) {
    const last = document.getElementById(`last-${p}`);
    last.textContent = state.lastText;
  }
}

export function renderApp() {
  const root = document.getElementById("boards");
  root.innerHTML = "";
  root.appendChild(createPlayerCard(0));
  root.appendChild(createPlayerCard(1));

  drawBoard(0);
  drawBoard(1);
  updateControls();
  renderLastText();
}

