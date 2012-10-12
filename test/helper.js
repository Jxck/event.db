var fs = require('fs');

module.exports.reset = function(file) {
  var fd = fs.openSync(file, 'w+');
  fs.truncateSync(fd, 0);
  fs.close(fd);
};

module.exports.test = function() {
  return function test(fn) {
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
};
