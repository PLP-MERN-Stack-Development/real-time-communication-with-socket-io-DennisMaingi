import { users, rooms } from '../config/database.js';

export const setupUserHandlers = (io, socket) => {
  // Get online users
  socket.on('get_online_users', (callback) => {
    const onlineUsers = Array.from(io.sockets.sockets.values())
      .filter(s => s.userId)
      .map(s => ({
        id: s.userId,
        username: s.username,
        isOnline: true
      }));
    callback(onlineUsers);
  });

  // Handle private messages
  socket.on('send_private_message', (data, callback) => {
    try {
      const { toUserId, text } = data;
      const recipientSocket = Array.from(io.sockets.sockets.values())
        .find(s => s.userId === toUserId);

      if (recipientSocket) {
        const privateMessage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          from: socket.userId,
          fromUsername: socket.username,
          to: toUserId,
          text,
          timestamp: new Date().toISOString(),
          read: false
        };

        // Emit to both sender and recipient
        socket.emit('new_private_message', privateMessage);
        recipientSocket.emit('new_private_message', privateMessage);
        
        callback({ success: true, message: privateMessage });
      } else {
        callback({ error: 'User is not online' });
      }
    } catch (error) {
      callback({ error: 'Failed to send private message' });
    }
  });

  // Handle user disconnection
  socket.on('disconnect', (reason) => {
    // Remove user from all rooms
    rooms.forEach(room => {
      if (room.users.has(socket.userId)) {
        room.users.delete(socket.userId);
        socket.to(room.id).emit('user_left_room', {
          userId: socket.userId,
          username: socket.username,
          roomId: room.id
        });
        
        // Update room users
        io.to(room.id).emit('room_users_update', {
          roomId: room.id,
          users: Array.from(room.users)
        });
      }
    });

    // Update online users
    const onlineUsers = Array.from(io.sockets.sockets.values())
      .filter(s => s.userId)
      .map(s => ({
        id: s.userId,
        username: s.username,
        isOnline: true
      }));
    
    io.emit('online_users_updated', onlineUsers);
  });
};