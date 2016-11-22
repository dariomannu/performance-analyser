const babar = require('babar');

function chart (data) {
  return babar(data.map((fps, i) => {
    return [i, fps];
  }), { caption: 'scrolling fps', height: 10 });
}

module.exports = function (data) {
  const fps = data
      .filter((l) => {
        return l.message.message.params.name === 'OnSwapCompositorFrame';
      })
      .reduce((groups, l) => {
        const group = Math.floor(l.timestamp);
        groups[group] = groups[group] || [];
        groups[group].push(l);
        return groups;
      }, [])
      .map((group) => group.length);

  fps.pop();

  for (var i = 0; i < fps.length; i++) {
    fps[i] = fps[i] || 0;
  }

  return chart(fps);
};
