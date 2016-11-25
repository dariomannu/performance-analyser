const mean = require('lodash.meanby');

const runner = require('timeliner');
const analyse = require('./analyse');
const reporters = require('./reporters');
const metrics = require('./metrics');

function analyser (opts) {
  if (!opts.url) {
    throw new Error(`url option must be provided`);
  }
  opts.count = opts.count || 1;
  opts.sleep = opts.sleep || 5000;
  opts.reporters = opts.reporters || 'console';

  const enabledReporters = opts.reporters.split(/\s+|,/g);
  enabledReporters.forEach((r) => {
    if(!reporters[r])
      throw new Error(`Unknown reporter: "${r}"`);
  });

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
      var report = {
        summary: {
          count: opts.count,
          url: opts.url
        },
        metrics: []
      }

      Object.keys(result[0]).forEach((key) => {
        report.metrics.push({key: key, value: mean(result, key)});
      });
      return report;
    })
    .then((report) => Promise.all(enabledReporters.map((r) => reporters[r].call(this, report, metrics))));
}

module.exports = analyser;
