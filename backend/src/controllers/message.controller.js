import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        
        // 1. Fetch all users except the logged-in user
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        // 2. For each user, calculate the unread message count from the database
        const usersWithUnreadCounts = await Promise.all(
            users.map(async (user) => {
                const unreadCount = await Message.countDocuments({
                    senderId: user._id,
                    receiverId: loggedInUserId,
                    status: "sent"
                });

                // Convert mongoose document to plain JS object so we can append properties
                const userObj = user.toObject();
                userObj.unreadCount = unreadCount; 
                
                return userObj;
            })
        );

        return res.status(200).json(usersWithUnreadCounts);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        // 1. Update any messages sent by the partner to ME as "seen" in MongoDB
        const result = await Message.updateMany(
            {
                senderId: userToChatId,
                receiverId: myId,
                status: "sent"
            },
            {
                $set: { status: "seen" }
            }
        );

        // 2. NEW real-time socket emit: If messages were actually updated, tell the sender!
        if (result.modifiedCount > 0) {
            const senderSocketId = getReceiverSocketId(userToChatId);
            if (senderSocketId) {
                // Emit 'messagesSeen' to the person who originally sent the messages
                io.to(senderSocketId).emit("messagesSeen", {
                    senderId: userToChatId, // The person who sent them
                    receiverId: myId       // You (the person who just saw them)
                });
            }
        }

        // 3. Fetch the entire synchronized chat history log
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            status: "sent" // explicitly defaulting to sent
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sendMessage controller', error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const myId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId.toString() !== myId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this message" });
        }

        message.text = "";
        message.image = "";
        message.isDeleted = true;
        await message.save();

        const receiverSocketId = getReceiverSocketId(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", message);
        }

        return res.status(200).json(message);
    } catch (error) {
        console.log("Error in deleteMessage controller", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const editMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Text content cannot be empty" });
        }

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized to edit this message" });
        }

        if (message.isDeleted) {
            return res.status(400).json({ message: "Cannot edit a deleted message" });
        }

        message.text = text;
        message.isEdited = true;
        await message.save();

        const receiverSocketId = getReceiverSocketId(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageEdited", message);
        }

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in editMessage controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};