import { rooms, privateMessages } from '../config/database.js';
import { formatMessage } from '../utils/helpers.js';
import { Message } from '../models/message.js';

export const setupChatHandlers = (io, socket) => {
  // Send previous messages when joining a room
  socket.on('get_previous_messages', (roomId, callback) => {
    const room = rooms.get(roomId);
    if (room) {
      const messages = room.messages.slice(-100).map(msg => msg.toJSON());
      callback(messages);
    } else {
      callback([]);
    }
  });

  // Handle new message
  socket.on('send_message', (data, callback) => {
    try {
      const { text, roomId = 'general' } = data;
      const room = rooms.get(roomId);
      
      if (!room) {
        return callback({ error: 'Room not found' });
      }

      const message = new Message(
        Date.now().toString() + Math.random().toString(36).substr(2, 9),
        socket.username,
        text,
        roomId,
        socket.userId
      );

      room.messages.push(message);
      
      // Emit to room
      io.to(roomId).emit('new_message', message.toJSON());

      // Handle mentions
      handleMentions(io, message);
      
      callback({ success: true, message: message.toJSON() });
    } catch (error) {
      console.error('Error sending message:', error);
      callback({ error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (roomId) => {
    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      username: socket.username,
      isTyping: true
    });
  });

  socket.on('typing_stop', (roomId) => {
    socket.to(roomId).emit('user_typing', {
      userId: socket.userId,
      username: socket.username,
      isTyping: false
    });
  });

  // Handle message reactions
  socket.on('add_reaction', (data, callback) => {
    try {
      const { messageId, reaction, roomId } = data;
      const room = rooms.get(roomId);
      
      if (room) {
        const message = room.messages.find(msg => msg.id === messageId);
        if (message) {
          message.addReaction(reaction, socket.userId);
          io.to(roomId).emit('message_updated', message.toJSON());
          callback({ success: true });
        } else {
          callback({ error: 'Message not found' });
        }
      } else {
        callback({ error: 'Room not found' });
      }
    } catch (error) {
      callback({ error: 'Failed to add reaction' });
    }
  });
};

const handleMentions = (io, message) => {
  const mentionRegex = /@(\w+)/g;
  const mentions = message.text.match(mentionRegex);
  
  if (mentions) {
    mentions.forEach(mention => {
      const username = mention.slice(1);
      io.emit('user_mentioned', {
        username,
        mentionedBy: message.username,
        message: message.text,
        roomId: message.roomId
      });
    });
  }
};