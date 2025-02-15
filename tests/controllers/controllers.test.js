const { mockUser, mockDb } = require('./controller.mock');
const authController = require('../../src/controllers/authController');

// Mock the response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }
    };
    res = mockResponse();
  });

  test('signup - should create new user successfully', async () => {
    mockDb.User.findOne.mockResolvedValue(null);
    mockDb.User.create.mockResolvedValue(mockUser);

    await authController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
  });

  test('login - should return token for valid credentials', async () => {
    mockDb.User.findOne.mockResolvedValue(mockUser);

    await authController.login(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String)
    }));
  });
});