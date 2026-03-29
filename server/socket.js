import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message.js';
import Room from './models/Room.js';

export const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    // Socket.io middleware for authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error: No token provided'));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_for_circletalk');
            socket.user = decoded;
            next();
        } catch (error) {
            return next(new Error('Authentication error: Invalid Token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.nickname} (${socket.id})`);

        socket.on('join_room', async ({ roomId, longitude, latitude }, callback) => {
            try {
                // Secondary validation to check distance dynamically here if needed
                const room = await Room.findById(roomId);
                if (!room) {
                    if (callback) callback({ success: false, message: 'Room not found' });
                    return;
                }

                // E.g. Check distance between room location and user location if absolute strict bounds are needed
                
                socket.join(roomId);
                console.log(`User ${socket.user.nickname} joined room ${roomId}`);
                
                // Fetch recent messages
                const messages = await Message.find({ roomId }).sort({ createdAt: 1 }).limit(50);
                
                if (callback) callback({ success: true, messages });

                socket.to(roomId).emit('user_joined', { message: `${socket.user.nickname} joined the room` });
            } catch (error) {
                if (callback) callback({ success: false, message: 'Error joining room' });
            }
        });

        socket.on('send_message', async (data, callback) => {
            try {
                const { roomId, text } = data;
                
                // Add message to DB (Queue or direct)
                const message = await Message.create({
                    roomId,
                    senderId: socket.user.userId,
                    senderNickname: socket.user.nickname,
                    text
                });

                // Broadcast
                io.to(roomId).emit('receive_message', message);
                
                if (callback) callback({ success: true, message });
            } catch (error) {
                if (callback) callback({ success: false, message: 'Message failed to send' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};
