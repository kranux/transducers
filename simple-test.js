const { performance } = require('perf_hooks');
const R = require('ramda');

for (let inputSize of buildArray(6, (_, i) => 10 ** (i + 2))) {
  const input = buildArray(inputSize);
  console.log(`With ${inputSize} records`);
  console.table([
    runAndGetPerformanceData(`classical`, runClassical, input),
    runAndGetPerformanceData(`transduced`, runTransduced, input)
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

function runAndGetPerformanceData(name, fn, input) {
  const startTime = performance.now();
  const initialMemoryUsage = getmemoryUsageDelta();
  const result = fn(input);

  return {
    name,
    result,
    time_ms: formatMillis(performance.now() - startTime),
    ...tupplesToObject(
      objMapper(
        ([key, value]) => [
          key,
          `${Math.round((value / 1024 / 1024) * 100) / 100} MB`
        ],
        getmemoryUsageDelta(initialMemoryUsage)
      )
    )
  };
}

function getmemoryUsageDelta(initialMemoryUsage = {}) {
  const currentMemoryUsage = process.memoryUsage();
  return Object.keys(currentMemoryUsage).reduce((acc, currentKey) => {
    return {
      ...acc,
      [currentKey]:
        currentMemoryUsage[currentKey] - (initialMemoryUsage[currentKey] || 0)
    };
  }, {});
}

function objMapper(mapper, obj) {
  return Object.keys(obj).map(key => mapper([key, obj[key]]));
}

function tupplesToObject(tupples) {
  return tupples.reduce((acc, [key, value]) => {
    return { ...acc, [key]: value };
  }, {});
}

function formatMillis(millis) {
  return `${millis.toFixed(1)}`;
}
