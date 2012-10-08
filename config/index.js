module.exports = (function() {
  var command = process.argv.indexOf('--config');
  var configfile;
  if (command > 0) {
    configfile = process.argv[command + 1];
  } else {
    configfile = __dirname + '/default.json';
  }
  return require(configfile);
});
