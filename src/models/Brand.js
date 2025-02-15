const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Brand = sequelize.define('Brand', {
  name: { type: DataTypes.STRING, allowNull: false },
  website_url: { type: DataTypes.STRING },
  primary_color: { type: DataTypes.STRING },
  secondary_color: { type: DataTypes.STRING },
  thumbnail_url: { type: DataTypes.STRING },
});

module.exports = Brand;