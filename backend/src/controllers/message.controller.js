import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async (req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        return res.status(200).json(filteredUsers);
    } catch (error) {
       console.log("Error in getUsersForSidebar controller",error.message);
       return res.status(500).json({message: "Internal server error"});

    }
}

export const getMessages = async (req,res)=>{
    try {
       const {id:userToChatId} = req.params;
       const myId = req.user._id;
       const messages = await Message.find({
        $or:[
        {senderId:myId, receiverId: userToChatId},
        {senderId: userToChatId, receiverId: myId}
       ]});
       return res.status(200).json(messages);
    } catch (error) {
       console.log("Error in getMessages controller",error.message);
       return res.status(500).json({message: "Internal server error"});
    }
}

export const sendMessage = async (req,res)=>{
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        console.log('Error in sendMessage controller',error.message);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const myId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Security check: Make sure the logged-in user is the sender
        if (message.senderId.toString() !== myId.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this message" });
        }

        // Clear content and flip the flag
        message.text = "";
        message.image = "";
        message.isDeleted = true;
        await message.save();

        // Real-time notification to the receiver
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
    const userId = req.user._id; // Extracted from your auth middleware

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Text content cannot be empty" });
    }

    // 1. Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // 2. Authorization Security Check: Ensure sender owns this message
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit this message" });
    }

    // 3. Prevent editing if the message was already soft-deleted
    if (message.isDeleted) {
      return res.status(400).json({ message: "Cannot edit a deleted message" });
    }

    // 4. Update fields
    message.text = text;
    message.isEdited = true;
    await message.save();

    // 5. Real-time Socket Broadcast (Step 2)
    // Get the active socket ID of the receiver to emit the update dynamically
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