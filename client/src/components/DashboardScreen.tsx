import React, { useEffect, useState } from 'react';
import { getNearbyRooms, createRoom } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, MapPin, Loader2, ArrowRight } from 'lucide-react';

interface Room {
  _id: string;
  name: string;
  description: string;
  location: { type: string; coordinates: [number, number] };
  createdAt: string;
}

interface DashboardProps {
  latitude: number;
  longitude: number;
  nickname: string;
  onJoinRoom: (roomId: string, roomName: string) => void;
  logout: () => void;
}

const DashboardScreen: React.FC<DashboardProps> = ({ latitude, longitude, nickname, onJoinRoom, logout }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');

  const fetchRooms = async () => {
    try {
      const data = await getNearbyRooms(latitude, longitude, 5000);
      setRooms(data || []);
    } catch (error) {
      console.error('Failed to get rooms', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [latitude, longitude]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName) return;
    try {
      await createRoom(newRoomName, newRoomDesc, latitude, longitude);
      setIsCreating(false);
      setNewRoomName('');
      setNewRoomDesc('');
      setLoading(true);
      fetchRooms(); // refresh
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-y-auto">
      <header className="sticky top-0 z-50 glass-panel border-b-0 border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            Circle<span className="text-rose-500">Talk</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            Active across 5km radius
          </div>
        </div>
        <div className=' flex gap-2'>
          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-medium text-sm text-emerald-100">{nickname}</span>
          </div>
          {/* logout button */}
          <button onClick={logout} className="text-sm text-white/50 border-2 border-white/10  px-8 cursor-pointer py-2 rounded-[30px] hover:text-white transition-colors">
            Logout
          </button>
        </div>


      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Nearby Circles</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-white/10 hover:bg-white/20 transition-colors border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" /> New
          </button>
        </div>

        <AnimatePresence>
          {isCreating && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleCreate}
              className="glass-panel overflow-hidden p-6 rounded-2xl space-y-4"
            >
              <h3 className="text-xl font-medium">Create a new local room</h3>
              <input
                type="text"
                placeholder="Room Name (e.g., Downtown Chills)"
                className="w-full glass-input px-4 py-3 rounded-xl"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                autoFocus
              />
              <input
                type="text"
                placeholder="What's this about? (Optional)"
                className="w-full glass-input px-4 py-3 rounded-xl"
                value={newRoomDesc}
                onChange={(e) => setNewRoomDesc(e.target.value)}
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2 rounded-xl bg-transparent hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors"
                >
                  Create
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            <p>Scanning 5km radius...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border-dashed">
            <div className="w-16 h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white/40" />
            </div>
            <h3 className="text-xl font-medium mb-2">It's quiet here</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              No active rooms found within 5km. Be the first to start a conversation in your area!
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-rose-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-600 transition"
            >
              Start Local Chat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={room._id}
                className="glass-panel group p-6 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/0 group-hover:bg-rose-500/100 transition-colors" />
                <div className="mb-6">
                  <h3 className="text-xl font-bold truncate pr-8">{room.name}</h3>
                  {room.description && (
                    <p className="text-sm text-white/50 mt-1 line-clamp-2">{room.description}</p>
                  )}
                </div>

                <button
                  onClick={() => onJoinRoom(room._id, room.name)}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-rose-500 hover:text-white py-3 rounded-xl transition-colors font-medium text-sm border border-white/5 group-hover:border-transparent"
                >
                  Join Conversation <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardScreen;
