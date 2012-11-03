var test = require('nanotest')
  , assert = require('assert');

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

test(function test_new_row() {
  // TODO: testing new Row(); pattern
  var row = new Row(fixture.key, fixture.value);

  assert.equal(row.key.length, row.size.key);
  assert.equal(row.value.length, row.size.value);
  assert.equal(row.rowbuf.length, row.size.row);
  assert.ok(Buffer.isBuffer(row.rowbuf));
  assert.ok(Buffer.isBuffer(row.keybuf));
  assert.ok(Buffer.isBuffer(row.valbuf));
})(function test_row_hash() {
  var row = new Row(fixture.key, fixture.value, fixture.size);

  assert.equal(row.hash(), 66);
})(function test_row_checkbuffer() {
  var row = new Row(fixture.key, fixture.value, fixture.size);

  var dummy = new Buffer(fixture.size.row);
  var actual = row.checkbuffer(dummy);
  assert.equal(actual, false);

  dummy = new Row(fixture.key + 'zzz', fixture.value, fixture.size);
  var actual = row.checkbuffer(dummy.rowbuf);
  assert.equal(actual, false);

  dummy = new Row(fixture.key, fixture.value + 'zzz', fixture.size);
  var actual = row.checkbuffer(dummy.rowbuf);
  assert.equal(actual, true);
})(function test_row_makeview() {
  var row = new Row(fixture.key, fixture.value, fixture.size);

  var newkey = fixture.key + 'zzz';
  var newvalue = fixture.value + 'zzz';

  var row2 = new Row(newkey, newvalue, fixture.size);

  row.rowbuf = row2.rowbuf;
  row.makeview();

  assert.equal(row.getKey(), newkey);
  assert.equal(row.getValue(), newvalue);
})(function test_row_offset() {
  var row = new Row(fixture.key, fixture.value, fixture.size);

  assert.equal(row.offset(),
               fixture.hash * row.size.row);
})(function test_row_getKey() {
  var row = new Row('   asdf  ');
  assert.equal(row.getKey(), 'asdf');
})(function test_row_getValue() {
  var row = new Row(fixture.key, '   asdf  ');
  assert.equal(row.getValue(), 'asdf');
})(function() {
  assert.count(15);
})();
