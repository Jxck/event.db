var utils = require('./utils'),
    logger = require('./logger');

/**
 * _key  : original key which user defined
 * key   : normalized config defined size
 * keybuf: buffer for key
 *
 * _value: original value which user defined
 *  value: normalized config defined size
 * valbuf: buffer for value
 */
function Row(key, value, size) {
  this.size = size ? size : {
    'row': 256,
    'key': 8,
    'value': 248,
    'bucket': 10000
  };

  this.rowbuf = new Buffer(this.size.row);

  this._key = key;
  this.key = utils.normalize(key, this.size.key);
  this.rowbuf.write(this.key, 0, this.size.key);

  // write to buffer if value exists
  // if in 'get' operation value dosen't exists
  if (value) {
    this._value = value;
    this.value = utils.normalize(value, this.size.value);
    this.rowbuf.write(this.value, this.size.key, this.size.value);
  }

  // keybuf & valbuf is view for rowbuf
  this.keybuf = this.rowbuf.slice(0, this.size.key);
  this.valbuf = this.rowbuf.slice(this.size.key, this.size.key + this.size.value);
}

Row.prototype.hash = function() {
  var bucketsize = this.size.bucket;
  return utils.key2hash(this.keybuf, bucketsize);
};

Row.prototype.offset = function() {
  // offset = n * rowsize
  return this.hash() * this.size.row;
};

/** TODO: remove
Row.prototype.writeOffset = function() {
  // offset = n * rowsize
  return this.hash() * this.size.row;
};

Row.prototype.readOffset = function() {
  return this.hash() * this.size.row + this.size.key;
};
**/

Row.prototype.getValue = function() {
  logger.debug(this.valbuf);
  // if key dosen't exists return null
  if (this.valbuf.toString() == '') {
    return null;
  }
  return this.valbuf.toString().trim();
};

module.exports = Row;
