const mean = require('lodash.meanby');

const fs = require('fs');
const runner = require('timeliner');
const analyse = require('./analyse');

function analyser (opts) {
  opts.url = opts.url || 'https://thetimes.co.uk';
  opts.count = opts.count || 1;

  return runner(opts)
    .then((data) => {
      /*return new Promise((resolve, reject) => {
        fs.writeFile('./dump.json', JSON.stringify(data[0], null, '  '), (err) => {
          err ? reject(err) : resolve(data);
        });
      });
    })
    .then((data) => {*/
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
