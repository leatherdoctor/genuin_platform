const { mockRedisClient, mockData, mockDbQueries } = require('./cacheService.mock');

// Mock the Redis client
jest.mock('../../src/config/redis', () => mockRedisClient);

const cacheService = require('../../src/services/cacheService');

describe('Cache Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getCachedData', () => {
    const testKey = 'test_key';
    const testTtl = 300;

    test('should return cached data if it exists', async () => {
      const cachedData = mockData.videos;
      mockRedisClient.get.mockResolvedValueOnce(JSON.stringify(cachedData));

      const result = await cacheService.getCachedData(testKey, mockDbQueries.getRecentVideos);

      expect(result).toEqual(cachedData);
      expect(mockRedisClient.get).toHaveBeenCalledWith(testKey);
      expect(mockDbQueries.getRecentVideos).not.toHaveBeenCalled();
    });

    test('should fetch and cache data if cache miss', async () => {
      mockRedisClient.get.mockResolvedValueOnce(null);
      const dbData = mockData.videos;
      const dbQuery = jest.fn().mockResolvedValueOnce(dbData);

      const result = await cacheService.getCachedData(testKey, dbQuery, testTtl);

      expect(result).toEqual(dbData);
      expect(mockRedisClient.get).toHaveBeenCalledWith(testKey);
      expect(dbQuery).toHaveBeenCalled();
      expect(mockRedisClient.setEx).toHaveBeenCalledWith(
        testKey,
        testTtl,
        JSON.stringify(dbData)
      );
    });

    test('should throw error if database query fails', async () => {
      mockRedisClient.get.mockResolvedValueOnce(null);

      await expect(
        cacheService.getCachedData(testKey, mockDbQueries.failingQuery)
      ).rejects.toThrow('Database error');
    });

    test('should throw error if no data found in database', async () => {
      mockRedisClient.get.mockResolvedValueOnce(null);
      const dbQuery = jest.fn().mockResolvedValueOnce(null);

      await expect(
        cacheService.getCachedData(testKey, dbQuery)
      ).rejects.toThrow('No data found in the database.');
    });
  });

  describe('Specific cache functions', () => {
    test('getRecentVideos should use correct cache key', async () => {
      await cacheService.getRecentVideos(mockDbQueries.getRecentVideos);
      expect(mockRedisClient.get).toHaveBeenCalledWith('recent_videos');
    });

    test('getRecentGroups should use correct cache key', async () => {
      await cacheService.getRecentGroups(mockDbQueries.getRecentGroups);
      expect(mockRedisClient.get).toHaveBeenCalledWith('recent_groups');
    });

    test('getTopVideosByViews should use correct cache key', async () => {
      await cacheService.getTopVideosByViews(mockDbQueries.getTopVideosByViews);
      expect(mockRedisClient.get).toHaveBeenCalledWith('top_videos:views');
    });

    test('getTopBrandsByViews should use correct cache key', async () => {
      await cacheService.getTopBrandsByViews(mockDbQueries.getTopBrandsByViews);
      expect(mockRedisClient.get).toHaveBeenCalledWith('top_brands:views');
    });
  });

  describe('clearCache', () => {
    test('should successfully clear cache for given key', async () => {
      const testKey = 'test_key';
      mockRedisClient.del.mockResolvedValueOnce(1);

      await cacheService.clearCache(testKey);

      expect(mockRedisClient.del).toHaveBeenCalledWith(testKey);
    });

    test('should handle errors when clearing cache', async () => {
      const testKey = 'test_key';
      mockRedisClient.del.mockRejectedValueOnce(new Error('Redis error'));

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error');

      await cacheService.clearCache(testKey);

      expect(consoleSpy).toHaveBeenCalledWith(
        '❌ Error clearing cache:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});