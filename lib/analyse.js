const metrics = {
  'M1: Time to First Paint': {
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
  },
  'M6: Page Loaded': {
    indexer: 'first',
    fn: (line) => {
      return line.message.message.method === 'Page.loadEventFired';
    }
  },
  'Ads Rendered': {
    indexer: 'first',
    fn: customEvent('google-ad-rendered')
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

function customEvent (msg) {
  return (line) => {
    const message = line.message.message;
    return message.method === 'Tracing.dataCollected' && message.params.name === 'TimeStamp' && message.params.args.data.message === msg;
  };
}

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
