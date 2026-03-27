import rateLimit from 'express-rate-limit';

// Allow max 15 requests per 10 minutes for auth/login
export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 15,
    message: { success: false, message: 'Too many requests from this IP, please try again after 10 minutes.' }
});

// Standard API limiting
export const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100, // 100 requests per 10 minutes
    message: { success: false, message: 'Too many requests, please try again later.' }
});
