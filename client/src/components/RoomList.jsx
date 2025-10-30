import React, { useState, useEffect } from 'react';
import { useSocket, useSocketEvent } from '../hooks/useSocket.js';

export const RoomList = ({ currentRoom, onRoomChange, onRoomCreate }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const { emit, isConnected } = useSocket();

  useEffect(() => {
    if (isConnected) {
      emit('get_rooms', (roomList) => {
        setRooms(roomList);
      });
    }
  }, [isConnected, emit]);

  useSocketEvent('rooms_updated', (updatedRooms) => {
    setRooms(updatedRooms);
  });

  const handleJoinRoom = (roomId) => {
    emit('join_room', roomId, (response) => {
      if (response.success) {
        onRoomChange(roomId);
      } else {
        console.error('Failed to join room:', response.error);
      }
    });
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      emit('create_room', newRoomName.trim(), (response) => {
        if (response.success) {
          setNewRoomName('');
          onRoomCreate(response.room);
          onRoomChange(response.room.id);
        } else {
          alert(response.error);
        }
      });
    }
  };

  return (
    <div className="room-list">
      <h3>Chat Rooms</h3>
      
      <form onSubmit={handleCreateRoom} className="create-room-form">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="New room name"
          maxLength={20}
          pattern="[a-zA-Z0-9-_]+"
          title="Room name can only contain letters, numbers, hyphens, and underscores"
        />
        <button type="submit" disabled={!newRoomName.trim()}>
          Create
        </button>
      </form>

      <div className="rooms">
        {rooms.map(room => (
          <div
            key={room.id}
            className={`room-item ${room.id === currentRoom ? 'active' : ''}`}
            onClick={() => handleJoinRoom(room.id)}
          >
            <span className="room-name"># {room.name}</span>
            <span className="room-users">{room.userCount} online</span>
          </div>
        ))}
      </div>
    </div>
  );
};