import { useState, useEffect, useRef } from 'react';
import { useSocket, useSocketEvent } from './useSocket.js';

export const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { emit, isConnected } = useSocket();
  const typingTimeoutRef = useRef();

  // Load previous messages
  useEffect(() => {
    if (isConnected && roomId) {
      emit('get_previous_messages', roomId, (previousMessages) => {
        setMessages(previousMessages);
      });
    }
  }, [isConnected, roomId, emit]);

  // Listen for new messages
  useSocketEvent('new_message', (message) => {
    if (message.roomId === roomId) {
      setMessages(prev => [...prev, message]);
    }
  });

  // Listen for typing indicators
  useSocketEvent('user_typing', (data) => {
    if (data.isTyping) {
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.userId !== data.userId);
        return [...filtered, { userId: data.userId, username: data.username }];
      });
    } else {
      setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
    }
  });

  // Listen for message updates (reactions, etc.)
  useSocketEvent('message_updated', (updatedMessage) => {
    if (updatedMessage.roomId === roomId) {
      setMessages(prev => prev.map(msg => 
        msg.id === updatedMessage.id ? updatedMessage : msg
      ));
    }
  });

  // Send message
  const sendMessage = (text) => {
    if (text.trim() && isConnected) {
      emit('send_message', { text, roomId }, (response) => {
        if (response.error) {
          console.error('Failed to send message:', response.error);
        }
      });
    }
  };

  // Typing indicators
  const startTyping = () => {
    emit('typing_start', roomId);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    clearTimeout(typingTimeoutRef.current);
    emit('typing_stop', roomId);
  };

  // Add reaction to message
  const addReaction = (messageId, reaction) => {
    emit('add_reaction', { messageId, reaction, roomId }, (response) => {
      if (response.error) {
        console.error('Failed to add reaction:', response.error);
      }
    });
  };

  return {
    messages,
    typingUsers,
    onlineUsers,
    sendMessage,
    startTyping,
    stopTyping,
    addReaction,
    isConnected
  };
};