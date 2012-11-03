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

module.exports.random = function random(len) {
  var result = '';
  for (var i = 0; i < len; i++) {
    result += String.fromCharCode(Math.floor(Math.random() * 25) + 65);
  }
  return result;
};
