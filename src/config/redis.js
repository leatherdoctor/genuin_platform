const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

// Create a Redis client
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected successfully.');
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
  }
})();

module.exports = redisClient;