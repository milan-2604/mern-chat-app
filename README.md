# MERN Chat App

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for real-time messaging with advanced features like message editing, deletion, and unread message notifications.

🔗 **[Live Demo](https://mern-chat-app-xfvy.onrender.com)**

## ✨ Features

### Core Chat Features
- 🔐 **User Authentication** - Secure JWT-based authentication with bcryptjs password hashing
- 💬 **Real-time Messaging** - Socket.io powered instant message delivery
- 👥 **User Management** - Create accounts, manage profiles with image uploads
- 🖼️ **Image Upload** - Cloudinary integration for user avatars and media in messages
- 📝 **Message Edit** - Edit sent messages in real-time (marks as edited)
- 🗑️ **Message Delete** - Delete messages with soft-delete (preserves message history structure)
- 📬 **Unread Notifications** - Unread message counter with toast notifications
- 👁️ **Online Status** - See who is online in real-time with visual indicators
- 🔔 **Smart Notifications** - Custom notification toasts with sender profile when new messages arrive

### UI & UX
- 🎨 **Responsive UI** - Beautiful and responsive interface built with React and Tailwind CSS
- 🌙 **Theme Support** - Dark/light theme switching
- 📱 **Cross-platform** - Works seamlessly on desktop and mobile devices
- ⚡ **Modern Stack** - Built with modern tooling (Vite, React 19, Zustand)
- 🔄 **Smooth Loading States** - Skeleton loaders for better UX during data fetching

## 🏗️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework (v5 with new routing)
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - Real-time bi-directional communication
- **JWT** - Secure cookie-based authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting and management
- **Nodemon** - Development auto-reload
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **DaisyUI** - Beautiful UI component library
- **Zustand** - Lightweight state management
- **Socket.io Client** - Real-time client communication
- **Axios** - Promise-based HTTP client
- **React Router v7** - Client-side routing
- **React Hot Toast** - Toast notifications
- **Lucide React** - Modern icon library
- **React DOM 19** - Latest React DOM features

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher, v18+ recommended)
- npm or yarn
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud database)
- Cloudinary account (for image uploads)
- Git

## 🚀 Installation

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
CLOUDINARY_NAME=your_cloudinary_cloud_name
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

## ▶️ Running the Application

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

## 📁 Project Structure

```
mern-chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js          # Authentication logic
│   │   │   └── message.controller.js       # Message CRUD & real-time ops
│   │   ├── routes/
│   │   │   ├── auth.route.js               # Auth endpoints
│   │   │   └── message.route.js            # Message endpoints
│   │   ├── models/
│   │   │   ├── user.model.js               # User schema
│   │   │   └── message.model.js            # Message schema (with edit/delete flags)
│   │   ├── middleware/
│   │   │   └── auth.middleware.js          # JWT verification
│   │   ├── lib/
│   │   │   ├── socket.js                   # Socket.io configuration
│   │   │   ├── cloudinary.js               # Image upload setup
│   │   │   ├── db.js                       # MongoDB connection
│   │   │   └── utils.js                    # Helper functions
│   │   └── index.js                        # Server entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatContainer.jsx           # Main chat display
│   │   │   ├── ChatHeader.jsx              # Chat header with online status
│   │   │   ├── MessageInput.jsx            # Message composer with image upload
│   │   │   ├── Navbar.jsx                  # Navigation bar
│   │   │   ├── Sidebar.jsx                 # User list with unread badges
│   │   │   ├── NoChatSelected.jsx          # Empty state
│   │   │   ├── NotificationToast.jsx       # Custom notification component
│   │   │   └── skeletons/                  # Loading skeleton components
│   │   ├── pages/
│   │   │   ├── HomePage.jsx                # Main chat interface
│   │   │   ├── LoginPage.jsx               # Login form
│   │   │   ├── SignupPage.jsx              # Registration form
│   │   │   ├── ProfilePage.jsx             # User profile with avatar upload
│   │   │   └── SettingsPage.jsx            # Theme & settings
│   │   ├── store/
│   │   │   ├── useAuthStore.js             # Auth state + socket connection
│   │   │   ├── useChatStore.js             # Chat state with unread tracking
│   │   │   └── useThemeStore.js            # Theme preference
│   │   ├── lib/
│   │   │   └── axios.js                    # Axios instance configuration
│   │   ├── App.jsx                         # Main app component with routing
│   │   ├── main.jsx                        # Entry point
│   │   └── index.css                       # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register New User
```bash
POST /signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
Response: User object with JWT cookie

#### Login
```bash
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
Response: User object with JWT cookie

#### Logout
```bash
POST /logout
```
Response: Confirmation message

#### Update Profile Picture (Protected)
```bash
PUT /update-profile
Content-Type: application/json
Authorization: JWT Cookie

{
  "profilePic": "data:image/jpeg;base64,..."
}
```
Response: Updated user object

#### Check Authentication Status (Protected)
```bash
GET /check
```
Response: Current user object if authenticated

### Messages Routes (`/api/messages`)

#### Get All Users for Sidebar (Protected)
```bash
GET /users
```
Response: Array of all users (excluding current user)

#### Get Messages with User (Protected)
```bash
GET /:userId
```
Response: Array of messages between current user and specified user

#### Send Message (Protected)
```bash
POST /send/:userId
Content-Type: application/json

{
  "text": "Hello!",
  "image": "data:image/jpeg;base64,..." (optional)
}
```
Response: New message object

#### Delete Message (Protected) ⭐ NEW
```bash
DELETE /delete/:messageId
```
Response: Updated message object (marked as deleted)

#### Edit Message (Protected) ⭐ NEW
```bash
PUT /edit/:messageId
Content-Type: application/json

