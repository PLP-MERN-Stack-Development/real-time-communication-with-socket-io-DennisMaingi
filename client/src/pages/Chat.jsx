import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { SocketProvider } from '../context/SocketContext.jsx';
import { RoomList } from '../components/RoomList.jsx';
import { MessageList } from '../components/MessageList.jsx';
import { MessageInput } from '../components/MessageInput.jsx';
import { TypingIndicator } from '../components/TypingIndicator.jsx';
import { useChat } from '../hooks/useChat.js';
import { useNotifications } from '../hooks/useNotifications.js';

const ChatContent = () => {
  const [currentRoom, setCurrentRoom] = useState('general');
  const { user, logout } = useAuth();
  const { 
    messages, 
    typingUsers, 
    sendMessage, 
    startTyping, 
    stopTyping, 
    addReaction 
  } = useChat(currentRoom);

  useNotifications(true);

  const handleRoomChange = (roomId) => {
    setCurrentRoom(roomId);
  };

  const handleRoomCreate = (room) => {
    console.log('Room created:', room);
  };

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Socket.io Chat</h2>
          <div className="user-info">
            <span>Hello, {user?.username}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
        
        <RoomList
          currentRoom={currentRoom}
          onRoomChange={handleRoomChange}
          onRoomCreate={handleRoomCreate}
        />
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h3># {currentRoom}</h3>
          <div className="chat-info">
            <TypingIndicator users={typingUsers} />
          </div>
        </div>

        <div className="chat-messages">
          <MessageList
            messages={messages}
            currentUser={user}
            onReaction={addReaction}
          />
        </div>

        <div className="chat-input">
          <MessageInput
            onSendMessage={sendMessage}
            onTypingStart={startTyping}
            onTypingStop={stopTyping}
          />
        </div>
      </div>
    </div>
  );
};

export const Chat = () => {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <div>Not authenticated</div>;
  }

  return (
    <SocketProvider token={token} user={user}>
      <ChatContent />
    </SocketProvider>
  );
};