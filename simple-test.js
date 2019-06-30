const { performance } = require('perf_hooks');

const inputSize = 1000;

const startTime = performance.now();
const classicalResult = runClassical();
console.log(
  'Result: ',
  classicalResult,
  `it took ${performance.now() - startTime}`
);

function runClassical() {
  const input = Array(inputSize)
    .fill(0, 0, inputSize)
    .map((_, i) => i);

  return input
    .map(v => v + 1)
    .filter(v => v % 2 === 1)
    .reduce((sum, v) => sum + v, 0);
}
