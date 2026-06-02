import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Safe absolute pathing for ES Modules
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';

dotenv.config();

// Standard way to get __dirname in ES Modules (Independent of execution directory)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const port = process.env.PORT || 5001;

app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Serve Frontend Static Files in Production
if (process.env.NODE_ENV === "production") {
 const frontendBuildPath = path.join(__dirname, "../../frontend/dist");
  
  app.use(express.static(frontendBuildPath));

  // CHANGED FROM "*" TO "/{*splat}" FOR EXPRESS v5 COMPATIBILITY
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  // Fallback root path ONLY for local development
  app.get('/', (req, res) => {
    res.send("Welcome to Chat API (Development Mode)");
  });
}

server.listen(port, () => {
    console.log("Server running at port", port);
    connectDB();
});