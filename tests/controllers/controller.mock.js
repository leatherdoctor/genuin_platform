// Mock data for testing
const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: '$2b$10$somehashedpassword',
    role: 'user'
  };
  
  const mockBrand = {
    id: 1,
    name: 'Test Brand',
    websiteUrl: 'https://testbrand.com',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    thumbnailUrl: 'https://example.com/thumbnail.jpg'
  };
  
  const mockCommunity = {
    id: 1,
    name: 'Test Community',
    brandId: 1
  };
  
  const mockGroup = {
    id: 1,
    name: 'Test Group',
    communityId: 1
  };
  
  const mockVideo = {
    id: 1,
    title: 'Test Video',
    description: 'Test Description',
    groupId: 1,
    userId: 1,
    views: 100,
    comments: 10
  };
  
  // Mock functions for database operations
  const mockDb = {
    User: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn()
    },
    Brand: {
      findAll: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn()
    },
    Community: {
      findAll: jest.fn(),
      findByPk: jest.fn()
    },
    Group: {
      findAll: jest.fn(),
      findByPk: jest.fn()
    },
    Video: {
      findAll: jest.fn(),
      create: jest.fn()
    },
    CommunityMember: {
      findOne: jest.fn(),
      create: jest.fn(),
      bulkCreate: jest.fn()
    },
    GroupMember: {
      findOne: jest.fn(),
      create: jest.fn(),
      bulkCreate: jest.fn()
    }
  };
  
  // Mock JWT and bcrypt
  jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mock-token'),
    verify: jest.fn()
  }));
  
  jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(true)
  }));
  
  // Mock axios
  jest.mock('axios', () => ({
    get: jest.fn()
  }));
  
  // Mock cache service
  jest.mock('../../src/services/cacheService', () => ({
    getCachedData: jest.fn((key, fn) => fn())
  }));
  
  module.exports = {
    mockUser,
    mockBrand,
    mockCommunity,
    mockGroup,
    mockVideo,
    mockDb
  };