var assert = require('assert')
  , helper = require('./helper');

helper.setConfig('test.json');

var Row = require('../lib/row');

var fixture = {
    key: 'aaa'
  , value: 'bbb'
  , hash: 66
};

(function test_new_row() {
  var row = new Row(fixture.key, fixture.value);

  assert.equal(row.key.length, row.size.key);
  assert.equal(row.value.length, row.size.value);
  assert.ok(Buffer.isBuffer(row.keybuf));
  assert.ok(Buffer.isBuffer(row.valbuf));
})();

(function test_row_hash() {
  var row = new Row(fixture.key, fixture.value, fixture.size);

  assert.equal(row.hash(), 66);
})();

(function test_row_offset() {
  var row = new Row(fixture.key, fixture.value, fixture.size);

  assert.equal(row.writeOffset(),
               fixture.hash * row.size.row);

  assert.equal(row.readOffset(),
               fixture.hash * row.size.row
               + row.size.key);
})();

(function test_row_rowbuf() {
  var row = new Row(fixture.key, fixture.value, fixture.size);

  assert.ok(Buffer.isBuffer(row.rowbuf()));

  assert.equal(row.rowbuf().length,
               row.size.row);
})();

(function test_row_getValu() {
  var row = new Row(fixture.key, '   asdf  ');

  assert.equal(row.getValue(), 'asdf');
})();
