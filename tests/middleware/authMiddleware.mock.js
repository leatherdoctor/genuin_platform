const jwt = require('jsonwebtoken');

// Mock tokens
const mockTokens = {
  validUserToken: 'valid.user.token',
  validAdminToken: 'valid.admin.token',
  invalidToken: 'invalid.token',
  malformedToken: 'malformed'
};

// Mock decoded tokens
const mockDecodedTokens = {
  validUser: {
    userId: 1,
    role: 'user'
  },
  validAdmin: {
    userId: 2,
    role: 'admin'
  },
  invalidPayload: {
    someOtherData: 'test'
  }
};

// Mock requests
const mockRequests = {
  validUserRequest: {
    headers: {
      authorization: `Bearer ${mockTokens.validUserToken}`
    }
  },
  validAdminRequest: {
    headers: {
      authorization: `Bearer ${mockTokens.validAdminToken}`
    }
  },
  noTokenRequest: {
    headers: {}
  },
  invalidTokenRequest: {
    headers: {
      authorization: `Bearer ${mockTokens.invalidToken}`
    }
  },
  malformedTokenRequest: {
    headers: {
      authorization: `Bearer ${mockTokens.malformedToken}`
    }
  }
};

// Mock responses
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = jest.fn();

module.exports = {
  mockTokens,
  mockDecodedTokens,
  mockRequests,
  mockResponse,
  mockNext
};