const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true }, // Reference to the ChatRoom
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender's reference
  message: { type: String, required: true }, // The message content
  messageType: { type: String, enum: ['text', 'image', 'audio', 'video'], default: 'text' }, // Message type
  createdAt: { type: Date, default: Date.now }, // Timestamp of when the message was sent
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }, // Message status (sent, delivered, read)
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
