import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    createdAt: { type: Date, default: Date.now, expires: '24h' } // TTL index: Room expires after 24 hrs
}, { timestamps: true });

// GeoSpatial Index to enable $geoNear and $nearSphere queries
roomSchema.index({ location: '2dsphere' });

export default mongoose.model('Room', roomSchema);
