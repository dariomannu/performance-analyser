const fs = require('fs');
const Promise = require('bluebird');
const writeFile = Promise.promisify(fs.writeFile);

module.exports = function(report) {
  var template = '<build>\n';

  report.metrics.forEach((metric) => {
    template += `<statisticValue key="${metric.key}" value="${metric.value}"/>\n`;
  });

  template += '</build>\n';

  return writeFile("teamcity-info.xml", template);
};

