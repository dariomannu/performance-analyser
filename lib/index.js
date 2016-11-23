const mean = require('lodash.meanby');

const runner = require('timeliner');
const analyse = require('./analyse');
const chart = require('./fps-chart');

function analyser (opts) {
  if (!opts.url) {
    throw new Error(`url option must be provided`);
  }
  opts.count = opts.count || 1;
  opts.sleep = opts.sleep || 5000;
  opts.scroll = opts.scroll !== undefined ? opts.scroll : true;
  opts.inject = (session) => {
    return session.execute(`googletag=googletag||{};googletag.cmd=googletag.cmd||[];googletag.cmd.push(()=>googletag.pubads().addEventListener('slotRenderEnded', (event) => { console.timeStamp('google-ad-rendered'); }))`);
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
      console.log(`Based on ${opts.count} load(s) of ${opts.url}:`);
      Object.keys(result[0]).forEach((key) => {
        console.log(`${key}: ${mean(result, key).toFixed(3)}s`);
      });
    });
}

module.exports = analyser;
