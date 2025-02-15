const { validateBrandId, validatePagination } = require('../../src/utils/validators');
const { mockValidInputs, mockInvalidInputs } = require('./validator.mock');

describe('Validators', () => {
  describe('validateBrandId', () => {
    test('should return number for valid brand_id', () => {
      const result = validateBrandId(mockValidInputs.validBrandId);
      expect(result).toBe(123);
      expect(typeof result).toBe('number');
    });

    test('should throw error for invalid brand_id', () => {
      expect(() => {
        validateBrandId(mockInvalidInputs.invalidBrandId);
      }).toThrow('Invalid brand_id');
    });

    test('should throw error for null brand_id', () => {
      expect(() => {
        validateBrandId(mockInvalidInputs.nullBrandId);
      }).toThrow('Invalid brand_id');
    });

    test('should throw error for undefined brand_id', () => {
      expect(() => {
        validateBrandId(mockInvalidInputs.undefinedBrandId);
      }).toThrow('Invalid brand_id');
    });
  });

  describe('validatePagination', () => {
    test('should return default values when no parameters provided', () => {
      const result = validatePagination();
      expect(result).toEqual({ page: 1, limit: 10 });
    });

    test('should return converted numbers for valid string inputs', () => {
      const result = validatePagination(mockValidInputs.validPage, mockValidInputs.validLimit);
      expect(result).toEqual({ page: 2, limit: 20 });
    });

    test('should throw error for invalid page number', () => {
      expect(() => {
        validatePagination(mockInvalidInputs.invalidPage);
      }).toThrow('Invalid page number');
    });

    test('should throw error for invalid limit value', () => {
      expect(() => {
        validatePagination('1', mockInvalidInputs.invalidLimit);
      }).toThrow('Invalid limit value');
    });

    test('should throw error for non-numeric page', () => {
      expect(() => {
        validatePagination(mockInvalidInputs.nonNumericPage);
      }).toThrow('Invalid page number');
    });

    test('should throw error for non-numeric limit', () => {
      expect(() => {
        validatePagination('1', mockInvalidInputs.nonNumericLimit);
      }).toThrow('Invalid limit value');
    });

    test('should accept numeric values', () => {
      const result = validatePagination(2, 20);
      expect(result).toEqual({ page: 2, limit: 20 });
    });

    test('should accept string numeric values', () => {
      const result = validatePagination('2', '20');
      expect(result).toEqual({ page: 2, limit: 20 });
    });
  });
});