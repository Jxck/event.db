var net = require('net');

var Sockets = require('./sockets')
  , DB = require('./db')
  , config = require('../config')()
  , logger = require('./logger');

var sockets = new Sockets();

var db = new DB(config.file, config, function() {
  net.createServer(function(socket) {
    sockets.add(socket);
    logger.info('connected');

    socket.on('data', function(data) {
      data = data.toString().trim().split(' ');
      logger.debug('data:', data);

      var command = data[0]
        , key = data[1]
        , value = data[2] ? data[2] : '';

        if (command === 'set') {
          logger.info('set', key);
          db.set(key, value, function(err) {
            sockets.broadcast(data[1] + ' ' + data[2]);
            sockets.broadcast('\nSTORED\n');
          });
        }

        if (command === 'get') {
          logger.info('get', key);
          db.get(key, function(err, value) {
            socket.write(value);
            socket.write('\nEND\n');
          });
        }
      });

    socket.on('end', function() {
      logger.info('disconnected');
      sockets.remove(socket);
    });
  }).listen(config.server.port);
});

// TODO: MOVE
process.on('exit', function() {
  logger.crit('process exit');
  db.close(function(err) {
    if (err) logger.alert(err);
    var code = err ? 1 : 0;
    process.exit(code);
  });
});
process.on('uncaughtException', function() {
  logger.alert('process uncaughtException');
  db.close(function(err) {
    if (err) logger.alert(err);
    var code = err ? 1 : 0;
    process.exit(code);
  });
});
process.on('SIGINT', function() {
  logger.crit('process SIGINT');
  db.close(function(err) {
    if (err) logger.alert(err);
    var code = err ? 1 : 0;
    process.exit(code);
  });
});
process.on('SIGHUP', function() {
  logger.crit('process SIGHUP');
  db.close(function(err) {
    if (err) logger.alert(err);
    var code = err ? 1 : 0;
    process.exit(code);
  });
});
