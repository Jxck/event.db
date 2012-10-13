var helper = require('./helper')
  , test = helper.test()
  , assert = require('assert');

var actual = [];
var testcount = 0;
test(function(next) {
  var count = 0;
  function recur() {
    if (count > 3) {
      actual.push(1);
      testcount++;
      return next();
    }
    assert(count <= 3);
    count++;
    recur();
  }
  recur();
})(function(next) {
  setTimeout(function() {
    actual.push(2);
    testcount++;
    next();
  }, 200);
})(function(next) {
  setTimeout(function() {
    actual.push(3);
    testcount++;
    next();
  }, 100);
})(function(next) {
  assert.deepEqual(actual, [1, 2, 3]);
  testcount++;
  next();
})(function(next) {
  assert.equal(testcount, 4);
  helper.log(__filename, testcount);
})();
