const metrics = {
  'M1': {
    description: 'Time to First Paint',
    indexer: 'first',
    fn: (line) => {
      return line.message.message.method === 'Tracing.dataCollected' && line.message.message.params.name === 'Paint';
    }
  },
  'M2': {
    description: 'DomContentLoaded',
    indexer: 'first',
    fn: (line) => {
      return line.message.message.method === 'Page.domContentEventFired';
    }
  },
  /*'M3': {
    description: 'Render Settlement',
    indexer: 'last',
    fn: (line) => {
      const paint = line.message.message.method === 'Tracing.dataCollected' && line.message.message.params.name === 'Layout';
      return paint;// && line.message.message.params.args.data.clip[1] < 800;
    }
  },*/
  'M6': {
    description: 'Page Load',
    indexer: 'first',
    fn: (line) => {
      return line.message.message.method === 'Page.loadEventFired';
    }
  }
};

const indexers = {
  first: (data, test) => {
    return data
      .filter(test)
      .reduce((min, line) => {
        return Math.min(min, line.timestamp);
      }, Infinity);
  },
  last: (data, test) => {
    return data
      .filter(test)
      .reduce((max, line) => {
        return Math.max(max, line.timestamp);
      }, 0);
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
