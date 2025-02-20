require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const chatRoomRoutes = require("./routes/chat");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Import Models
const ChatRoom = require("./models/ChatRoom");
const Message = require("./models/Message");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Replace with your frontend's origin in production
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// Middleware
app.use(bodyParser.json());
console.log(process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoomRoutes);

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Event: Join Chat
  socket.on("join chat", async ({ senderId, recipientId }) => {
    try {
      let chatRoom = await ChatRoom.findOne({
        members: { $all: [senderId, recipientId] },
      });

      if (!chatRoom) {
        // If no chatroom exists, create a new one
        chatRoom = new ChatRoom({
          members: [senderId, recipientId],
        });
        console.log("Chatroom does not exist. Creating a new one...");
        await chatRoom.save();
      }

      // Join the user to the chatroom
      socket.join(chatRoom._id.toString());
      console.log(`User joined chatroom: ${chatRoom._id}`);
      socket.emit("chatroom joined", chatRoom);
    } catch (error) {
      console.error("Error joining chatroom:", error);
      socket.emit("error", "Unable to join chatroom");
    }
  });

  // Event: Send Message
  socket.on("send message", async ({ senderId, message, chatRoomId }) => {
    try {
      // Create a new message
      const newMessage = new Message({
        chatRoom: chatRoomId,
        sender: senderId,
        message,
      });
      await newMessage.save();
  
      // Update the last message in the chatroom
      await ChatRoom.findByIdAndUpdate(chatRoomId, {
        lastMessage: newMessage._id,
      });
  
      // Emit the message to everyone except the sender
      socket.broadcast.to(chatRoomId).emit("receive message", newMessage);
      console.log(`Message sent in chatroom ${chatRoomId}`);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", "Unable to send message");
    }
  });
  

  // Event: Disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
