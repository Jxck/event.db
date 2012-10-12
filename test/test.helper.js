var helper = require('./helper')
  , assert = require('assert');

var actual = [];
helper.test(function(next) {
  setTimeout(function() {
    actual.push(1);
    next();
  }, 300);
})(function(next) {
  setTimeout(function() {
    actual.push(2);
    next();
  }, 200);
})(function(next) {
  setTimeout(function() {
    actual.push(3);
    next();
  }, 100);
})(function(next) {
  assert.deepEqual(actual, [1, 2, 3]);
  next();
})();

