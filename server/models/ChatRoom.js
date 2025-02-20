const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user references who are part of the chatroom
  createdAt: { type: Date, default: Date.now },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Reference to the last message in the chatroom
});

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom;
