const { performance } = require('perf_hooks');
const R = require('ramda');

for (let inputSize of buildArray(6, (_, i) => 10 ** (i + 2))) {
  const input = buildArray(inputSize);
  console.log(`## ${inputSize}`);
  outputResult(`### classical`, runClassical, input);
  outputResult(`### transduced`, runTransduced, input);
  console.log('');
}

function runClassical(v) {
  return v
    .map(addOne)
    .filter(isOdd)
    .reduce(sumReducer, 0);
}

function runTransduced(v) {
  const transducer = R.compose(
    R.map(addOne),
    R.filter(isOdd)
  );

  return R.transduce(transducer, sumReducer, 0, v);
}

function addOne(v) {
  return v + 1;
}

function isOdd(v) {
  return v % 2 === 1;
}

function sumReducer(acc, v) {
  return acc + v;
}

function buildArray(size, fillMapper = (_, i) => i) {
  return Array(size)
    .fill(0, 0, size)
    .map(fillMapper);
}

function outputResult(tag, fn, input) {
  const startTime = performance.now();
  const result = fn(input);
  console.log(
    `${tag}
    - Result: ${result}
    - It took ${performance.now() - startTime}`
  );
}
