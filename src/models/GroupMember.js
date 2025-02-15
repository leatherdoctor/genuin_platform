const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./User');
const Group = require('./Group');

const GroupMember = sequelize.define('GroupMember', {
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: User, key: 'id' }, 
    primaryKey: true, // Composite primary key
  },
  groupId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Group, key: 'id' }, 
    primaryKey: true, // Composite primary key
  }
}, {
  timestamps: false,
  tableName: 'GroupMembers', // Explicit table name
});

module.exports = GroupMember;
