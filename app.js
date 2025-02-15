const express = require('express');
require('dotenv').config();
const videoRoutes = require('./src/routes/video'); // Import video routes
const redisClient = require('./src/config/redis'); // Initialize Redis
const brandRoutes = require('./src/routes/brand');
const communityRoutes = require('./src/routes/community');
const groupRoutes = require('./src/routes/group');
const groupMemberRoutes = require('./src/routes/groupMember');
const authRoutes = require('./src/routes/auth'); // Import auth routes
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');


const app = express();

// Middleware
app.use(express.json());


// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Register routes
app.use('/auth', authRoutes); // Register auth routes
app.use('/videos', videoRoutes); 
app.use('/brands', brandRoutes);
app.use('/communities', communityRoutes);
app.use('/groups', groupRoutes);
app.use('/group-members', groupMemberRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Add this to handle requests to "/"
app.get('/', (req, res) => {
  res.send('Welcome to the Genuin Platform API 🚀');
});
