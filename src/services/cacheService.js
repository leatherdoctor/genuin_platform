const redisClient = require('../config/redis');

// Function to get data from cache or fetch from database
exports.getCachedData = async (cacheKey, dbQueryFn, ttl = 300) => {
  try {
    // Check if data exists in Redis cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`✅ Data retrieved from Redis cache: ${cacheKey}`);
      return JSON.parse(cachedData);
    }

    // Fetch data from the database
    const dbData = await dbQueryFn();
    if (!dbData) {
      throw new Error('No data found in the database.');
    }

    // Store fetched data in Redis cache
    await redisClient.setEx(cacheKey, ttl, JSON.stringify(dbData));
    console.log(`✅ Data fetched from database and cached: ${cacheKey}`);

    return dbData;
  } catch (error) {
    console.error('❌ Error in getCachedData:', error);
    throw error;
  }
};

// Function to cache recent videos
exports.getRecentVideos = async (dbQueryFn) => {
  const cacheKey = 'recent_videos';
  return exports.getCachedData(cacheKey, dbQueryFn);
};

// Function to cache recent groups
exports.getRecentGroups = async (dbQueryFn) => {
  const cacheKey = 'recent_groups';
  return exports.getCachedData(cacheKey, dbQueryFn);
};

// Function to cache top videos by views
exports.getTopVideosByViews = async (dbQueryFn) => {
  const cacheKey = 'top_videos:views';
  return exports.getCachedData(cacheKey, dbQueryFn);
};

// Function to cache top brands with most video views
exports.getTopBrandsByViews = async (dbQueryFn) => {
  const cacheKey = 'top_brands:views';
  return exports.getCachedData(cacheKey, dbQueryFn);
};

// Function to manually clear cache keys if needed
exports.clearCache = async (cacheKey) => {
  try {
    await redisClient.del(cacheKey);
    console.log(`🗑️ Cache cleared: ${cacheKey}`);
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};
