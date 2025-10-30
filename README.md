 README.md
markdown
# Socket.io Real-Time Chat Application

A feature-rich real-time chat application built with React, Socket.io, and Node.js.

## Features

- 🔐 JWT Authentication
- 💬 Real-time messaging
- 🏠 Multiple chat rooms
- 👥 Online user status
- ⌨️ Typing indicators
- 🔔 Browser notifications
- 📱 Responsive design
- 💌 Private messaging
- 👍 Message reactions
- ✅ Read receipts

## Tech Stack

### Frontend
- React 18
- Socket.io-client
- Vite
- Context API + Hooks

### Backend
- Node.js + Express
- Socket.io
- JWT for authentication
- bcryptjs for password hashing

## Project Structure
socketio-chat/
├── client/ # React front-end
│ ├── public/ # Static files
│ ├── src/ # React source code
│ │ ├── components/ # UI components
│ │ ├── context/ # React context providers
│ │ ├── hooks/ # Custom React hooks
│ │ ├── pages/ # Page components
│ │ ├── socket/ # Socket.io client setup
│ │ └── App.jsx # Main application component
│ └── package.json # Client dependencies
├── server/ # Node.js back-end
│ ├── config/ # Configuration files
│ ├── controllers/ # Socket event handlers
│ ├── models/ # Data models
│ ├── socket/ # Socket.io server setup
│ ├── utils/ # Utility functions
│ ├── server.js # Main server file
│ └── package.json # Server dependencies
└── README.md # Project documentation

text

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd socketio-chat
Setup the server

bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
Setup the client

bash
cd ../client
npm install
cp .env.example .env
# Edit .env with your configuration
Start the development servers

bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
Open your browser
Navigate to http://localhost:3000

API Endpoints
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

Socket Events
Client to Server
send_message - Send a new message

join_room - Join a chat room

create_room - Create a new room

typing_start - Start typing indicator

typing_stop - Stop typing indicator

add_reaction - Add reaction to message

Server to Client
new_message - Receive new message

user_typing - User typing indicator

user_joined_room - User joined room

user_left_room - User left room

rooms_updated - Room list updated

Deployment
Server Deployment (Render/Railway)
Push your code to GitHub

Connect your repository to Render/Railway

Set environment variables

Deploy

Client Deployment (Vercel/Netlify)
Build the client: npm run build

Deploy the dist folder to your hosting service

Environment Variables
Server (.env)
env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
Client (.env)
env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Create a Pull Request