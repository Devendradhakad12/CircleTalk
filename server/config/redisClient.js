import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    socket: {
        tls: process.env.REDIS_URL && process.env.REDIS_URL.startsWith('rediss://')
    }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis connected successfully.'));

export const connectRedis = async () => {
    await redisClient.connect();
};

export default redisClient;
