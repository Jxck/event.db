var winston = require('winston');

function customPrepareStackTrace(error, structuredStackTrace) {
  return structuredStackTrace[0].getLineNumber();
}

function getLineNumber() {
  var original = Error.prepareStackTrace;
  Error.prepareStackTrace = customPrepareStackTrace;
  var error = {};
  Error.captureStackTrace(error, getLineNumber);
  var lineNumber = error.stack;
  Error.prepareStackTrace = original;
  return lineNumber;
}

module.exports = (function() {
  var instance = null;

  function initialize(config) {
    var transport = new winston.transports.Console({
      level: config.level,
      colorize: true,
      timestamp: true
    });
    var logger = new (winston.Logger)({ transports: [transport] });
    logger.setLevels(winston.config.syslog.levels);
    return logger;
  }

  function getInstance() {
    if (!instance) {
      var config = {
        level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug'
      };
      instance = initialize(config);
    }
    return instance;
  }

  function generate(level) {
    return function() {
      getInstance()[level](Array.prototype.slice.call(arguments).join(' '));
    }
  }

  return {
    debug: generate('debug'),
    info: generate('info'),
    notice: generate('notice'),
    warning: generate('warning'),
    error: generate('error'),
    crit: generate('crit'),
    alert: generate('alert'),
    emerg: generate('emerg')
  };
}());
