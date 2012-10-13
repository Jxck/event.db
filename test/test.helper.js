var helper = require('./helper')
  , test = helper.test()
  , assert = require('assert');

var actual = [];
var testcount = 0;
test(function(next) {
  setTimeout(function() {
    actual.push(1);
    testcount++;
    next();
  }, 300);
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
  assert.equal(helper.filename(__filename), 'test.helper.js');
  assert.equal(testcount, 4);
  helper.log(__filename, testcount);
})();
