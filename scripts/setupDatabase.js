const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with MySQL connection (connect to the default `mysql` database)
const sequelize = new Sequelize('mysql', 'root', 'root', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

// Function to check if the database exists and create it if not
async function ensureDatabaseExists() {
  try {
    // Query to check if the database exists
    const [results] = await sequelize.query(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'genuin_platform';"
    );
    if (results.length === 0) {
      // Database does not exist, so create it
      await sequelize.query("CREATE DATABASE genuin_platform;");
      console.log('Database "genuin_platform" created successfully.');
    } else {
      console.log('Database "genuin_platform" already exists.');
    }
  } catch (error) {
    console.error('Error ensuring database exists:', error);
  }
}

// Reinitialize Sequelize with the target database after ensuring it exists
async function initializeDatabase() {
  try {
    // Ensure the database exists
    await ensureDatabaseExists();

    // Reinitialize Sequelize with the target database
    const db = new Sequelize('genuin_platform', 'root', 'root', {
      host: '127.0.0.1',
      dialect: 'mysql',
      logging: false, // Disable logging for cleaner output
    });

    // Define Models
    const User = db.define('User', {
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      age: { type: DataTypes.INTEGER },
      gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
      country: { type: DataTypes.STRING },
      profile_picture_url: { type: DataTypes.STRING },
    });

    const Brand = db.define('Brand', {
      name: { type: DataTypes.STRING, allowNull: false },
      website_url: { type: DataTypes.STRING },
      primary_color: { type: DataTypes.STRING },
      secondary_color: { type: DataTypes.STRING },
      thumbnail_url: { type: DataTypes.STRING },
    });

    const Community = db.define('Community', {
      name: { type: DataTypes.STRING, allowNull: false },
      thumbnail_url: { type: DataTypes.STRING },
    });

    const Group = db.define('Group', {
      name: { type: DataTypes.STRING, allowNull: false },
      video_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    });

    const Video = db.define('Video', {
      title: { type: DataTypes.STRING, allowNull: false },
      views: { type: DataTypes.INTEGER, defaultValue: 0 },
      comments: { type: DataTypes.INTEGER, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    const GroupMember = db.define('GroupMember', {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      groupId: { type: DataTypes.INTEGER, allowNull: false },
    }, {
      timestamps: false, // Disable timestamps if not needed
    });

  // Define Relationships
Brand.hasMany(Community);
Community.belongsTo(Brand);

Community.hasMany(Group);
Group.belongsTo(Community);

Group.hasMany(Video);
Video.belongsTo(Group);

User.hasMany(Video);
Video.belongsTo(User);

// Many-to-Many relationship between User and Group
User.belongsToMany(Group, { through: 'GroupMembers', foreignKey: 'userId' });
Group.belongsToMany(User, { through: 'GroupMembers', foreignKey: 'groupId' });

    // Sync Database
    await db.sync({ force: true }); // Use { force: true } to drop existing tables
    console.log('Database and tables created successfully!');
  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
}

// Run the initialization process
initializeDatabase();