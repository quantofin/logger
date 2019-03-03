import Logger from '../logger';

describe('Logger module', () => {
  it('should initialize a Logger object', () => {
    expect(new Logger()).toBeInstanceOf(Logger);
  });

  it('should have a log object with logging methods', () => {
    const logger = new Logger();
    expect(logger.log).toBeDefined();
    expect(typeof logger.log).toEqual('function');
    expect(logger.fatal).toBeDefined();
    expect(typeof logger.fatal).toEqual('function');
    expect(logger.error).toBeDefined();
    expect(typeof logger.error).toEqual('function');
    expect(logger.warn).toBeDefined();
    expect(typeof logger.warn).toEqual('function');
    expect(logger.info).toBeDefined();
    expect(typeof logger.info).toEqual('function');
    expect(logger.debug).toBeDefined();
    expect(typeof logger.debug).toEqual('function');
    expect(logger.trace).toBeDefined();
    expect(typeof logger.trace).toEqual('function');
  });
});
