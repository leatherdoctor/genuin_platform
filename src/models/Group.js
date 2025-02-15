const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Group = sequelize.define('Group', {
  name: { type: DataTypes.STRING, allowNull: false },
  video_count: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Group;