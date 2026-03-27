import express from 'express';
import { createRoom, getNearbyRooms } from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRoom);
router.get('/nearby', protect, getNearbyRooms);

export default router;
