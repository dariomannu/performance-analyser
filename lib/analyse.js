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
  },
  unweighted: (data, test) => {
    const result = data
        .filter(test)
        .reduce((groups, l) => {
          const group = Math.floor(l.timestamp);
          groups[group] = groups[group] || [];
          groups[group].push(l);
          return groups;
        }, [[]])
        .filter((a, i, j) => {
          console.log(`LL1: ${j.length}`);
          return true;
        })
        .filter((x, i, j) => i < j.length -1)
        .filter((a, i, j) => {
          console.log(`LL2: ${j.length}`);
          return true;
        })
        .map((group, i) => {
          const fps = group.length;
          const penaltyPercent = (60-fps)/60;
          //const weight = i +1;
          //const weight = i;
          const weight = 1;

          console.log(`fps: ${fps}, penaltyPercent: ${penaltyPercent}, i: ${i} -> ${weight *penaltyPercent}`);
          return weight *penaltyPercent;
        })
        .reduce((a,b) => a+b, 0)
    ;
    return result;
  },
  weighted: (data, test) => {
    const result = data
        .filter(test)
        .reduce((groups, l) => {
          const group = Math.floor(l.timestamp);
          groups[group] = groups[group] || [];
          groups[group].push(l);
          return groups;
        }, [[]])
        .filter((a, i, j) => {
          console.log(`LL1: ${j.length}`);
          return true;
        })
        .filter((x, i, j) => i < j.length -1)
        .filter((a, i, j) => {
          console.log(`LL2: ${j.length}`);
          return true;
        })
        .map((group, i) => {
          const fps = group.length;
          const penaltyPercent = (60-fps)/60;
          const weight = i +1;
          //const weight = i;
          //const weight = 1;

          console.log(`fps: ${fps}, penaltyPercent: ${penaltyPercent}, i: ${i} -> ${weight *penaltyPercent}`);
          return weight *penaltyPercent;
        })
        .reduce((a,b) => a+b, 0)
    ;
    return result;
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
