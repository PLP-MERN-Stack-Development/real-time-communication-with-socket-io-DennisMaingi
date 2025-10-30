import React from 'react';

export const TypingIndicator = ({ users }) => {
  if (users.length === 0) return null;

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">
        {users.length === 1 
          ? `${users[0].username} is typing...`
          : `${users.length} people are typing...`
        }
      </span>
    </div>
  );
};