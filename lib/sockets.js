var logger = require('./logger');

function Sockets() {
  this.sockets = [];
}

Sockets.prototype.add = function(socket) {
  this.sockets.push(socket);
  logger.info('add client:', this.size());
};

Sockets.prototype.broadcast = function(message) {
  logger.info('broadcast to', this.size());
  this.sockets.forEach(function(socket) {
    socket.write(message);
  });
};

Sockets.prototype.remove = function(socket) {
  var index = this.sockets.indexOf(socket);
  this.sockets.splice(index, 1);
  logger.info('remove client:', this.size());
};

Sockets.prototype.size = function() {
  return this.sockets.length;
};

module.exports = Sockets;
