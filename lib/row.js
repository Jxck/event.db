var utils = require('./utils'),
    logger = require('./logger');

function Row(key, value, size) {
  this.size = size ? size : {
    'row': 256,
    'key': 8,
    'value': 248,
    'bucket': 10000
  };

  this._key = key;
  this.key = utils.normalize(key, this.size.key);
  this.keybuf = new Buffer(this.key);

  if (value) {
    this._value = value;
    this.value = utils.normalize(value, this.size.value);
    this.valbuf = new Buffer(this.value);
  } else {
    this._value = null;
    this.value = this._value;
    this.valbuf = new Buffer(this.size.value);
  }
}

Row.prototype.hash = function() {
  var bucketsize = this.size.bucket;
  return utils.key2hash(this.keybuf, bucketsize);
};

Row.prototype.writeOffset = function() {
  return this.hash() * this.size.row;
};

Row.prototype.readOffset = function() {
  return this.hash() * this.size.row + this.size.key;
};

Row.prototype.rowbuf = function() {
  if (!this.value) {
    logger.worning('value desen\'t set to');
  }
  var key_value = [this.keybuf, this.valbuf];
  var row = Buffer.concat(key_value, this.size.row);
  return row;
};

Row.prototype.getValue = function() {
  // if key dosen't exists return null
  if (this.valbuf.toString() == '') {
    return null;
  }
  return this.valbuf.toString().trim();
};

module.exports = Row;
