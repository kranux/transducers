const R = require('ramda');

const executeAndMeasure = require('./utils/execute-and-measure');

for (let inputSize of buildArray(6, (_, i) => 10 ** (i + 2))) {
  const input = buildArray(inputSize);
  console.log(`With ${inputSize} records`);
  console.table([
    executeAndMeasure(`classical`, runClassical, input),
    executeAndMeasure(`transduced`, runTransduced, input)
  ]);
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
