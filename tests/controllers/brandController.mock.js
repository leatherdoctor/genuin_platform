const { getCachedData } = require('../../src/services/cacheService');

// Mock brand data
const mockBrands = {
  singleBrand: {
    id: 1,
    name: 'Test Brand',
    websiteUrl: 'https://testbrand.com',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    thumbnailUrl: 'https://example.com/thumbnail.jpg'
  },
  brandsList: [
    {
      id: 1,
      name: 'Test Brand 1',
      total_views: 1000
    },
    {
      id: 2,
      name: 'Test Brand 2',
      total_views: 2000
    }
  ]
};

// Mock video data
const mockVideos = {
  brandVideos: [
    {
      id: 1,
      title: 'Test Video 1',
      views: 500,
      brandId: 1
    },
    {
      id: 2,
      title: 'Test Video 2',
      views: 1000,
      brandId: 1
    }
  ]
};

// Mock database responses
const mockDb = {
  Brand: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Video: {
    findAll: jest.fn()
  }
};

// Mock request objects
const mockRequests = {
  validBrandId: {
    params: { brand_id: '1', id: '1' },
    query: {}
  },
  invalidBrandId: {
    params: { brand_id: 'invalid' },
    query: {}
  },
  createBrand: {
    body: {
      name: 'New Brand',
      websiteUrl: 'https://newbrand.com',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      thumbnailUrl: 'https://example.com/new.jpg'
    }
  },
  updateBrand: {
    params: { id: '1' },
    body: {
      name: 'Updated Brand',
      websiteUrl: 'https://updated.com',
      primaryColor: '#111111',
      secondaryColor: '#222222',
      thumbnailUrl: 'https://example.com/updated.jpg'
    }
  },
  invalidCreate: {
    body: {
      name: 'Invalid Brand'
      // Missing required fields
    }
  }
};

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock axios
const mockAxiosResponse = {
  data: mockBrands.brandsList
};

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue(mockAxiosResponse)
}));

// Mock cache service
jest.mock('../../src/services/cacheService', () => ({
  getCachedData: jest.fn()
}));

module.exports = {
  mockBrands,
  mockVideos,
  mockDb,
  mockRequests,
  mockResponse,
  getCachedData
};