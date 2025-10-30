import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { setupSocketIO } from './socket/setup.js';
import { setupAuthRoutes } from './controllers/authController.js';
import { PORT, CORS_ORIGIN } from './config/constants.js';
import { users } from './config/database.js';

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    users: users.size
  });
});

// Setup authentication routes
setupAuthRoutes(app);

// Setup Socket.IO
setupSocketIO(server);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${CORS_ORIGIN}`);
});