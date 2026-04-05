import React, { useEffect, useState } from 'react';
import { getNearbyRooms, createRoom } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, MapPin, Loader2, ArrowRight, LogOut, Radio, Compass, ShieldCheck, Activity } from 'lucide-react';

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
      fetchRooms();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden font-sans relative">
      
      {/* --- ENHANCED STRUCTURAL BACKGROUND --- */}
      <div className="fixed inset-0 z-0 bg-[#05070a] overflow-hidden">
        
        {/* 1. Atmospheric Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#05070a_100%)] opacity-80" />

        {/* 2. Geometric Grid (The Blueprint Look) */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }} 
        />

        {/* 3. Static Light Beams (Framing the content) */}
        <div className="absolute top-0 left-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent" />
        <div className="absolute top-0 right-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent" />
        
        {/* 4. Deep Glow Orbs */}
        <div className="absolute -top-[10%] left-[10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] -right-[5%] w-[30rem] h-[30rem] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

        {/* 5. Subtle Digital Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10">
        {/* NAV BAR */}
        <header className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/[0.05] bg-[#05070a]/60 py-4">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <h2 className="text-xl font-light tracking-[0.3em] flex items-center gap-3">
                <div className="relative h-8 w-8 flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full animate-pulse" />
                  <Radio className="h-5 w-5 text-indigo-400 relative z-10" />
                </div>
                CIRCLE<span className="font-bold text-indigo-400">TALK</span>
              </h2>
              <div className="hidden lg:flex items-center gap-6">
                  <div className="h-4 w-[1px] bg-slate-800" />
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                      <Activity className="h-3 w-3 text-emerald-500" />
                      System Uplink: Active
                  </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-indigo-300">{nickname.toUpperCase()}</span>
              </div>
              <button 
                onClick={logout} 
                className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group border border-transparent hover:border-red-500/20"
              >
                <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-400" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-16">
          
          {/* HERO & RADAR */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-12 py-8">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase">
                 <ShieldCheck className="h-3 w-3" /> Encrypted Mesh Protocol
              </div>
              <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.1]">
                Scan. <br />
                <span className="font-bold text-indigo-400 italic">Connect.</span>
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm">
                Proximity-based communication for the modern digital nomad. 
              </p>
            </div>

            {/* RADAR COMPONENT */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              <div className="absolute inset-0 border border-indigo-500/5 rounded-full" />
              <div className="absolute inset-10 border border-indigo-500/5 rounded-full" />
              <div className="absolute inset-24 border border-indigo-500/10 rounded-full" />
              <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 rounded-full bg-gradient-to-t from-indigo-500/10 to-transparent"
                 style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)' }}
              />
              <div className="relative z-10 p-7 bg-[#05070a] border border-indigo-500/20 rounded-full shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                  <Compass className="h-12 w-12 text-indigo-400 animate-pulse" />
              </div>
              <div className="absolute top-10 right-12 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <div className="absolute bottom-20 left-10 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            </div>
          </section>

          {/* ACTION BAR */}
          <div className="flex justify-between items-center pb-6 border-b border-white/[0.05]">
             <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <h3 className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">Local Frequencies</h3>
             </div>
             <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-3 px-6 py-3 bg-indigo-500/5 border border-indigo-500/30 rounded-xl text-[10px] font-black tracking-[0.2em] text-indigo-300 hover:bg-indigo-500 hover:text-white transition-all"
            >
              <Plus className="h-4 w-4" />
              INITIALIZE LINK
            </button>
          </div>

          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-10 rounded-[2.5rem] bg-slate-900/30 border border-indigo-500/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <Plus className="w-48 h-48" />
                </div>
                <h3 className="text-xl font-bold tracking-[0.2em] uppercase mb-10 text-white flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    New Node Parameters
                </h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                      <label className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase ml-1">Room Designation</label>
                      <input
                          type="text"
                          placeholder="SIGNAL_ID"
                          className="w-full bg-black/40 border border-white/5 focus:border-indigo-500/40 px-6 py-5 rounded-2xl outline-none transition-all font-mono text-sm uppercase tracking-widest text-indigo-100"
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                          autoFocus
                      />
                  </div>
                  <div className="space-y-4">
                      <label className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase ml-1">Meta Description</label>
                      <input
                          type="text"
                          placeholder="DATA_STRING"
                          className="w-full bg-black/40 border border-white/5 focus:border-indigo-500/40 px-6 py-5 rounded-2xl outline-none transition-all font-mono text-sm uppercase tracking-widest text-indigo-100"
                          value={newRoomDesc}
                          onChange={(e) => setNewRoomDesc(e.target.value)}
                      />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-8 pt-4">
                    <button type="button" onClick={() => setIsCreating(false)} className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-600 hover:text-white transition-colors">Discard</button>
                    <button type="submit" className="px-12 py-5 bg-indigo-600 text-white text-[10px] font-black tracking-[0.3em] rounded-2xl hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 transition-all active:scale-95">DEPLOY FREQUENCY</button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ROOMS GRID */}
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center gap-8">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-500/50" />
              <p className="text-[10px] font-bold tracking-[0.4em] text-slate-600 uppercase animate-pulse">Syncing with local grid...</p>
            </div>
          ) : rooms.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center rounded-[3rem] border border-dashed border-white/[0.05] bg-white/[0.01]">
              <Compass className="h-16 w-16 text-slate-800 mx-auto mb-8" />
              <h3 className="text-lg font-bold tracking-[0.3em] uppercase text-slate-500">Signal Interrupted</h3>
              <p className="text-slate-700 text-[10px] mt-4 uppercase tracking-[0.2em]">No active nodes found within 5KM threshold.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {rooms.map((room, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  key={room._id}
                  className="group relative p-8 rounded-[2rem] bg-slate-950/40 border border-indigo-500/10 hover:border-indigo-500/40 transition-all duration-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
                  
                  <div className="relative z-10 flex flex-col h-full space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <Users className="h-6 w-6 text-indigo-400/70" />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black tracking-widest text-emerald-500">LIVE</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">{room.name}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium uppercase tracking-wider line-clamp-2 italic">
                          {room.description || "Node metadata is currently unavailable for this frequency."}
                      </p>
                    </div>

                    <button
                      onClick={() => onJoinRoom(room._id, room.name)}
                      className="w-full flex items-center justify-between py-5 border-t border-white/[0.03] group/btn"
                    >
                      <span className="text-[10px] font-black tracking-[0.3em] text-slate-500 group-hover/btn:text-indigo-300 transition-colors uppercase italic">Establish Connection</span>
                      <ArrowRight className="h-5 w-5 text-slate-700 group-hover/btn:translate-x-2 group-hover/btn:text-indigo-400 transition-all" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto p-20 text-center">
           <div className="flex items-center justify-center gap-6 mb-6 opacity-10">
              <div className="h-[1px] w-20 bg-white" />
              <div className="w-2 h-2 rounded-full border border-white" />
              <div className="h-[1px] w-20 bg-white" />
           </div>
           <p className="text-slate-800 text-[10px] font-mono tracking-[0.6em] uppercase">
              SECURE_ID: {latitude.toFixed(2)}::{longitude.toFixed(2)} // MESH_NODE_v1.0.4
           </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardScreen;