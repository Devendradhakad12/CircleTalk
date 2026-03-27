import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldAlert, Zap } from 'lucide-react';
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
          // loginData = { userId, nickname, token }
          
          localStorage.setItem('circle_talk_token', loginData.token);
          onLogin(loginData, lat, lon);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Login failed. Ensure DB is running.');
          setLoading(false);
        }
      },
      (geoError) => {
        setError('Location permission denied. We need it to find nearby rooms!');
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e24] via-[#09090b] to-[#09090b] -z-10" />
      
      {/* Decorative Blob */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" 
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel max-w-md w-full p-8 rounded-3xl text-center space-y-8"
      >
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center shadow-xl shadow-rose-500/20">
            <Zap className="h-10 w-10 text-white fill-white/20" />
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Circle<span className="text-rose-500">Talk</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Connect with people up to 5km away, instantly and anonymously.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-left p-4 rounded-xl bg-white/5 border border-white/10">
            <MapPin className="text-rose-500 flex-shrink-0" />
            <p className="text-white/80">Location access required to find nearby circles</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-left p-4 rounded-xl bg-white/5 border border-white/10">
            <ShieldAlert className="text-orange-400 flex-shrink-0" />
            <p className="text-white/80">No registration. Total anonymity.</p>
          </div>
        </div>

        {error && <p className="text-rose-400 text-sm font-medium">{error}</p>}

        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full relative group overflow-hidden bg-rose-500 text-white font-semibold py-4 rounded-2xl transition-all hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Join Anonymous Network"}
          </span>
        </button>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
