const { performance } = require('perf_hooks');
const R = require('ramda');

module.exports = function executeFunctionAndMeasurePerformance(
  name,
  fn,
  input
) {
  const startTime = performance.now();
  const initialMemoryUsage = getmemoryUsageDelta();
  const result = fn(input);

  return {
    name,
    result,
    time_ms: formatMillis(performance.now() - startTime),
    ...R.compose(
      objMapper(numbToMb),
      getmemoryUsageDelta
    )(initialMemoryUsage)
  };
};

function numbToMb(value) {
  return `${Math.round((value / 1024 / 1024) * 100) / 100} MB`;
}

function getmemoryUsageDelta(initialMemoryUsage = {}) {
  return objReducer((acc, value, key) => {
    return {
      ...acc,
      [key]: value - (initialMemoryUsage[key] || 0)
    };
  }, {})(process.memoryUsage());
}

function objMapper(mapper) {
  return function(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      return { ...acc, [key]: mapper(obj[key], key, obj) };
    }, {});
  };
}

function objReducer(reducer, initialValue) {
  return function(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      return reducer(acc, obj[key], key);
    }, initialValue);
  };
}

function formatMillis(millis) {
  return `${millis.toFixed(1)}`;
}
