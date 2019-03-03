import pino from 'pino';

const superstruct = require('superstruct');

function addFinalHandler(logger) {
  // use pino.final to create a special logger that
  // guarantees final tick writes
  const handler = pino.final(logger, (err, finalLogger, evt) => {
    finalLogger.info(`${evt} caught`);
    if (err) finalLogger.error(err, 'error caused exit');
    process.exit(err ? 1 : 0);
  });
  // catch all the ways node might exit
  process.on('uncaughtException', (err) => handler(err, 'uncaughtException'));
  process.on('unhandledRejection', (err) => handler(err, 'unhandledRejection'));
  process.on('SIGINT', () => handler(null, 'SIGINT'));
  process.on('SIGQUIT', () => handler(null, 'SIGQUIT'));
  process.on('SIGTERM', () => handler(null, 'SIGTERM'));
}

export default class Logger {
  static LoggerProps = superstruct.struct(
    {
      prettyPrint: 'boolean?',
      name: 'string?',
      level: 'string?',
      base: 'object|null?',
      redact: 'object|array?',
      file: 'string?',
      browser: 'object?',
    },
    {
      prettyPrint: process.env.NODE_ENV === 'development',
      base: null,
      name: undefined,
      level: 'info',
      file: undefined,
      browser: undefined,
      redact: ['secret', 'username', 'password', 'email', 'phone'],
    }
  );

  static logger;

  static logLevel;

  /**
   * The Logger class
   * @public
   * @module @sa/logger
   * @class Logger
   * @namespace Logger
   * @type {Logger}
   *
   * Creates either a new logger instance or a child instance internally based on [Pino]{@link https://getpino.io}
   *
   * The first time you instantiate the Logger, it will create a new instance and every other call will instantiate a child logger.
   *
   * @param {object} [options] - Configuration options for the logger.
   * @param {object} [options.base=null] - An object with base properties that will be printed with every log line.
   * @param {string} [options.name=undefined] - The name of the logger. It is a good practice to give names for easier identification of modules for example.
   * @param {string} [options.level='info'] - The log level. One of 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'.
   * @param {string} [options.file=undefined] - The location of the log file. If not given, logs will be outputted to std out/err.
   * @param {boolean} [options.prettyPrint] - Whether to pretty print the logs or output json lines
   * @param {object|array} [options.redact] - The object props to redact from the output. As an array, the redact option specifies paths that should have their values redacted from any log output. Each path must be a string using a syntax which corresponds to JavaScript dot and bracket notation. If an object is supplied, three options can be specified: `paths`, `censor` and `remove`.
   * @param {array} options.redact.paths - Required. An array of paths.
   * @param {string|function|undefined} [options.redact.censor='[Redacted]'] - Censor option will overwrite keys which are to be redacted.
   * @param {boolean} [options.redact.remove=false] - Instead of censoring the value, remove both the key and the value.
   * @param {object} [options.browser=undefined] - Config for browsers only.
   * @param {function|object} [options.browser.write] - Instead of passing log messages to console.log they can be passed to a supplied function.
   * If write is an object, it can have methods that correspond to the levels. When a message is logged at a given level, the corresponding method is called. If a method isn't present, the logging falls back to using the console.
   *
   * @example
   *
   * import Logger from '@qfin/logger';
   *
   * // this creates a parent logger with name (my-app)
   * const logger = new Logger({ name: 'my-app', level: 'info' });
   *
   * logger.info('Hello world from my awesome app!');
   * logger.debug('This will not be printed');
   *
   * // --- somewhere else in the codebase
   *
   * import Logger from '@qfin/logger';
   *
   * // this creates a child logger with name (db) and it takes the log-level of the parent logger
   * const dbLogger = new Logger({ name: 'db' });
   *
   * dbLogger.info('Successfully connected to Database: ', `${db.host}:${db.port}/${db.name}`);
   *
   * // --- static logger usage
   *
   * import Logger from '@qfin/logger';
   *
   * // If logger is already initialized, then the parent logger reference will be used in this static call
   * // otherwise, a default parent logger will be initialized and then that will be used for logging
   * Logger.log('This is a static logger log');
   *
   */
  constructor(options = {}) {
    const props = Logger.LoggerProps(options);

    if (Logger.logger) {
      this.loggerInstance = Logger.logger.child({
        name: props.name,
        level: props.level,
      });
    } else {
      this.loggerInstance = Logger.instantiateLogger(options);
    }

    addFinalHandler(this.loggerInstance);
    this.logLevel = props.level;
  }

  static instantiateLogger(options = {}) {
    const props = Logger.LoggerProps(options);
    const lProps = {
      ...props,
      file: undefined,
      prettyPrint: props.prettyPrint,
    };

    if (props.prettyPrint) {
      lProps.timestamp = () => JSON.stringify({ time: new Date().toLocaleString() });
    }
    Logger.logger = pino(lProps, pino.destination(props.file));
    Logger.logLevel = props.level;

    Logger.logger[Logger.logLevel](`Logger is initialized with ${props.level} level`);
    return Logger.logger;
  }

