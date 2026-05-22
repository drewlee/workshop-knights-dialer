/*
1 2 3
4 5 6
7 8 9
  0
*/
/*
3 Hops from 1
1
6 8
0 1 7 1 3
4 6 6 8 2 6 6 8 4 8
*/

/** @type {(startingDigit: number): number[]} */
function reachableKeys(startingDigit) {
	const keys = [
    [4, 6],
    [6, 8],
    [7, 9],
    [4, 8],
    [0, 3, 9],
    [],
    [0, 1, 7],
    [2, 6],
    [1, 3],
    [2, 4],
  ];

  return keys[startingDigit];
}

/** @type {(startingDigit: number, hopCount: number) => number} */
function countPaths(startingDigit, hopCount) {
  if (hopCount === 0) {
    return 1;
  }

  const keys = reachableKeys(startingDigit);
  let count = 0;

  for (const key of keys) {
    count += countPaths(key, hopCount - 1);
  }

  return count;
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
