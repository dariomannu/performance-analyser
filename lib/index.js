const fs = require('fs');
const path = require('path');
const url = require('url');

function analyse (dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err);
      const timings = files
        .filter(f => f.match(/^Timeline(.)+.json$$/))
        .map(f => {
          const filepath = path.resolve(dir, f);
          const json = require(filepath);
          return readfile(json);
        });
      resolve(timings);
    });
  });
}

function readfile (json) {
  const start = json[0].ts;

  const requests = json
    .filter(r => r.name.match(/ResourceSendRequest/));

  const rubicon = requests
    .filter(r => url.parse(r.args.data.url).host.match(/rubiconproject/))
    .filter(r => url.parse(r.args.data.url).path.match(/fastlane\.json/))
    .reduce((min, r) => Math.min(min, r.ts), Infinity);

  const adnxs = requests
    .filter(r => url.parse(r.args.data.url).host.match(/adnxs/))
    .filter(r => url.parse(r.args.data.url).path.match(/^\/jpt/))
    .reduce((min, r) => Math.min(min, r.ts), Infinity);

  return {
    adnexus: adnxs - start,
    rubicon: rubicon - start
  };
}

module.exports = analyse;
