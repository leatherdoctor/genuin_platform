const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRole } = require('../../src/middleware/authMiddleware');
const { 
  mockTokens, 
  mockDecodedTokens, 
  mockRequests, 
  mockResponse, 
  mockNext 
} = require('./authMiddleware.mock');

// Mock jwt verify function
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let res, next;

  beforeEach(() => {
    res = mockResponse();
    next = jest.fn();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    test('should pass with valid user token', () => {
      const req = { ...mockRequests.validUserRequest };
      jwt.verify.mockReturnValue(mockDecodedTokens.validUser);

      authenticateToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockTokens.validUserToken, expect.any(String));
      expect(req.user).toEqual(mockDecodedTokens.validUser);
      expect(next).toHaveBeenCalled();
    });

    test('should pass with valid admin token', () => {
      const req = { ...mockRequests.validAdminRequest };
      jwt.verify.mockReturnValue(mockDecodedTokens.validAdmin);

      authenticateToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockTokens.validAdminToken, expect.any(String));
      expect(req.user).toEqual(mockDecodedTokens.validAdmin);
      expect(next).toHaveBeenCalled();
    });

    test('should return 401 when no token provided', () => {
      const req = { ...mockRequests.noTokenRequest };

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Access denied. No token provided.' 
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 403 when token is invalid', () => {
      const req = { ...mockRequests.invalidTokenRequest };
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Invalid or expired token' 
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 403 when token payload is invalid', () => {
      const req = { ...mockRequests.validUserRequest };
      jwt.verify.mockReturnValue(mockDecodedTokens.invalidPayload);

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Invalid token payload' 
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorizeRole', () => {
    test('should allow access for user with correct role', () => {
      const req = {
        user: mockDecodedTokens.validAdmin
      };
      const middleware = authorizeRole(['admin']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should deny access for user with incorrect role', () => {
      const req = {
        user: mockDecodedTokens.validUser
      };
      const middleware = authorizeRole(['admin']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Forbidden. Insufficient permissions.' 
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should deny access when no user role is present', () => {
      const req = {};
      const middleware = authorizeRole(['admin', 'user']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        error: 'Forbidden. Insufficient permissions.' 
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should allow access for user with any allowed role', () => {
      const req = {
        user: mockDecodedTokens.validUser
      };
      const middleware = authorizeRole(['admin', 'user']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});