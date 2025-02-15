// Validate brand_id query parameter
// Validate brand_id parameter
exports.validateBrandId = (brand_id) => {
    if (!brand_id || isNaN(Number(brand_id))) {
      throw new Error('Invalid brand_id');
    }
    return Number(brand_id); // Convert to a number
  };
  
  // Validate pagination parameters
exports.validatePagination = (page = 1, limit = 10) => {
    page = Number(page);
    limit = Number(limit);
  
    if (isNaN(page) || page < 1) {
      throw new Error('Invalid page number');
    }
    if (isNaN(limit) || limit < 1) {
      throw new Error('Invalid limit value');
    }
  
    return { page, limit };
  };