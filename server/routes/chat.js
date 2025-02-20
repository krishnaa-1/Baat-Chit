const express = require("express");
const router = express.Router();

// Import Models
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

router.get("/chatroom/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch chat rooms where the user is a member
        const chatRooms = await ChatRoom.find({ members: userId }).populate({
            path: "members",
            select: "username email image", // Fields to fetch from the User model
        }).populate({
            path: "lastMessage",
            select: "message messageType", // Fields to fetch from the Message model
        });        

        // Check if chat rooms exist
        if (!chatRooms || chatRooms.length === 0) {
            return res.status(404).json({ error: "No chat rooms found for the given user ID." });
        }

        // Filter members to exclude the current user ID
        const result = chatRooms.map(chatRoom => {

            const otherMembers = chatRoom.members.filter(member => {
                return member._id.toString() !== userId; // Exclude current user
            });

            return {
                ...chatRoom._doc,
                members: otherMembers,
            };
        });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching chat rooms." });
    }
});

router.get("/chatroom/messages/:id", async (req, res) => {
    try {
        const chatRoomId = req.params.id; // Extract chat room ID from request params

        // Find all messages associated with the chatRoomId
        const messages = await Message.find({ chatRoom: chatRoomId })
            .sort({ createdAt: 1 }).populate({
                path: "sender",
                select: "username email image", // Fields to fetch from the User model
            });

        // Respond with the messages
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch messages", error: error.message });
    }
});


module.exports = router;
