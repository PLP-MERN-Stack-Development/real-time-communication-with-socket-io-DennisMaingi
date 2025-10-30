import React, { useEffect, useRef } from 'react';

export const MessageList = ({ messages, currentUser, onReaction }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleReaction = (messageId, reaction) => {
    onReaction(messageId, reaction);
  };

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.userId === currentUser?.id ? 'own-message' : ''}`}
        >
          <div className="message-header">
            <span className="message-username">{message.username}</span>
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
          <div className="message-text">{message.text}</div>
          
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="message-reactions">
              {Object.entries(message.reactions).map(([reaction, users]) => (
                <button
                  key={reaction}
                  className="reaction-btn"
                  onClick={() => handleReaction(message.id, reaction)}
                  title={`${users.length} user(s) reacted with ${reaction}`}
                >
                  {reaction} {users.length}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};