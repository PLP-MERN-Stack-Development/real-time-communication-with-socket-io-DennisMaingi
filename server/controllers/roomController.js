import { rooms } from '../config/database.js';
import { validateRoomName } from '../utils/helpers.js';

export const setupRoomHandlers = (io, socket) => {
  // Get all rooms
  socket.on('get_rooms', (callback) => {
    const roomList = Array.from(rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.users.size,
      createdAt: room.createdAt
    }));
    callback(roomList);
  });

  // Join room
  socket.on('join_room', (roomId, callback) => {
    try {
      // Leave all other rooms except personal room
      socket.rooms.forEach(room => {
        if (room !== socket.id && room !== socket.userId) {
          socket.leave(room);
          // Remove user from room tracking
          const oldRoom = rooms.get(room);
          if (oldRoom) {
            oldRoom.users.delete(socket.userId);
            io.to(room).emit('user_left_room', {
              userId: socket.userId,
              username: socket.username,
              roomId: room
            });
          }
        }
      });

      // Create room if it doesn't exist
      if (!rooms.has(roomId)) {
        if (!validateRoomName(roomId)) {
          return callback({ error: 'Invalid room name' });
        }
        
        rooms.set(roomId, {
          id: roomId,
          name: roomId,
          messages: [],
          users: new Set(),
          createdAt: new Date()
        });
      }

      const room = rooms.get(roomId);
      room.users.add(socket.userId);
      socket.join(roomId);

      // Notify room about new user
      socket.to(roomId).emit('user_joined_room', {
        userId: socket.userId,
        username: socket.username,
        roomId
      });

      // Send room users to everyone in the room
      io.to(roomId).emit('room_users_update', {
        roomId,
        users: Array.from(room.users)
      });

      // Update room list for all users
      io.emit('rooms_updated', Array.from(rooms.values()).map(r => ({
        id: r.id,
        name: r.name,
        userCount: r.users.size
      })));

      callback({ success: true, room: room });
    } catch (error) {
      console.error('Error joining room:', error);
      callback({ error: 'Failed to join room' });
    }
  });

  // Create new room
  socket.on('create_room', (roomName, callback) => {
    try {
      if (!validateRoomName(roomName)) {
        return callback({ error: 'Room name can only contain letters, numbers, hyphens, and underscores' });
      }

      if (rooms.has(roomName)) {
        return callback({ error: 'Room already exists' });
      }

      const room = {
        id: roomName,
        name: roomName,
        messages: [],
        users: new Set(),
        createdAt: new Date()
      };

      rooms.set(roomName, room);
      
      io.emit('rooms_updated', Array.from(rooms.values()).map(r => ({
        id: r.id,
        name: r.name,
        userCount: r.users.size
      })));

      callback({ success: true, room });
    } catch (error) {
      callback({ error: 'Failed to create room' });
    }
  });
};