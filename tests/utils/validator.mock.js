// Mock validation inputs
const mockValidInputs = {
    validBrandId: '123',
    validPage: '2',
    validLimit: '20'
  };
  
  const mockInvalidInputs = {
    invalidBrandId: 'abc',
    nullBrandId: null,
    undefinedBrandId: undefined,
    invalidPage: '0',
    invalidLimit: '-5',
    nonNumericPage: 'abc',
    nonNumericLimit: 'xyz'
  };
  
  module.exports = {
    mockValidInputs,
    mockInvalidInputs
  };