const runner = require('timeliner');
const analyse = require('./analyse');

function analyser (opts) {
  opts.url = opts.url || opts._.slice(0, 2);
  if (!opts.url) {
    throw new Error(`url option must be provided`);
  }
  opts.count = opts.count || 10;
  if (opts.fps) {
    opts.scroll = true;
    opts.sleep = opts.sleep !== undefined ? opts.sleep : 5000;
  }
  opts.inject = (session) => {
    return session.execute(`
      window.googletag=window.googletag||{};
      window.googletag.cmd=window.googletag.cmd||[];
      window.googletag.cmd.push(()=>googletag.pubads().addEventListener('slotRenderEnded', (event) => {
        console.timeStamp('timeliner.ad-rendered');
      }));
    `);
  };

  return runner(opts)
    .then((data) => {
      if (!opts.fps) {
        return data;
      }
      return Promise.resolve(data)
        .then(runner.reporters.fps)
        .then((charts) => {
          charts.forEach((chart) => console.log(chart));
        })
        .then(() => data);
    })
    .then((data) => {
      return Promise.resolve(data)
        .then((data) => {
          const analysers = [
            (d) => runner.reporters.basic(d),
            (d) => runner.reporters.basic(d, analyse)
          ];
          return analysers.reduce((result, fn) => {
            return fn(data).map((set, i) => Object.assign({}, result[i], set));
          }, []);
        })
        .then((result) => runner.reporters.table(result, opts.url))
        .then((tables) => console.log(tables));
    });
}

module.exports = analyser;
