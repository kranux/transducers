const R = require('ramda');

const executeAndMeasureFactory = require('./utils/execute-and-measure');
const classical = executeAndMeasureFactory({
  name: 'classical',
  fn: runClassical
});
const transduced = executeAndMeasureFactory({
  name: 'transduced',
  fn: runTransduced
});

for (let inputSize of buildArray(6, (_, i) => 10 ** (i + 2))) {
  const input = buildArray(inputSize);
  console.log(`With ${inputSize} records`);
  console.table([classical(input), transduced(input)]);
}

for (let runTime of buildArray(10, (_, i) => i + 1)) {
  const input = generateArray(runTime);
  console.log(`Allow to run ${runTime} ms`);
  console.table([transduced(input)]);
}

function runClassical(v) {
  return v
    .map(x100)
    .map(addOne)
    .map(divide33)
    .filter(isOdd)
    .reduce(sumReducer, 0);
}

function runTransduced(v) {
  const transducer = R.compose(
    R.map(x100),
    R.map(addOne),
    R.map(divide33),
    R.filter(isOdd)
  );

  return R.transduce(transducer, sumReducer, 0, v);
}

function addOne(v) {
  return v + 1;
}

function x100(v) {
  return v * 100;
}

function divide33(v) {
  return v / 33;
}

function isOdd(v) {
  return v % 2 === 1;
}

function sumReducer(acc, v) {
  return acc + v;
}

function countReducer(acc) {
  return acc + 1;
}

function buildArray(size, fillMapper = (_, i) => i) {
  return Array(size)
    .fill(0, 0, size)
    .map(fillMapper);
}

function* generateArray(ms) {
  const initialTime = Date.now();
  let value = 0;

  while (Date.now() - initialTime < ms) {
    yield value++;
  }
}
