import { SIZE, COLS } from "./constants.js";


// Parse "A3" -> {colIndex:0,rowIndex:2,key:"A3"}
export function parseCoord(input) {
  const s = (input ?? "").trim().toUpperCase();

  // Validation regex for A1 to F6
  if (!/^[A-F][1-6]$/.test(s)) {
    return { ok: false, error: "Use A1 to F6" };
  }

  const colLetter = s[0]; // COLUMN letter
  const rowNumber = Number(s.slice(1)); // ROW number

  const colIndex = COLS.indexOf(colLetter);
  const rowIndex = rowNumber - 1;

  if (colIndex < 0 || colIndex >= SIZE || rowIndex < 0 || rowIndex >= SIZE) {
    return { ok: false, error: "Out of bounds" };
  }

  return {
    ok: true,
    key: `${colLetter}${rowNumber}`,
    colLetter,
    rowNumber,
    colIndex,
    rowIndex,
  };
}