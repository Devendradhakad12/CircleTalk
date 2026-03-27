import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { generateNickname } from '../utils/nicknames.js';
import redisClient from '../config/redisClient.js';
import User from '../models/User.js';

export const guestLogin = async (req, res) => {
    try {
        const userId = crypto.randomUUID();
        const nickname = generateNickname();

        // Ensure we save the user to mongo so it can be referenced (optional but good idea)
        const user = await User.create({ userId, nickname });

        // Generate JWT
        const token = jwt.sign(
            { userId, nickname }, 
            process.env.JWT_SECRET || 'super_secret_jwt_key_for_circletalk', 
            { expiresIn: '24h' }
        );

        // Store minimal auth session in Redis for 24h
        await redisClient.setEx(`session:${userId}`, 86400, JSON.stringify({
            userId,
            nickname,
            joinedAt: new Date().toISOString()
        }));

        res.status(200).json({
            success: true,
            data: {
                userId,
                nickname,
                token
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during guest login', error: error.message });
    }
};
