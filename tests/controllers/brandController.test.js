const axios = require('axios');
const brandController = require('../../src/controllers/brandController');
const { 
  mockBrands, 
  mockVideos, 
  mockDb, 
  mockRequests, 
  mockResponse,
  getCachedData 
} = require('./brandController.mock');

describe('Brand Controller', () => {
  let res;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('getTopBrandsByViews', () => {
    test('should return cached brands successfully', async () => {
      getCachedData.mockResolvedValue(mockBrands.brandsList);

      await brandController.getTopBrandsByViews(mockRequests.validBrandId, res);

      expect(getCachedData).toHaveBeenCalledWith('top_brands:views', expect.any(Function));
      expect(res.json).toHaveBeenCalledWith(mockBrands.brandsList);
    });

    test('should handle errors when fetching brands', async () => {
      getCachedData.mockRejectedValue(new Error('Cache error'));

      await brandController.getTopBrandsByViews(mockRequests.validBrandId, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('getTopVideosForBrand', () => {
    test('should return videos for valid brand', async () => {
      const req = mockRequests.validBrandId;
      axios.get.mockResolvedValue({ data: mockBrands.brandsList });

      await brandController.getTopVideosForBrand(req, res);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/brands/videos/top');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    test('should handle brand not found', async () => {
      const req = { params: { brand_id: '999' } };
      axios.get.mockResolvedValue({ data: mockBrands.brandsList });

      await brandController.getTopVideosForBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Brand not found in top brands' });
    });

    test('should handle invalid brand_id', async () => {
      const req = mockRequests.invalidBrandId;

      await brandController.getTopVideosForBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllBrands', () => {
    test('should return all brands successfully', async () => {
      mockDb.Brand.findAll.mockResolvedValue(mockBrands.brandsList);

      await brandController.getAllBrands(mockRequests.validBrandId, res);

      expect(mockDb.Brand.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockBrands.brandsList);
    });

    test('should handle database errors', async () => {
      mockDb.Brand.findAll.mockRejectedValue(new Error('Database error'));

      await brandController.getAllBrands(mockRequests.validBrandId, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('createBrand', () => {
    test('should create brand successfully', async () => {
      const req = mockRequests.createBrand;
      mockDb.Brand.create.mockResolvedValue(mockBrands.singleBrand);

      await brandController.createBrand(req, res);

      expect(mockDb.Brand.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBrands.singleBrand);
    });

    test('should handle missing required fields', async () => {
      const req = mockRequests.invalidCreate;

      await brandController.createBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });

    test('should handle database errors', async () => {
      const req = mockRequests.createBrand;
      mockDb.Brand.create.mockRejectedValue(new Error('Database error'));

      await brandController.createBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('updateBrand', () => {
    test('should update brand successfully', async () => {
      const req = mockRequests.updateBrand;
      mockDb.Brand.findByPk.mockResolvedValue({
        ...mockBrands.singleBrand,
        update: mockDb.Brand.update
      });

      await brandController.updateBrand(req, res);

      expect(mockDb.Brand.findByPk).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalled();
    });

    test('should handle brand not found', async () => {
      const req = mockRequests.updateBrand;
      mockDb.Brand.findByPk.mockResolvedValue(null);

      await brandController.updateBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Brand not found' });
    });

    test('should handle database errors', async () => {
      const req = mockRequests.updateBrand;
      mockDb.Brand.findByPk.mockRejectedValue(new Error('Database error'));

      await brandController.updateBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('deleteBrand', () => {
    test('should delete brand successfully', async () => {
      const req = mockRequests.validBrandId;
      mockDb.Brand.findByPk.mockResolvedValue({
        ...mockBrands.singleBrand,
        destroy: mockDb.Brand.destroy
      });

      await brandController.deleteBrand(req, res);

      expect(mockDb.Brand.findByPk).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({ message: 'Brand deleted successfully' });
    });

    test('should handle brand not found', async () => {
      const req = mockRequests.validBrandId;
      mockDb.Brand.findByPk.mockResolvedValue(null);

      await brandController.deleteBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Brand not found' });
    });

    test('should handle database errors', async () => {
      const req = mockRequests.validBrandId;
      mockDb.Brand.findByPk.mockRejectedValue(new Error('Database error'));

      await brandController.deleteBrand(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});