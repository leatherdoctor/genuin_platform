const { User, Brand, Community, Group, Video, GroupMember } = require('../src/models'); // Adjust path if needed
const sequelize = require('../src/config/db.config'); // Import Sequelize instance
const bcrypt = require('bcrypt');

// Helper function to generate random strings
function getRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to generate random emails
function getRandomEmail() {
  return `${getRandomString(8)}@example.com`;
}

// Helper function to generate random phone numbers
function getRandomPhoneNumber() {
  return `+1-${getRandomInt(100, 999)}-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`;
}

// Helper function to generate random integers within a range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async () => {
  try {
    console.log('🚀 Starting data seeding...');
    
    // Sync database before seeding (force: true drops existing tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database synced.');

    const hashedPassword = await bcrypt.hash('password123', 10);
    // Create explicit admin and user accounts
    const adminUser = await User.create({
      username: 'adminUser',
      email: 'admin@example.com',
      password: hashedPassword, // Use "password" instead of "password_hash"
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Created Admin User:', adminUser.username);

    const regularUser = await User.create({
      username: 'regularUser',
      email: 'user@example.com',
      password: hashedPassword, // Use "password" instead of "password_hash"
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Created Regular User:', regularUser.username);

    // Create Users (200 records)
    const users = [];
    for (let i = 0; i < 200; i++) {
      users.push({
        username: `user${i + 1}_${Date.now()}`, // Append timestamp for uniqueness
        email: getRandomEmail(),
        phone_number: getRandomPhoneNumber(),
        password: `hash${i + 1}`, // Use "password" instead of "password_hash"
        age: getRandomInt(18, 60),
        gender: ['Male', 'Female', 'Other'][getRandomInt(0, 2)],
        country: ['USA', 'India', 'UK', 'Canada'][getRandomInt(0, 3)],
        profile_picture_url: `http://profile-picture-${i + 1}.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    const createdUsers = await User.bulkCreate(users, { returning: true });
    console.log('✅ Created 200 Users');

    // Create Brands (20 records)
    const brands = [];
    for (let i = 0; i < 20; i++) {
      brands.push({
        name: `Brand ${i + 1}`,
        username: `brand_user_${i + 1}`, // Add username for brands
        website_url: `http://brand-${i + 1}.com`,
        primary_color: `#${getRandomString(6)}`,
        secondary_color: `#${getRandomString(6)}`,
        thumbnail_url: `http://thumbnail-brand-${i + 1}.com`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    const createdBrands = await Brand.bulkCreate(brands, { returning: true });
    console.log('✅ Created 20 Brands');

    // Create Communities (50 records)
    const communities = [];
    for (let i = 0; i < 50; i++) {
      communities.push({
        brandId: createdBrands[getRandomInt(0, 19)].id,
        name: `Community ${i + 1}`,
        thumbnail_url: `http://thumbnail-community-${i + 1}.com`,
        profile_picture_url: `http://community-profile-${i + 1}.com`, // Add profile picture URL
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    const createdCommunities = await Community.bulkCreate(communities, { returning: true });
    console.log('✅ Created 50 Communities');

    // Create Groups (100 records)
    const groups = [];
    for (let i = 0; i < 100; i++) {
      groups.push({
        communityId: createdCommunities[getRandomInt(0, 49)].id,
        name: `Group ${i + 1}`,
        video_count: getRandomInt(0, 50),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    const createdGroups = await Group.bulkCreate(groups, { returning: true });
    console.log('✅ Created 100 Groups');

    // Add Group Members (400 records, ensuring unique pairs)
    const groupMembersSet = new Set();
    while (groupMembersSet.size < 400) {
      const userId = createdUsers[getRandomInt(0, 199)].id;
      const groupId = createdGroups[getRandomInt(0, 99)].id;
      groupMembersSet.add(`${userId}-${groupId}`);
    }
    const groupMembers = [...groupMembersSet].map(pair => {
      const [userId, groupId] = pair.split('-').map(Number);
      return { userId, groupId, createdAt: new Date(), updatedAt: new Date() };
    });
    await GroupMember.bulkCreate(groupMembers);
    console.log('✅ Added 400 Unique Group Members');

    // Create Videos (100 records)
    const videos = [];
    for (let i = 0; i < 100; i++) {
      const groupId = createdGroups[getRandomInt(0, 99)].id; // Random group ID
      videos.push({
        groupId: groupId,
        userId: createdUsers[getRandomInt(0, 199)].id, // Random user ID
        title: `Video ${i + 1}`,
        views: getRandomInt(0, 1000),
        comments: getRandomInt(0, 500),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await Video.bulkCreate(videos);
    console.log('✅ Created 100 Videos');

    console.log('🎉 Seed data added successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await sequelize.close(); // Close the database connection
    console.log('🔌 Database connection closed.');
  }
})();