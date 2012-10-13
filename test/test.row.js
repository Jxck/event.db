var assert = require('assert')
  , helper = require('./helper');

var Row = require('../lib/row');

var fixture = {
    key: 'aaa'
  , value: 'bbb'
  , hash: 66
  , size: {
    'row': 256,
    'key': 8,
    'value': 248,
    'bucket': 100
  }
};

var count = 0;
(function test_new_row() {
  var row = new Row(fixture.key, fixture.value);

  assert.equal(row.key.length, row.size.key);
  assert.equal(row.value.length, row.size.value);
  assert.equal(row.rowbuf.length, row.size.row);
  assert.ok(Buffer.isBuffer(row.rowbuf));
  assert.ok(Buffer.isBuffer(row.keybuf));
  assert.ok(Buffer.isBuffer(row.valbuf));
  count++;
})();

(function test_row_hash() {
  var row = new Row(fixture.key, fixture.value, fixture.size);

  assert.equal(row.hash(), 66);
  count++;
})();

(function test_row_offset() {
  var row = new Row(fixture.key, fixture.value, fixture.size);

  assert.equal(row.offset(),
               fixture.hash * row.size.row);
  count++;
})();

(function test_row_getValue() {
  var row = new Row(fixture.key, '   asdf  ');

  assert.equal(row.getValue(), 'asdf');
  count++;
})();

assert.equal(count, 5);
console.log(count, 'test passed', __filename);
