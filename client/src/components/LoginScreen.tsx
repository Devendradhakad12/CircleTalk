import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShieldCheck, Zap, Globe, ArrowRight, Loader2, Command } from 'lucide-react';
import { loginGuest } from '../lib/api';

interface LoginScreenProps {
  onLogin: (data: { token: string; userId: string; nickname: string }, lat: number, lon: number) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const loginData = await loginGuest();
          
          localStorage.setItem('circle_talk_token', loginData.token);
          localStorage.setItem('circle_talk_userId', loginData.userId);
          localStorage.setItem('circle_talk_nickname', loginData.nickname);
          localStorage.setItem('circle_talk_latitude', lat.toString());
          localStorage.setItem('circle_talk_longitude', lon.toString());
          onLogin(loginData, lat, lon);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Interface sync failed. Verify uplink.');
          setLoading(false);
        }
      },
      (geoError) => {
        setError('Location access required for local mesh synchronization.');
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#05070a] text-slate-200 overflow-hidden relative">
      
      {/* 1. Sophisticated Background - Deep Indigo/Emerald Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[140px]" />
        
        {/* Subtle Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* 2. The Main Terminal Card */}
        <div className="backdrop-blur-3xl bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-indigo-500/50" />
          <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-indigo-500/50" />

          {/* New Classy Logo Section */}
          <div className="text-center space-y-8">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
              <div className="relative w-full h-full border border-indigo-500/30 rounded-2xl flex items-center justify-center bg-slate-950/80 shadow-inner">
                <Command className="h-8 w-8 text-indigo-400 stroke-[1.5px]" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-light tracking-[0.3em] text-white uppercase">
                Circle<span className="font-bold text-indigo-400">Talk</span>
              </h1>
              <div className="h-[1px] w-12 bg-indigo-500/50 mx-auto" />
              <p className="text-slate-500 text-[10px] font-bold tracking-[0.4em] uppercase pt-2">
                Secure Proximity Protocol
              </p>
            </div>
          </div>

          {/* 3. Minimalist Features */}
          <div className="mt-12 space-y-4">
            <FeatureRow 
              icon={<MapPin className="h-4 w-4 text-indigo-400" />} 
              title="5KM MESH" 
              value="ACTIVE" 
            />
            <FeatureRow 
              icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />} 
              title="ENCRYPTION" 
              value="END-TO-END" 
            />
            <FeatureRow 
              icon={<Globe className="h-4 w-4 text-slate-400" />} 
              title="IDENTITY" 
              value="EPHEMERAL" 
            />
          </div>

          {/* 4. Dynamic Feedback */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="mt-8 p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-[11px] font-mono flex items-center gap-3"
              >
                <div className="w-1 h-1 rounded-full bg-red-500" />
                {error.toUpperCase()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. Minimalist Action Button */}
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full mt-10 relative group"
          >
            <div className="absolute inset-0 bg-indigo-600/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative border border-indigo-500/50 hover:border-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-100 font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 overflow-hidden">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                  <span className="text-xs tracking-[0.2em] font-bold">SYNCING...</span>
                </>
              ) : (
                <>
                  <span className="text-xs tracking-[0.2em] font-bold uppercase">Initialize Connection</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform opacity-50" />
                </>
              )}
            </div>
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           {/* Subtle branding or partner icons could go here */}
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
           <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        </div>
      </motion.div>

      {/* Interface metadata */}
      <div className="absolute bottom-8 left-8 text-[9px] text-slate-700 font-mono tracking-widest hidden md:block">
        SYSTEM_STATUS: NO_UPLINK_REQUIRED // LOCAL_PEER_DISCOVERY: ENABLED
      </div>
    </div>
  );
};

/* Helper Component for Features - Clean Row Style */
const FeatureRow = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-800/50 group/row">
    <div className="flex items-center gap-3">
      <div className="opacity-50 group-hover/row:opacity-100 transition-opacity">
        {icon}
      </div>
      <span className="text-[10px] font-bold tracking-[0.1em] text-slate-500 group-hover/row:text-slate-300 transition-colors">{title}</span>
    </div>
    <span className="text-[10px] font-mono text-slate-600 group-hover/row:text-indigo-400 transition-colors">{value}</span>
  </div>
);

export default LoginScreen;