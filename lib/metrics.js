function customEvent (msg) {
  return (line) => {
    const message = line.message.message;
    return message.method === 'Tracing.dataCollected' && message.params.name === 'TimeStamp' && message.params.args.data.message === msg;
  };
}

const metrics = {
  'M1': {
    description: 'Time to First Paint',
    indexer: 'first',
    fn: (line) => {
      return line.message.message.method === 'Tracing.dataCollected' && line.message.message.params.name === 'Paint';
    }
  },
  'M2': {
    description: 'DomContentLoaded',
    indexer: 'first',
    fn: (line) => {
      return line.message.message.method === 'Page.domContentEventFired';
    }
  },
  'M6': {
    description: 'Page Load',
    indexer: 'first',
    fn: (line) => {
      return line.message.message.method === 'Page.loadEventFired';
    }
  },
  'FirstAD': {
    description: 'First Advert Rendered',
    indexer: 'first',
    fn: customEvent('google-ad-rendered')
  }
};

module.exports = metrics;
