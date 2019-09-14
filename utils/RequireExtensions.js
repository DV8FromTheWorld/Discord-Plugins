const fs = require('fs')

require.extensions['.css'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

require.extensions['.json'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  return JSON.parse(content)
};