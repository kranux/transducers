const { performance } = require('perf_hooks');
const R = require('ramda');

const inputSize = 1000;

const input = buildInput();
outputResult('classical', runClassical, input);
outputResult('transduced', runTransduced, input);

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

function buildInput() {
  return Array(inputSize)
    .fill(0, 0, inputSize)
    .map((_, i) => i);
}

function outputResult(tag, fn, input) {
  const startTime = performance.now();
  const result = fn(input);
  console.log(
    `tag: ${tag}
    Result: ${result}
    it took ${performance.now() - startTime}`
  );
}
