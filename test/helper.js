var fs = require('fs');

module.exports.reset = function(file) {
  var fd = fs.openSync(file, 'w+');
  fs.truncateSync(fd, 0);
  fs.close(fd);
};

module.exports.setConfig = function(file) {
  process.argv.push('--config');
  process.argv.push(__dirname + '/config/' + file);
  var config = require('../config')();
  console.log(config.description);
  return config;
};

module.exports.test = function test(fn) {
  if (!test.funcs) test.funcs = [];
  if (fn) {
    test.funcs.push(fn);
    return test;
  }
  function next() {
    if (test.funcs.length) {
      var fn = test.funcs.shift();
      fn(next);
    }
  }
  var first = test.funcs.shift();
  return first(next);
};
