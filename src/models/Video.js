const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Video = sequelize.define('Video', {
  title: { type: DataTypes.STRING, allowNull: false },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  comments: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Video;