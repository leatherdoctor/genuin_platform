const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authController = require('../../src/controllers/authController');
const { mockUsers, mockDb, mockRequests, mockResponse } = require('./authController.mock');

// Mock bcrypt and jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let res;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('signup', () => {
    test('should successfully create a new user', async () => {
      const req = mockRequests.validSignup;
      mockDb.User.findOne.mockResolvedValue(null);
      mockDb.User.create.mockResolvedValue(mockUsers.newUser);
      bcrypt.hash.mockResolvedValue('hashedPassword123');

      await authController.signup(req, res);

      expect(mockDb.User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email }
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(mockDb.User.create).toHaveBeenCalledWith({
        username: req.body.username,
        email: req.body.email,
        password: 'hashedPassword123'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully'
      });
    });

    test('should return error if user already exists', async () => {
      const req = mockRequests.duplicateSignup;
      mockDb.User.findOne.mockResolvedValue(mockUsers.validUser);

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User already exists'
      });
    });

    test('should handle database errors during signup', async () => {
      const req = mockRequests.validSignup;
      mockDb.User.findOne.mockRejectedValue(new Error('Database error'));

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error'
      });
    });

    test('should handle password hashing errors', async () => {
      const req = mockRequests.validSignup;
      mockDb.User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error'
      });
    });
  });

  describe('login', () => {
    test('should successfully login user with valid credentials', async () => {
      const req = mockRequests.validLogin;
      mockDb.User.findOne.mockResolvedValue(mockUsers.validUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken123');

      await authController.login(req, res);

      expect(mockDb.User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        mockUsers.validUser.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUsers.validUser.id, role: mockUsers.validUser.role },
        expect.any(String),
        { expiresIn: '1h' }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: 'mockToken123'
      });
    });

    test('should return error for non-existent user', async () => {
      const req = mockRequests.invalidLogin;
      mockDb.User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User not found'
      });
    });

    test('should return error for invalid password', async () => {
      const req = mockRequests.validLogin;
      mockDb.User.findOne.mockResolvedValue(mockUsers.validUser);
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid credentials'
      });
    });

    test('should handle database errors during login', async () => {
      const req = mockRequests.validLogin;
      mockDb.User.findOne.mockRejectedValue(new Error('Database error'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error'
      });
    });

    test('should handle password comparison errors', async () => {
      const req = mockRequests.validLogin;
      mockDb.User.findOne.mockResolvedValue(mockUsers.validUser);
      bcrypt.compare.mockRejectedValue(new Error('Comparison error'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error'
      });
    });
  });
});