const { Sequelize } = require('sequelize');
const redis = require('redis');
const dotenv = require('dotenv');

const {
  mockEnv,
  mockSequelize,
  mockRedisClient,
  mockConsole
} = require('./configs.mock');

// Mock modules
jest.mock('sequelize', () => ({
  Sequelize: jest.fn().mockImplementation(() => mockSequelize)
}));

jest.mock('redis', () => ({
  createClient: jest.fn().mockImplementation(() => mockRedisClient)
}));

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Mock process.env
const originalEnv = process.env;
const originalConsole = global.console;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...mockEnv };
  global.console = { ...console, ...mockConsole };
});

afterEach(() => {
  process.env = originalEnv;
  global.console = originalConsole;
  jest.clearAllMocks();
});

describe('Configuration Files Tests', () => {
  describe('env.config.js', () => {
    let envConfig;

    beforeEach(() => {
      envConfig = require('../../src/config/env.config');
    });

    it('should load environment variables correctly', () => {
      expect(dotenv.config).toHaveBeenCalled();
      Object.keys(mockEnv).forEach(key => {
        expect(envConfig[key]).toBe(mockEnv[key]);
      });
    });

    it('should handle missing environment variables', () => {
      process.env = {};
      envConfig = require('../../src/config/env.config');
      Object.keys(mockEnv).forEach(key => {
        expect(envConfig[key]).toBeUndefined();
      });
    });
  });

  describe('db.config.js', () => {
    let dbConfig;

    beforeEach(() => {
      dbConfig = require('../../src/config/db.config');
    });

    it('should create Sequelize instance with correct configuration', () => {
      expect(Sequelize).toHaveBeenCalledWith(
        mockEnv.DB_NAME,
        mockEnv.DB_USER,
        mockEnv.DB_PASSWORD,
        {
          host: mockEnv.DB_HOST,
          dialect: mockEnv.DB_DIALECT,
          logging: false,
        }
      );
    });

    it('should export the sequelize instance', () => {
      expect(dbConfig).toBe(mockSequelize);
    });

    it('should handle authentication', async () => {
      await expect(dbConfig.authenticate()).resolves.toBeTruthy();
    });
  });

  describe('redis.js', () => {
    let redisConfig;

    beforeEach(async () => {
      jest.isolateModules(() => {
        redisConfig = require('../../src/config/redis');
      });
    });

    it('should create Redis client with correct configuration', () => {
      expect(redis.createClient).toHaveBeenCalledWith({
        socket: {
          host: mockEnv.REDIS_HOST,
          port: mockEnv.REDIS_PORT,
        }
      });
    });

    it('should set up error handler', () => {
      expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
      // Trigger error handler
      mockRedisClient.on('error', console.error);
      expect(mockConsole.error).toHaveBeenCalledWith('Redis Client Error:', expect.any(Error));
    });

    it('should attempt to connect to Redis', () => {
      expect(mockRedisClient.connect).toHaveBeenCalled();
      expect(mockConsole.log).toHaveBeenCalledWith('✅ Redis connected successfully.');
    });

    it('should handle connection failure', async () => {
      mockRedisClient.connect.mockRejectedValueOnce(new Error('Connection failed'));
      jest.isolateModules(() => {
        redisConfig = require('../../src/config/redis');
      });
      expect(mockConsole.error).toHaveBeenCalledWith('❌ Failed to connect to Redis:', expect.any(Error));
    });

    it('should export the redis client', () => {
      expect(redisConfig).toBe(mockRedisClient);
    });
  });
});