import { Server } from 'socket.io';
import { CORS_ORIGIN } from '../config/constants.js';
import { authenticateSocket } from './middleware.js';
import { setupChatHandlers } from '../controllers/chatController.js';
import { setupRoomHandlers } from '../controllers/roomController.js';
import { setupUserHandlers } from '../controllers/userController.js';

export const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: CORS_ORIGIN,
      methods: ['GET', 'POST']
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      skipMiddlewares: true
    }
  });

  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User ${socket.username} connected`);

    // Setup event handlers
    setupChatHandlers(io, socket);
    setupRoomHandlers(io, socket);
    setupUserHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.username} disconnected: ${reason}`);
    });

    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.username}:`, error);
    });
  });

  return io;
};