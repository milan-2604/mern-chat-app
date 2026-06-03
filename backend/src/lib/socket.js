import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import Message from '../models/message.model.js'; // Import needed to handle the DB update inside socket

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

// 1. Move the data map to the top so functions can cleanly read from it
const userSocketMap = {}; //{userId: socketId}

// 2. Export helper function below the initialization block
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }

    // Broadcast updated active user keys map back to clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle real-time blue ticks calculations when users are active in the same room
    socket.on("markAsSeen", async ({ senderId, receiverId }) => {
        try {
            // Update the database state quietly
            const result = await Message.updateMany(
                { senderId, receiverId, status: "sent" },
                { $set: { status: "seen" } }
            );

            // Find the sender's active socket connection 
            const senderSocketId = getReceiverSocketId(senderId);
            
            if (senderSocketId) {
                // Broadcast to the original sender that their text message status is now seen!
                io.to(senderSocketId).emit("messagesSeen", {
                    senderId,   // The person who originally sent the text
                    receiverId  // The person who just read it live (you)
                });
            }
        } catch (error) {
            console.log("Error in markAsSeen socket handler:", error);
        }
    }); 

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app };