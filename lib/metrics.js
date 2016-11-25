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
    unit: 's',
    fn: (line) => {
      return line.message.message.method === 'Tracing.dataCollected' && line.message.message.params.name === 'Paint';
    }
  },
  'M2': {
    description: 'DomContentLoaded',
    indexer: 'first',
    unit: 's',
    fn: (line) => {
      return line.message.message.method === 'Page.domContentEventFired';
    }
  },
  'M3unweighted': {
    description: 'InitialScrollingSettled',
    indexer: 'unweighted',
    unit: '',
    fn: (line) => {
      return line.message.message.params.name === 'OnSwapCompositorFrame';
    }
  },
  'M3weighted': {
    description: 'InitialScrollingSettled',
    indexer: 'weighted',
    unit: '',
    fn: (line) => {
      return line.message.message.params.name === 'OnSwapCompositorFrame';
    }
  },
  'M6': {
    description: 'Page Load',
    indexer: 'first',
    unit: 's',
    fn: (line) => {
      return line.message.message.method === 'Page.loadEventFired';
    }
  },
  'FirstAD': {
    description: 'First Advert Rendered',
    indexer: 'first',
    unit: 's',
    fn: customEvent('google-ad-rendered')
  },
  'LastAD': {
    description: 'Last Advert Rendered',
    indexer: 'last',
    unit: 's',
    fn: customEvent('google-ad-rendered')
  },
};

module.exports = metrics;
