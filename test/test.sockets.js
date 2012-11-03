var test = require('nanotest')
  , assert = require('assert');

var Sockets = require('../lib/sockets');

test(function() {
  // test socket new, add, remove, size
  var sockets = new Sockets();

  assert.deepEqual(sockets.sockets, []);

  sockets.add('client');
  assert.deepEqual(sockets.sockets, ['client']);

  sockets.add('client2');
  assert.deepEqual(sockets.sockets, ['client', 'client2']);

  assert.equal(sockets.size(), 2);

  sockets.remove('client');
  assert.deepEqual(sockets.sockets, ['client2']);
})(function() {
  // test broadcast
  var sockets = new Sockets();

  var count = 0;
  var Client = function() {};

  Client.prototype.write = function(message) {
    count++;
  }

  sockets.add(new Client());
  sockets.add(new Client());
  sockets.add(new Client());

  sockets.broadcast('test');

  assert.equal(count, 3);
})(function() {
  assert.count(6);
});

