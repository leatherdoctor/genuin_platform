// Mock Redis client
const mockRedisClient = {
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn()
  };
  
  // Mock data
  const mockData = {
    videos: [
      { id: 1, title: 'Test Video 1', views: 100 },
      { id: 2, title: 'Test Video 2', views: 200 }
    ],
    groups: [
      { id: 1, name: 'Test Group 1' },
      { id: 2, name: 'Test Group 2' }
    ],
    brands: [
      { id: 1, name: 'Test Brand 1', totalViews: 1000 },
      { id: 2, name: 'Test Brand 2', totalViews: 2000 }
    ]
  };
  
  // Mock database query functions
  const mockDbQueries = {
    getRecentVideos: jest.fn().mockResolvedValue(mockData.videos),
    getRecentGroups: jest.fn().mockResolvedValue(mockData.groups),
    getTopVideosByViews: jest.fn().mockResolvedValue(mockData.videos),
    getTopBrandsByViews: jest.fn().mockResolvedValue(mockData.brands),
    failingQuery: jest.fn().mockRejectedValue(new Error('Database error'))
  };
  
  module.exports = {
    mockRedisClient,
    mockData,
    mockDbQueries
  };