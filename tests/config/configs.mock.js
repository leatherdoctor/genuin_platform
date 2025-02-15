// Mock environment variables
const mockEnv = {
    SECRET_KEY: 'test_secret_key',
    DB_HOST: 'localhost',
    DB_USER: 'test_user',
    DB_PASSWORD: 'test_password',
    DB_NAME: 'test_db',
    DB_DIALECT: 'mysql',
    REDIS_HOST: 'localhost',
    REDIS_PORT: '6379'
  };
  
  // Mock Sequelize
  const mockSequelize = {
    authenticate: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true)
  };
  
  const mockSequelizeConstructor = () => mockSequelize;
  
  // Mock Redis client
  const mockRedisClient = {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn((event, callback) => {
      if (event === 'error' && callback) {
        callback(new Error('Redis Mock Error'));
      }
    }),
    quit: jest.fn().mockResolvedValue(undefined),
    isOpen: jest.fn().mockReturnValue(true)
  };
  
  const mockRedisCreateClient = () => mockRedisClient;
  
  // Add console mock to capture logs
  const mockConsole = {
    log: jest.fn(),
    error: jest.fn()
  };
  
  global.console = { ...console, ...mockConsole };
  
  module.exports = {
    mockEnv,
    mockSequelize,
    mockSequelizeConstructor,
    mockRedisClient,
    mockRedisCreateClient,
    mockConsole
  };