  /**
   * Static Method
   *
   * Write a log with default or set level.
   *
   * If the logger has already been initialized then the log level will be referred from the initialized logger,
   * otherwise a new logger will be initialized and its default properties will be set and used.
   *
   * @static
   * @public
   *
   * @param {object} [arg0] - An object can optionally be supplied as the first parameter. Each enumerable key and value of the mergingObject is copied in to the JSON log line.
   *
   * @param {...any} [args]
   *
   * `args` are of type varargs and each of the args can take various forms as follows:
   *
   * - A message string can optionally be supplied as the first parameter, or as the second parameter after supplying a mergingObject.
   *   By default, the contents of the message parameter will be merged into the JSON log line under the msg key.
   *
   * - All arguments supplied after message are serialized and interpolated according to any supplied printf-style placeholders (%s, %d, %o|%O|%j) or else concatenated together with the message string to form the final output msg value for the JSON log line.
   *
   * @example
   *
   * logger.info({MIX: {IN: true}})
   * // {"level":30,"time":1531254555820,"MIX":{"IN":true},"v":1}
   *
   * logger.info('hello world')
   * // {"level":30,"time":1531257112193,"msg":"hello world","v":1}
   *
   * logger.info('hello', 'world')
   * // {"level":30,"time":1531257618044,"msg":"hello world","v":1}
   *
   * logger.info('hello', {worldly: 1})
   * // {"level":30,"time":1531257797727,"msg":"hello {\"worldly\":1}","v":1}
   *
   * logger.info('%o hello', {worldly: 1})
   * // {"level":30,"time":1531257826880,"msg":"{\"worldly\":1} hello","v":1}
   *
   */
  static log(arg0, ...args) {
    if (!Logger.logger) {
      Logger.instantiateLogger();
    }
    return Logger.logger[Logger.logLevel](arg0, ...args);
  }

  /**
   *  Write a log with default or set level. The level can be set in the constructor parameter
   *
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  log(arg0, ...args) {
    return this.loggerInstance[this.logLevel](arg0, ...args);
  }

  /**
   * Static Method
   *
   * Write a 'trace' level log, if the configured level allows for it.
   *
   * If the logger has already been initialized then the log level will be referred from the initialized logger,
   * otherwise a new logger will be initialized and its default properties will be set and used.
   *
   * @static
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  static trace(arg0, ...args) {
    if (!Logger.logger) {
      Logger.instantiateLogger();
    }
    return Logger.logger.trace(arg0, ...args);
  }

  /**
   * Write a 'trace' level log, if the configured level allows for it.
   *
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  trace(arg0, ...args) {
    return this.loggerInstance.trace(arg0, ...args);
  }

  /**
   * Static Method
   *
   * Write a 'debug' level log, if the configured level allows for it.
   *
   * If the logger has already been initialized then the log level will be referred from the initialized logger,
   * otherwise a new logger will be initialized and its default properties will be set and used.
   *
   * @static
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  static debug(arg0, ...args) {
    if (!Logger.logger) {
      Logger.instantiateLogger();
    }
    return Logger.logger.debug(arg0, ...args);
  }

  /**
   * Write a 'debug' level log, if the configured level allows for it.
   *
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  debug(arg0, ...args) {
    return this.loggerInstance.debug(arg0, ...args);
  }

  /**
   * Static Method
   *
   * Write a 'info' level log, if the configured level allows for it.
   *
   * If the logger has already been initialized then the log level will be referred from the initialized logger,
   * otherwise a new logger will be initialized and its default properties will be set and used.
   *
   * @static
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  static info(arg0, ...args) {
    if (!Logger.logger) {
      Logger.instantiateLogger();
    }
    return Logger.logger.info(arg0, ...args);
  }

  /**
   * Write a 'info' level log, if the configured level allows for it.
   *
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  info(arg0, ...args) {
    return this.loggerInstance.info(arg0, ...args);
  }

  /**
   * Static Method
   *
   * Write a 'warn' level log, if the configured level allows for it.
   *
   * If the logger has already been initialized then the log level will be referred from the initialized logger,
   * otherwise a new logger will be initialized and its default properties will be set and used.
   *
   * @static
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  static warn(arg0, ...args) {
    if (!Logger.logger) {
      Logger.instantiateLogger();
    }
    return Logger.logger.warn(arg0, ...args);
  }

  /**
   * Write a 'warn' level log, if the configured level allows for it.
   *
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  warn(arg0, ...args) {
    return this.loggerInstance.warn(arg0, ...args);
  }

  /**
   * Static Method
   *
   * Write a 'error' level log, if the configured level allows for it.
   *
   * If the logger has already been initialized then the log level will be referred from the initialized logger,
   * otherwise a new logger will be initialized and its default properties will be set and used.
   *
   * @static
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  static error(arg0, ...args) {
    if (!Logger.logger) {
      Logger.instantiateLogger();
    }
    return Logger.logger.error(arg0, ...args);
  }

  /**
   * Write a 'error' level log, if the configured level allows for it.
   *
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  error(arg0, ...args) {
    return this.loggerInstance.error(arg0, ...args);
  }

  /**
   * Static Method
   *
   * Write a 'fatal' level log, if the configured level allows for it.
   *
   * If the logger has already been initialized then the log level will be referred from the initialized logger,
   * otherwise a new logger will be initialized and its default properties will be set and used.
   *
   * @static
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  static fatal(arg0, ...args) {
    if (!Logger.logger) {
      Logger.instantiateLogger();
    }
    return Logger.logger.fatal(arg0, ...args);
  }

  /**
   * Write a 'fatal' level log, if the configured level allows for it.
   *
   * @public
   * @param {object} [arg0] - See [Logger's log method for more info]{@link Logger.log}.
   * @param {...any} [args] - See [Logger's log method for more info]{@link Logger.log}.
   */
  fatal(arg0, ...args) {
    return this.loggerInstance.fatal(arg0, ...args);
  }
}
