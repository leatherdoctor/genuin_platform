const sequelize = require('../config/db.config');
const User = require('./User');
const Brand = require('./Brand');
const Community = require('./Community');
const Group = require('./Group');
const Video = require('./Video');
const GroupMember = require('./GroupMember');

// Relationships

// 1. Brand → Community (One-to-Many)
// A Brand can have many Communities, and each Community belongs to one Brand.
Brand.hasMany(Community, { foreignKey: 'brandId', as: 'communities' });
Community.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

// 2. Community → Group (One-to-Many)
// A Community can have many Groups, and each Group belongs to one Community.
Community.hasMany(Group, { foreignKey: 'communityId', as: 'groups' });
Group.belongsTo(Community, { foreignKey: 'communityId', as: 'community' });

// 3. Group → Video (One-to-Many)
// A Group can have many Videos, and each Video belongs to one Group.
Group.hasMany(Video, { foreignKey: 'groupId', as: 'videos' });
Video.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

// 4. User → Video (One-to-Many)
// A User can create many Videos, and each Video is created by one User.
User.hasMany(Video, { foreignKey: 'userId', as: 'videos' });
Video.belongsTo(User, { foreignKey: 'userId', as: 'creator' });


// 5. User ↔ Group (Many-to-Many via GroupMember)
// A User can belong to many Groups, and a Group can have many Users.
// The relationship is managed through the GroupMember join table.
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId', as: 'groups' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId', as: 'members' });

Brand.hasMany(Video, { foreignKey: 'brandId', as: 'videos' });
Video.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

// Explicitly associate GroupMember with User and Group
GroupMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
GroupMember.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

module.exports = {
  User,
  Brand,
  Community,
  Group,
  Video,
  GroupMember,
};