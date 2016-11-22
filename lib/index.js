const mean = require('lodash.meanby');

const fs = require('fs');
const runner = require('timeliner');
const analyse = require('./analyse');
const chart = require('./fps-chart');

function analyser (opts) {
  opts.url = opts.url || 'https://thetimes.co.uk';
  opts.count = opts.count || 1;
  opts.driver = opts.driver || 'http://52.17.159.226:4444/wd/hub';

  opts.inject = function (session) {
    return session.execute('function f () { window.scrollBy(0,5); window.requestAnimationFrame(f); } window.requestAnimationFrame(f);');
  };

  return runner(opts)
    /*.then((data) => {
      return new Promise((resolve, reject) => {
        fs.writeFile('./dump.json', JSON.stringify(data[0], null, '  '), (err) => {
          err ? reject(err) : resolve(data);
        });
      });
    })*/
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
