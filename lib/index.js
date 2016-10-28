const Promise = require('bluebird');
const mean = require('lodash.meanby');

const chromedriver = require('./chromedriver');
const runner = require('./runner');
const analyse = require('./analyse');

function analyser (opts) {

  opts.url = opts.url || 'http://thesun.dev';
  opts.count = opts.count || 5;
  opts.mappings = opts.mappings || {
    rubicon: /\.rubiconproject\.com\/a\/api\/fastlane\.json/,
    adnexus: /ib\.adnxs\.com\/jpt/
  };

  return Promise.using(chromedriver(), () => {
    return runner(opts)
      .then((data) => {
        return analyse(data, opts.mappings);
      })
      .then((result) => {
        console.log(`Based on ${opts.count} load(s) of ${opts.url}:`);
        Object.keys(opts.mappings).forEach((key) => {
          console.log(`${key}: ${mean(result, key).toFixed(3)}s`);
        });
      });
  });
}

module.exports = analyser;
