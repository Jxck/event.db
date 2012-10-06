module.exports.key2hash = function(key/*should be buffer*/) {
  if (!Buffer.isBuffer(key)) {
    console.error('key2hash: key should be buffer');
    key = new Buffer(key);
  }
  var bucketnum = 100;
  var hash = 751;
  for (var i = 0; i < key.length; i++) {
    hash = hash * 37 + key[i];
  }
  return hash % bucketnum;
};

module.exports.normalize = function(data, length) {

  while (data.length < length) {
    data = ' ' + data;
  }
  return data;
};
