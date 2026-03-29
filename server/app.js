import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redisClient.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { setupSocket } from './socket.js';

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Services connection
connectDB();
connectRedis();

// Setup WebSocket
setupSocket(server);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

const Port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('CircleTalk API is running.');
});

server.listen(Port, () => {
    console.log(`Server started at port ${Port}`);
});