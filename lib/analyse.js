const metrics = {
  'header-bidding-sent': {
    indexer: 'first',
    test: (row) => {
      const regexes = [
        /rubiconproject\.com\/a\/api\/fastlane\.json/,
        /adnxs\.com\/jpt/
      ];
      return row.message.message.method === 'Network.requestWillBeSent' && regexes.find(r => row.message.message.params.request.url.match(r));
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
  return Object.keys(metrics).reduce((timings, key) => {
    const time = indexers[metrics[key].indexer](data, metrics[key].test);
    if (!timings[key]) {
      timings[key] = time;
    }
    return timings;
  }, {});
}

module.exports = analyse;