{
  "text": "Updated message content"
}
```
Response: Updated message object (marked as edited)

## 🔌 Socket.io Events

### Client to Server
- `connection` - User connects with userId via query parameter

### Server to Client
- `getOnlineUsers` - List of online user IDs
- `newMessage` - New message received
- `messageDeleted` - Message was deleted by sender ⭐ NEW
- `messageEdited` - Message was edited by sender ⭐ NEW

## 🔑 Environment Variables

### Backend (.env)
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | - | ✅ |
| `JWT_SECRET` | Secret key for JWT signing | - | ✅ |
| `CLOUDINARY_NAME` | Your Cloudinary cloud name | - | ✅ |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | - | ✅ |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | - | ✅ |
| `PORT` | Server port | 5001 | ❌ |
| `NODE_ENV` | Environment mode | development | ❌ |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | ✅ |

## 📝 Scripts

### Root Level
```bash
npm run build      # Install dependencies and build frontend
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
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

## 🎯 Key Features Explained

### Authentication System
- User registration with email validation
- Password must be at least 6 characters
- JWT tokens stored in secure HTTP-only cookies
- Protected routes require valid JWT token
- Session persistence across page refreshes

### Real-time Chat
- Socket.io for instant message delivery
- Online/offline user status tracking
- Users list shows all registered users with online badges
- Message history stored in MongoDB
- Auto-scroll to latest message

### Message Management ⭐ NEW
- **Edit Messages**: Update message content after sending (marked with "edited" flag)
- **Delete Messages**: Remove messages with soft-delete (preserves message history integrity)
- **Real-time Sync**: All edits and deletions are instantly synchronized across connected clients
- **Authorization Checks**: Only message sender can edit/delete their own messages

### Unread Message Tracking ⭐ NEW
- Unread message counter per user
- Badge display in sidebar
- Counter resets when opening conversation
- Toast notifications for background messages
- Custom notification component with sender profile

### Image Upload
- Profile picture upload via Cloudinary
- Message image attachment support
- Base64 image encoding in requests
- Secure URL storage in database
- Maximum file size: 5MB

### Theme System
- Light/dark theme toggle
- Theme preference persistence
- DaisyUI theme integration

### User Profiles
- Profile picture upload
- User profile page with full details
- Profile update functionality
- Online status indicator

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: JWT stored in secure, non-accessible cookies
- **Authorization Checks**: Backend validates user ownership before allowing edits/deletions
- **CORS Protection**: Configured CORS for specific origins
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Detailed error messages without exposing sensitive data

## 🎨 Getting Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy the following:
   - **Cloud Name** - Displayed in the dashboard
   - **API Key** - In Account Settings > API Keys
   - **API Secret** - In Account Settings > API Keys
4. Add these to your `.env` file

## 🗄️ Getting MongoDB

### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Visit: https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod
```

### Option 2: MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Get connection string from "Connect" button
5. Add to `.env` as `MONGODB_URI`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001 (Linux/Mac)
lsof -ti:5001 | xargs kill -9

# For Windows, use Task Manager or:
netstat -ano | findstr :5001
```

### MongoDB Connection Error
- Verify `MONGODB_URI` format in `.env`
- Ensure MongoDB service is running
- Check network access in MongoDB Atlas (whitelist your IP)
- Try test connection in MongoDB Compass

### Socket.io Connection Issues
- Verify both frontend and backend are running
- Check CORS origin in `backend/src/lib/socket.js` (should match frontend URL)
- Ensure frontend `VITE_API_URL` matches backend URL
- Check browser console for connection errors

### Cloudinary Upload Fails
- Verify API credentials in `.env`
- Check image format and size (limit: 5MB)
- Ensure Cloudinary account is active
- Check upload preset if configured

### Messages Not Syncing
- Ensure Socket.io connection is active in browser DevTools
- Check that user IDs are being passed correctly
- Verify backend is listening to socket events
- Clear browser cache and reconnect

### CORS Errors
- Update CORS origin in `backend/src/index.js` to match your frontend URL
- In production, ensure environment variable points to correct frontend

## 📚 Project Highlights

### Advanced Message Features
- Soft-delete mechanism preserves message history
- Edit tracking with timestamps
- Real-time synchronization across all connected clients
- Unread message notifications with toast alerts

### State Management with Zustand
- Lightweight global state for auth, chat, and theme
- Socket integration within store
- Efficient re-renders
- DevTools support

### Modern React Patterns
- Functional components with hooks
- Context-like state management with Zustand
- React Router v7 for navigation
- Error boundaries and error handling

### Production Ready
- Express v5 compatibility
- ES Modules support in backend
- Static file serving in production
- Environment-based configuration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate error handling.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the [GitHub Issues](https://github.com/milan-2604/mern-chat-app/issues)
2. Review this troubleshooting section
3. Create a new issue with:
   - Detailed description of the problem
   - Error messages and stack traces
   - Steps to reproduce
   - Your environment (Node version, OS, browser)

## 👤 Author

**Milan**
- GitHub: [@milan-2604](https://github.com/milan-2604)
- Repository: [mern-chat-app](https://github.com/milan-2604/mern-chat-app)

## 🙏 Acknowledgments

- [MERN Stack](https://www.mongodb.com/languages/mern-stack) for the architecture
- [Socket.io](https://socket.io) for real-time communication
- [Tailwind CSS](https://tailwindcss.com) for beautiful styling
- [DaisyUI](https://daisyui.com) for UI components
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Cloudinary](https://cloudinary.com) for image hosting

---

**Happy Chatting!** 💬✨

Last updated: June 3, 2026
