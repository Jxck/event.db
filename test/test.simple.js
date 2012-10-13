var assert = require('assert')
  , helper = require('./helper')
  , test = helper.test();

var DB = require('../lib/db');

var fixture = {
    key: 'aaa'
  , value: 'bbb'
  , dbfile: __dirname + '/../db/test.db'
};

var testcount = 0;
test(function(next) {
  // truncate the test db file
  helper.reset(fixture.dbfile);

  var db = new DB(fixture.dbfile, function() {
    var count = 0;
    var MAXCOUNT = 100;
    function random(len) {
      var result = '';
      for (var i = 0; i < len; i++) {
        result += String.fromCharCode(Math.floor(Math.random() * 25) + 65);
      }
      return result;
    }

    function set_get() {
      var key = random(8);
      var val = random(248);
      db.set(key, val, function() {
        db.get(key, function(err, value) {
          count++;
          assert.equal(val, value);
          if (count < MAXCOUNT) {
            set_get();
          } else {
            assert.equal(count, 100);
            testcount++;
            return next();
          }
        });
      });
    }
    set_get();
  });
})(function(next) {
  // truncate the test db file
  helper.reset(fixture.dbfile);

  var db = new DB(fixture.dbfile, function(err) {
    if (err) assert.fail(err);
    db.set(fixture.key, fixture.value, function(err) {
      if (err) assert.fail(err);
      db.get(fixture.key, function(err, value) {
        if (err) assert.fail(err);
        assert.equal(fixture.value, value);
        //console.log(fixture.value, value);
        testcount++;
        return next();
      });
    });
  });
})(function() {
  assert.equal(testcount, 2);
  helper.log(__filename, testcount);
})();
