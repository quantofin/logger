const Logger = require('../dist/main');

// Instance logger

const logger = new Logger({ name: 'my-app', level: 'info' });

logger.info('Hello world from my awesome app!');
logger.debug('This will not be printed');

// Static logger

Logger.log('Hello Static World!... Previously initialized parent logger reference will be used for static logging');
Logger.debug('Yooo, this will also not be printed');

// Child logger

const log = new Logger({ name: 'abc', level: 'debug' });

log.info('Hello instance world');
log.debug('Yooo again... now this will be printed');
log.info('hello', { worldly: 1 });

const db = {
  host: 'localhost',
  port: 27017,
  dbName: 'dbname',
};

// Yet another child logger

const dbLogger = new Logger({ name: 'db' });

dbLogger.info(db, 'Successfully connected to Database: ', `mongodb://${db.host}:${db.port}/${db.dbName}`);
