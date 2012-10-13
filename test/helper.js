var fs = require('fs');

module.exports.reset = function(file) {
  var fd = fs.openSync(file, 'w+');
  fs.truncateSync(fd, 0);
  fs.close(fd);
};

module.exports.filename = function(name) {
  name = name.split('/');
  return name[name.length - 1];
};

module.exports.log = function(name, testcount) {
  console.error('\033[35m' + module.exports.filename(name) + ': ' + testcount + '\033[0m');
};

module.exports.test = function() {
  return function tests(fn) {
    if (!tests.funcs) tests.funcs = [];
    if (fn) {
      tests.funcs.push(fn);
      return tests;
    }
    function next() {
      if (tests.funcs.length) {
        var fn = tests.funcs.shift();
        fn(next);
      }
    }
    var first = tests.funcs.shift();
    return first(next);
  };
};
