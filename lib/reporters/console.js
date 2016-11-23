var Table = require('cli-table');

module.exports = function (report, metrics) {
  const table = new Table({ head: ['Metric', 'Description', 'Mean Time (s)'] });

  console.log(`Based on ${report.summary.count} load(s) of ${report.summary.url}:`);
  report.metrics.forEach((metric) => {
    table.push([metric.key, metrics[metric.key].description, `${(metric.value/1000).toFixed(2)}`]);
  });
  console.log(table.toString());
};
