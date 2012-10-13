/**
rowsize = 256
hash = n (1<=n<=1000)
offset = n * rowsize (256<=offset<=256000)

 -----------------------------------
| key = 8 | value = 248             |
 -----------------------------------
| key = 8 | value = 248             |
 -----------------------------------
| key = 8 | value = 248             |
 -----------------------------------

next feature

 -----------------------------------
| key = 8 | value = 244 | next = 4  |
 -----------------------------------
| key = 8 | value = 244 | next = 4  |
 -----------------------------------
| key = 8 | value = 244 | next = 4  |
 -----------------------------------

 */

var fs = require('fs');

var Row = require('./row')
  , utils = require('./utils')
  , logger = require('./logger');

function DB(file, config, cb) {
  this.fd;

  // if config dosen't exist
  if (typeof config === 'function') {
    cb = config;
    config = {};
  }

  this.config = config;

  // check that file exists
  var flg = fs.existsSync(file) ? 'r+' : 'w+';

  fs.open(file, flg, function(err, fd) {
    if (err) logger.error(error);
    this.fd = fd;
    cb(err);
  }.bind(this));
}

DB.prototype.set = function(key, value, cb) {
  var row = new Row(key, value, this.config.size);
  var offset = row.offset();
  var rowbuf = row.rowbuf;

  logger.debug(this.fd, rowbuf, 0, rowbuf.length, offset);

  fs.write(this.fd, rowbuf, 0,
           rowbuf.length, offset, function(err, written, buffer) {

    logger.debug(offset, written);
    cb(err);
  });
};

DB.prototype.get = function(key, cb) {
  var row = new Row(key);
  var offset = row.offset();

  var buf = new Buffer(256); // temp buffer

  fs.read(this.fd, buf, 0,
          buf.length, offset, function(err, byteRead, buffer) {

    var value = null;

    // row checks this buffer has a correct key or not
    if (row.checkbuffer(buffer)) {
      // if this buffer has correct key
      // get the value from row
      value = row.getValue();
    }
    cb(err, value);
  });
};

DB.prototype.close = function(cb) {
  fs.close(this.fd, function(err) {
    if (err) logger.alert(err);
    logger.notice('db closed');
    cb(err);
  });
};

module.exports = DB;
