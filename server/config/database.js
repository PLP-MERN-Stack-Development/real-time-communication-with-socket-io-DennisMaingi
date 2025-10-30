// In-memory storage for development
// Replace with actual database in production

export const users = new Map();
export const rooms = new Map();
export const privateMessages = new Map();

// Initialize default room
rooms.set('general', {
  id: 'general',
  name: 'General',
  messages: [],
  users: new Set(),
  createdAt: new Date()
});