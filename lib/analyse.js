const metrics = {
  'M1: First Paint': {
    indexer: 'first',
    fn: (line) => {
      return line.message.message.method === 'Tracing.dataCollected' && line.message.message.params.name === 'Paint';
    }
  },
  'M2: DomContentLoaded': {
    indexer: 'first',
    fn: (line) => {
      return line.message.message.method === 'Page.domContentEventFired';
    }
  }
};

const indexers = {
  first: (data, test) => {
    const start = data[0].timestamp;
    const end = data
      .filter(test)
      .reduce((min, line) => {
        return Math.min(min, line.timestamp);
      }, Infinity);

    return end - start;
  }
};

function analyse (data) {
  return data.map((logs) => {
    return Object.keys(metrics).reduce((timings, key) => {
      const time = indexers[metrics[key].indexer](logs, metrics[key].fn);
      if (!timings[key] || time < timings[key]) {
        timings[key] = time;
      }
      return timings;
    }, {});
  }, {});
}

module.exports = analyse;
