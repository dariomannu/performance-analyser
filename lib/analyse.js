const metrics = require('./metrics');

const indexers = {
  first: (data, test) => {
    return data
      .filter(test)
      .reduce((min, line) => {
        return Math.min(min, line.timestamp);
      }, Infinity);
  },
  last: (data, test) => {
    return Math.abs(data
      .filter(test)
      .reduce((max, line) => {
        return Math.max(max, line.timestamp);
      }, -Infinity));
  }
};

function analyse (data) {
  return data.map((logs) => {
    return Object.keys(metrics).reduce((timings, key) => {
      const time = indexers[metrics[key].indexer](logs, metrics[key].fn);
      if (!timings[key]) {
        timings[key] = time;
      } else {
        console.log(key, time, timings.key);
      }
      return timings;
    }, {});
  }, {});
}

module.exports = analyse;
