function analyse (data, mappings) {
  return data.map((logs) => {
    const lines = logs
      .map((line) => line.message);

    return Object.keys(mappings).reduce((timings, key) => {
      const time = first(lines, mappings[key]);
      if (!timings[key] || time < timings[key]) {
        timings[key] = time;
      }
      return timings;
    }, {});

  }, {});
}

function first (data, regexp) {
  const start = data[0].message.params.timestamp;
  const end = data
    .filter((line) => {
      return line.message.method === 'Network.requestWillBeSent';
    })
    .map((line) => line.message.params)
    .filter((line) => line.request.url.match(regexp))
    .reduce((min, line) => Math.min(min, line.timestamp), Infinity);

  return end - start;
}

module.exports = analyse;
