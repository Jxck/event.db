log = console.log.bind(console);
function Sockets() {
  this.sockets = [];
}

Sockets.prototype.add = function(socket) {
  this.sockets.push(socket);
  log('add client: ', this.size());
};

Sockets.prototype.broadcast = function(message) {
  log('broadcast');
  this.sockets.forEach(function(socket) {
    socket.write(message);
  });
};

Sockets.prototype.remove = function(socket) {
  var index = this.sockets.indexOf(socket);
  this.sockets.splice(index, 1);
  log('remove client: ', this.size());
};

Sockets.prototype.size = function() {
  return this.sockets.length;
};

module.exports = Sockets;
