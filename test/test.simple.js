log = console.log;
var assert = require('assert')
  , async = require('async')
  , helper = require('./helper');

var DB = require('../lib/db');

var fixture = {
    key: 'aaa'
  , value: 'bbb'
  , dbfile: __dirname + '/../db/test.db'
};

(function() {
  // truncate the test db file
  helper.reset(fixture.dbfile);

  var db = new DB(fixture.dbfile, function(err) {
    if (err) assert.fail(err);
    db.set(fixture.key, fixture.value, function(err) {
      if (err) assert.fail(err);
      db.get(fixture.key, function(err, value) {
        if (err) assert.fail(err);
        assert.equal(fixture.value, value);
      });
    });
  });
})();

(function() {
  // truncate the test db file
  helper.reset(fixture.dbfile);

  var db = new DB(fixture.dbfile, function() {
    var count = 0;
    function random(len) {
      var result = '';
      for (var i = 0; i < len; i++) {
        result += String.fromCharCode(Math.floor(Math.random() * 25) + 65);
      }
      return result;

    }

    async.whilst(
      function() {
        count++;
        key = random(8);
        val = random(248);
        return count < 10000;
      },
      function(callback) {
        db.set(key, val, function() {
          db.get(key, function(err, value) {
            console.log('count', count);
            //assert.equal(val, value);
            callback();
          });
        });
      },
      console.error
    );
  });
})();
