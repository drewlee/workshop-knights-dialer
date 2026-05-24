const dialPad = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, null],
];

/** @type {[number, number]} */
const moves = [
  [-2, -1],
  [-1, -2],
  [-2, 1],
  [-1, 2],
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
];

/** @type {Map<number, number[]>} */
const keysMemo = new Map();

/** @type {(startingDigit: number) => number[]} */
function reachableKeys(startingDigit) {
  if (keysMemo.has(startingDigit)) {
    return keysMemo.get(startingDigit);
  }

  const rowLen = dialPad.length;
  const colLen = dialPad[0].length;

  let row = -1;
  let col = -1;

  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      if (dialPad[i][j] === startingDigit) {
        row = i;
        col = j;
        break;
      }
    }
  }

  /** @type {number[]} */
  const moveToKeys = [];

  for (const move of moves) {
    const nRow = row + move[0];
    const nCol = col + move[1];

    if (
      nRow >= 0 &&
      nRow < rowLen &&
      nCol >= 0 &&
      nCol < colLen &&
      dialPad[nRow][nCol] !== null
    ) {
      moveToKeys.push(dialPad[nRow][nCol]);
    }
  }

  keysMemo.set(startingDigit, moveToKeys);
  return moveToKeys;
}

/** @type {(startingDigit: number, hopCount: number, memo: Map<string, number>) => number} */
function countPaths(startingDigit, hopCount, memo = new Map()) {
  // Recursive/Top-down Solution
  /*
  // Base case: exhausted hops
  if (hopCount === 0) {
    return 1;
  }

  const entry = `${startingDigit},${hopCount}`;
  if (memo.has(entry)) {
    return memo.get(entry);
  }

  const keys = reachableKeys(startingDigit);
  let count = 0;

  for (const key of keys) {
    count += countPaths(key, hopCount - 1, memo);
  }

  memo.set(entry, count);
  return count;
  */

  // Tabulation/Bottom-up Solution
  const digitLen = 10;
  /** @type {number[]} */
  let prevRow = new Array(digitLen).fill(1);

  // 5 key is always 0 as it's unreachable
  prevRow[5] = 0;

  // Compute the remaining values
  for (let i = 0; i < hopCount; i++) {
    /** @type {number[]} */
    const currRow = [];

    for (let j = 0; j < digitLen; j++) {
      const keys = reachableKeys(j);
      currRow[j] = keys.reduce((sum, key) => sum + prevRow[key], 0);
    }

    prevRow = currRow;
  }

  return prevRow[startingDigit];
}

/** @type {(digit: number, seen: boolean[], path: number[], result: number[][])} */
function traversePath(digit, seen, path, result) {
  const keys = reachableKeys(digit);
  let isExhausted = true;

  for (const key of keys) {
    if (seen[key]) {
      continue;
    }

    isExhausted = false;
    path.push(key);
    seen[key] = true;

    traversePath(key, seen, path, result);

    path.pop();
    seen[key] = false;
  }

  if (isExhausted) {
    result.push([...path]);
  }
}

/** @type {(startingDigit: number) => number[][]} */
function listAcyclicPaths(startingDigit) {
  /** @type {boolean[]} */
  const seen = new Array(10).fill(false);
  /** @type {number[][]} */
  const result = [];

  seen[startingDigit] = true;
  traversePath(startingDigit, seen, [startingDigit], result);

  return result;
}

export default {
  reachableKeys,
  countPaths,
  listAcyclicPaths,
};
