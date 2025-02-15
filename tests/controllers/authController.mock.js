const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock user data
const mockUsers = {
  validUser: {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'user'
  },
  newUser: {
    username: 'newuser',
    email: 'new@example.com',
    password: 'password123'
  }
};

// Mock database responses
const mockDb = {
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  }
};

// Mock request objects
const mockRequests = {
  validSignup: {
    body: {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123'
    }
  },
  duplicateSignup: {
    body: {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }
  },
  validLogin: {
    body: {
      email: 'test@example.com',
      password: 'password123'
    }
  },
  invalidLogin: {
    body: {
      email: 'wrong@example.com',
      password: 'wrongpassword'
    }
  },
  invalidRequest: {
    body: {}
  }
};

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

module.exports = {
  mockUsers,
  mockDb,
  mockRequests,
  mockResponse
};