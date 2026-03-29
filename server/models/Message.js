import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    senderId: { type: String, required: true },
    senderNickname: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '24h' } // TTL index for messages
});

// Index to efficiently query messages by room
messageSchema.index({ roomId: 1, createdAt: 1 });

export default mongoose.model('Message', messageSchema);
