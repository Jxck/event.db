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


log = console.log.bind(console);
var fs = require('fs')
  , msgpack = require('msgpack');


var utils = require('./utils');
var Row = require('./row');

function DB(file, cb) {
  this.fd;

  // check the file exists
  var flg = fs.existsSync(file) ? 'r+' : 'w+';

  fs.open(file, flg, function(err, fd) {
    this.fd = fd;
    cb(err);
  }.bind(this));
}

DB.prototype.set = function(key, value, cb) {
  var row = new Row(key, value);
  var offset = row.writeOffset();
  var rowbuf = row.rowbuf();

  log(this.fd, rowbuf, 0, rowbuf.length, offset);

  fs.write(this.fd, rowbuf, 0,
           rowbuf.length, offset, function(err, written, buffer) {

    log(offset, written);
    cb(err);
  });
};

DB.prototype.get = function(key, cb) {
  var row = new Row(key);
  var offset = row.readOffset();

  fs.read(this.fd, row.valbuf, 0,
          row.valbuf.length, offset, function(err, byteRead, buffer) {

    log(offset);
    cb(err, row.getValue());
  });
};

DB.prototype.close = function(cb) {
  fs.close(this.fd, function(err) {
    console.error('db closed');
    cb(err);
  });
};

module.exports = DB;
