import Room from '../models/Room.js';

export const createRoom = async (req, res) => {
    try {
        const { name, description, longitude, latitude } = req.body;

        if (!name || longitude === undefined || latitude === undefined) {
            return res.status(400).json({ success: false, message: 'Name, longitude, and latitude are required.' });
        }

        const room = await Room.create({
            name,
            description,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)] // GeoJSON is [lng, lat]
            }
        });

        res.status(201).json({ success: true, data: room });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while creating room', error: error.message });
    }
};

export const getNearbyRooms = async (req, res) => {
    try {
        const { longitude, latitude, radius = 5000 } = req.query; // Default radius 5km = 5000m

        if (longitude === undefined || latitude === undefined) {
            return res.status(400).json({ success: false, message: 'Longitude and latitude are required.' });
        }

        const rooms = await Room.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        });

        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while fetching nearby rooms', error: error.message });
    }
};
