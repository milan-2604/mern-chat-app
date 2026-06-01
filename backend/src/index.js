import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
app.get('/', (req, res) => {
    res.send("Welcome to Chat API");
});
app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.listen(port, () => {
    console.log("Server running at port", port);
    connectDB();
});