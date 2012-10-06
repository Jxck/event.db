var fs = require('fs');

module.exports.reset = function(file) {
  var fd = fs.openSync(file, 'w+');
  fs.truncateSync(fd, 0);
  fs.close(fd);
};
