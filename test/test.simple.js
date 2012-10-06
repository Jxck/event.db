log = console.log;
var assert = require('assert')
  , async = require('async')
  , helper = require('./helper');

var DB = require('../');

var fixture = {
    key: 'aaa'
  , value: 'bbb'
  , dbfile: __dirname + '/../db/test.db'
};

(function() {
  // truncate the test db file
  helper.reset(fixture.dbfile);

  var db = new DB(fixture.dbfile, function() {
    db.set(fixture.key, fixture.value, function() {
      db.get(fixture.key, function(value) {
        assert.equal(fixture.value, value);
      });
    });
  });
})();

(function() {
  // truncate the test db file
  helper.reset(fixture.dbfile);

  var db = new DB(fixture.dbfile, function() {
    var count = 0
      , key = fixture.key
      , val = fixture.value
      ;

    async.whilst(
      function() {
        count++;
        key += 'a';
        return count < 6;
      },
      function(callback) {
        log(key, val);
        db.set(key, val, function() {
          db.get(key, function(value) {
            assert.equal(val, value);
            callback();
          });
        });
      },
      console.error
    );
  });
})();
