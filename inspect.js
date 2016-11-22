const data = require('./dump.json');

const raf = data
    .filter((l) => {
      return l.message.message.params.name === 'RequestAnimationFrame';
    })
    .reduce((groups, l) => {
      const group = Math.floor(l.timestamp);
      groups[group] = groups[group] || [];
      groups[group].push(l);
      return groups;
    }, [])
    .forEach((group, i) => {
      console.log(i, group.length);
    });
