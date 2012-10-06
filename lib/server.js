log = console.log.bind(console);
var net = require('net');

var Sockets = require('./sockets')
  , DB = require('./db');

var sockets = new Sockets()
  , db = new DB(__dirname + '/../db/test.db', function() {});

net.createServer(function(socket) {
  sockets.add(socket);
  log('connected');

  socket.on('data', function(data) {
    data = data.toString().trim().split(' ');
    log('data: ', data);

    var command = data[0]
      , key = data[1]
      , value = data[2]? data[2]: '';

    if (command === 'set') {
      db.set(key, value, function(err) {
        sockets.broadcast(data[1] + ' ' + data[2] + '\n');
      });
    }

    if (command === 'get') {
      db.get(key, function(err, value) {
        socket.write(value + '\n');
      });
    }
  });

  socket.on('end', function() {
    sockets.remove(socket);
  });
}).listen(3000);
