const mean = require('lodash.meanby');

const runner = require('timeliner');
const analyse = require('./analyse');
const chart = require('./fps-chart');
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

  opts.inject = function (session) {
    return session.execute('function f () { window.scrollBy(0,5); window.requestAnimationFrame(f); } window.requestAnimationFrame(f);');
  };

  return runner(opts)
    .then((data) => {
      console.log(chart(data[0]));
      return data;
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
        report.metrics.push({key: key, value: Math.round(mean(result, key)*1000)});
      });
      return report;
    })
    .then((report) => Promise.all(enabledReporters.map((r) => reporters[r].call(this, report, metrics))));
}

module.exports = analyser;
