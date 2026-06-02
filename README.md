# MERN Chat App

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for real-time messaging.

## Features

- 🔐 **User Authentication** - Secure JWT-based authentication with bcryptjs password hashing
- 💬 **Real-time Messaging** - Socket.io powered real-time chat functionality
- 👥 **User Management** - Create accounts, manage profiles with image uploads
- 🖼️ **Image Upload** - Cloudinary integration for storing user avatars and media
- 🎨 **Responsive UI** - Beautiful and responsive interface built with React and Tailwind CSS
- 👁️ **Online Status** - See who is online in real-time
- 📱 **Cross-platform** - Works seamlessly on desktop and mobile devices
- 🚀 **Modern Stack** - Built with modern tooling (Vite, React 19, Zustand)

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Socket.io** - Real-time communication
- **JWT** - Cookie-based authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting
- **Mongoose** - MongoDB ODM
- **Nodemon** - Development auto-reload

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **DaisyUI** - UI component library
- **Zustand** - State management
- **Socket.io Client** - Real-time client
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas cloud database)
- Cloudinary account (for image uploads)

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/milan-2604/mern-chat-app.git
cd mern-chat-app
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your environment variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
PORT=5001
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5001
```

## Running the Application

### Development Mode

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Production Mode

```bash
# Build the application
npm run build

# Start the backend server (serves frontend static files)
npm start
```

In production, the backend serves the built frontend at port 5001.

## Project Structure

```
mern-chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   │   └── message.controller.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   └── message.route.js
│   │   ├── models/
│   │   │   └── user.model.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── lib/
│   │   │   ├── socket.js
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   └── utils.js
│   │   └── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── lib/
│   │   ├── constants/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
├── package.json
└── README.md
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register a new user
  - Body: `{ fullName, email, password }`
  - Response: User object with JWT cookie

- `POST /login` - Login user
  - Body: `{ email, password }`
  - Response: User object with JWT cookie

- `POST /logout` - Logout user
  - Response: Confirmation message

- `PUT /update-profile` - Update user profile picture (Protected)
  - Body: `{ profilePic }` (base64 image data)
  - Response: Updated user object

- `GET /check` - Check authentication status (Protected)
  - Response: Current user object

### Messages Routes (`/api/messages`)
- `GET /users` - Get all users for sidebar (Protected)
  - Response: Array of users

- `GET /:id` - Get messages with a specific user (Protected)
  - Params: `id` - User ID to fetch messages from
  - Response: Array of messages

- `POST /send/:id` - Send message to a user (Protected)
  - Params: `id` - Recipient user ID
  - Body: `{ text, image }`
  - Response: Message object

## Socket.io Events

### Client to Server
- `connection` - User connects with userId via query parameter

### Server to Client
- `getOnlineUsers` - List of online user IDs

## Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `CLOUDINARY_NAME` | Your Cloudinary cloud name | Required |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Required |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Required |
| `PORT` | Server port | 5001 |
| `NODE_ENV` | Environment mode | development |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

## Scripts

### Root Level
```bash
npm run build      # Install all dependencies and build frontend
npm start          # Start the backend server
```

### Backend
```bash
npm run dev        # Run backend with auto-reload (nodemon)
npm start          # Start backend server
```

### Frontend
```bash
npm run dev        # Start development server with HMR
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Key Features Explained

### Authentication
- User registration with email validation
- Password must be at least 6 characters
- JWT tokens stored in secure HTTP-only cookies
- Protected routes require valid JWT token

### Real-time Chat
- Socket.io for instant message delivery
- Online/offline user status tracking
- Users list shows all registered users
- Message history stored in MongoDB

### Image Upload
- Profile picture upload via Cloudinary
- Base64 image encoding in requests
- Secure URL storage in database

### User Roles
- All authenticated users can send messages
- Users can only view their own profile data

## Getting Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your `.env` file

## Getting MongoDB

### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Then start the service
mongod
```

### Option 2: MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env` as `MONGODB_URI`

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001 (Linux/Mac)
lsof -ti:5001 | xargs kill -9

# For Windows, use Task Manager or:
netstat -ano | findstr :5001
```

### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env`
- Ensure MongoDB service is running
- Check network access in MongoDB Atlas

### Socket.io Connection Issues
- Verify both frontend and backend are running
- Check CORS origin in `backend/src/lib/socket.js`
- Ensure frontend `VITE_API_URL` matches backend URL

### Cloudinary Upload Fails
- Verify API credentials in `.env`
- Check image format and size (limit: 5MB)
- Ensure account is active

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

If you encounter any issues:
1. Check the [GitHub Issues](https://github.com/milan-2604/mern-chat-app/issues)
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## Author

**Milan**
- GitHub: [@milan-2604](https://github.com/milan-2604)

---

**Happy Chatting!** 💬
