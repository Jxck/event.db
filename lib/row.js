var utils = require('./utils'),
    config = require('../config')(),
    logger = require('./logger');

/**
 * usage
 * new Row(key:string);
 * new Row(key:string, value:string);
 * new Row(key:string, size:object);
 * new Row(key:string, value:string,  size:object);
 *
 * rowbuf: whole buffer of row
 *
 * _key  : original key which user defined
 * key   : normalized config defined size
 * keybuf: buffer for key(view for rowbuf)
 *
 * _value: original value which user defined
 *  value: normalized config defined size
 * valbuf: buffer for value(view for rowbuf)
 */
function Row(key, value, size) {
  if (!key) { logger.worning('key is must'); console.assert(false); } // TODO
  if (typeof value !== 'string') size = value;

  this.size = size ? size : config.size;

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

  this.makeview();
}

Row.prototype.makeview = function() {
  // keybuf & valbuf is view for rowbuf
  this.keybuf = this.rowbuf.slice(0, this.size.key);
  this.valbuf = this.rowbuf.slice(this.size.key, this.size.key + this.size.value);
};

Row.prototype.checkbuffer = function(buffer) {
  // db.get gives read buffer to this func
  // get key from buffer
  // and check that is same with this key
  var keybuf = buffer.slice(0, this.size.key);
  var key = keybuf.toString();

  // if isn't, this buffer is incorrect buffer
  // maybe this key isn't in this db
  if (key !== this.key) return false;

  // this key is correct buffer
  // make it this rows buffer
  this.rowbuf = buffer;
  // and update keybuf, valbuf
  this.makeview();
  return true;
};

Row.prototype.hash = function() {
  var bucketsize = this.size.bucket;
  return utils.key2hash(this.keybuf, bucketsize);
};

Row.prototype.offset = function() {
  // offset = n * rowsize
  return this.hash() * this.size.row;
};

Row.prototype.getKey = function() {
  logger.debug(this.keybuf);
  // if key dosen't exists return null
  if (this.keybuf.toString() == '') {
    return null;
  }
  return this.keybuf.toString().trim();
};

Row.prototype.getValue = function() {
  logger.debug(this.valbuf);
  // if value dosen't exists return null
  if (this.valbuf.toString() == '') {
    return null;
  }
  return this.valbuf.toString().trim();
};

module.exports = Row;
