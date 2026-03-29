import jwt from 'jsonwebtoken';
import redisClient from '../config/redisClient.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_for_circletalk');
        
        // Check session in Redis
        const session = await redisClient.get(`session:${decoded.userId}`);
        if (!session) {
            return res.status(401).json({ success: false, message: 'Session expired or invalid. Please login again.' });
        }

        req.user = decoded; // { userId, nickname }
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};
