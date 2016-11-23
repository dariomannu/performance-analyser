const mean = require('lodash.meanby');

const runner = require('timeliner');
const analyse = require('./analyse');

function analyser (opts) {
  if (!opts.url) {
    throw new Error(`url option must be provided`);
  }
  opts.count = opts.count || 1;
  opts.sleep = opts.sleep || 5000;
  opts.scroll = opts.scroll !== undefined ? opts.scroll : true;
  opts.inject = (session) => {
    return session.execute(`
      window.googletag=window.googletag||{};
      window.googletag.cmd=window.googletag.cmd||[];
      window.googletag.cmd.push(()=>googletag.pubads().addEventListener('slotRenderEnded', (event) => {
        console.timeStamp('google-ad-rendered');
      }));
    `);
  };

  return runner(opts)
    .then((data) => {
      return Promise.resolve(data)
        .then(runner.reporters.fps)
        .then((charts) => {
          charts.forEach((chart) => console.log(chart));
        })
        .then(() => data);
    })
    .then((data) => {
      return analyse(data);
    })
    .then((result) => {
      console.log(`Based on ${opts.count} load(s) of ${opts.url}:`);
      Object.keys(result[0]).forEach((key) => {
        console.log(`${key}: ${mean(result, key).toFixed(3)}s`);
      });
    });
}

module.exports = analyser;
