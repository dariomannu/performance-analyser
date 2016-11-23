const mean = require('lodash.meanby');

const runner = require('timeliner');
const analyse = require('./analyse');
const chart = require('./fps-chart');
const reporters = require('./reporters');

function analyser (opts) {
  if (!opts.url) {
    throw new Error(`url option must be provided`);
  }
  opts.count = opts.count || 1;
  opts.sleep = opts.sleep || 5000;

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
        report.metrics.push({key: key, value: mean(result, key).toFixed(3)});
      });
      return report;
    })
    .then((report) => {
      var p = [];
      for(var r in reporters)
        p.push(reporters[r].call(this, report));

      return Promise.all(p);
    });
}

module.exports = analyser;
