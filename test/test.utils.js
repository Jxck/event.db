var utils = require('../lib/utils')
  , test = require('nanotest')
  , assert = require('assert');

test(function test_key2hash() {
  // make key buffer to hash
  var keybuf = new Buffer('aaa')
    , bucketsize = 100;

  var actual = utils.key2hash(keybuf, bucketsize)
    , expected = 82;

  assert.equal(actual, expected);
})(function test_conflicts() {
  // you can see the conflicts of hash
  n = 100;
  hashes = {};
  while (n--) {
    var hash = utils.key2hash(new Buffer(n));
    hashes[hash] ? hashes[hash] ++: hashes[hash] = 1;
  }

  //console.dir(hashes);
})(function test_normalize() {
  // make data length to len
  // padding with blank
  var data = 'asdfg'
    , len = 10;

  var actual = utils.normalize(data, len)
    , expected = '     asdfg';

  assert.equal(actual, expected);
})(function test_normalize_args() {
  // no length returns data with no change
  var data = 'asdfg'
    , actual = utils.normalize(data)
    , expected = data;

  assert.equal(actual, expected);
})(function() {
  assert.count(3);
})();
