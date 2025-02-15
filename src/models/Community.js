const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Community = sequelize.define('Community', {
  name: { type: DataTypes.STRING, allowNull: false },
  thumbnail_url: { type: DataTypes.STRING },
});

module.exports = Community;