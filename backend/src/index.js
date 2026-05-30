import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
app.get('/', (req, res) => {
    res.send("Welcome to Chat API");
});
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/message',messageRoutes);

app.listen(port,()=>{
    console.log("Server running at port",port);
    connectDB();
})