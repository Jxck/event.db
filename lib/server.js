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

    if (data[0] === 'set') {
      db.set(data[1], data[2], function() {
        sockets.broadcast(data[1] + ' ' + data[2] + '\n');
      });
    }

    if (data[0] === 'get') {
      db.get(data[1], function(value) {
        sockets.broadcast(value + '\n');
      });
    }
  });

  socket.on('end', function() {
    sockets.remove(socket);
  });
}).listen(3000);
