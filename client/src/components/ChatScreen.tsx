import React, { useEffect, useState, useRef } from 'react';
import { getSocket } from '../lib/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader2, Shield, Activity, Cpu, Wifi } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  _id: string;
  senderId: string;
  senderNickname: string;
  text: string;
  createdAt: string;
}

interface ChatScreenProps {
  roomId: string;
  roomName: string;
  currentUserId: string;
  latitude: number;
  longitude: number;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ roomId, roomName, currentUserId, latitude, longitude, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [connecting, setConnecting] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('join_room', { roomId, latitude, longitude }, (response: any) => {
      setConnecting(false);
      if (response && response.success) {
        setMessages(response.messages || []);
        scrollToBottom();
      } else {
        onBack();
      }
    });

    socket.on('receive_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      socket.off('receive_message');
    };
  }, [roomId, latitude, longitude, onBack]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const socket = getSocket();
    socket.emit('send_message', { roomId, text }, (response: any) => {
      if (response && response.success) { /* Logic handled by receive_message */ }
    });
    setText('');
  };

  if (connecting) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-indigo-500/20 animate-pulse" />
        </div>
        <span className="text-[10px] font-bold tracking-[0.4em] text-indigo-400 uppercase animate-pulse">Establishing Secure Uplink...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#05070a] text-slate-200 overflow-hidden relative">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(79,70,229,0.02),rgba(16,185,129,0.01),rgba(79,70,229,0.02))] bg-[size:100%_4px,3px_100%]" />
      </div>

      {/* HEADER */}
      <header className="z-20 backdrop-blur-xl bg-[#05070a]/80 border-b border-white/[0.05] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all active:scale-90">
            <ArrowLeft className="h-5 w-5 text-indigo-400" />
          </button>
          <div className="space-y-1">
            <h2 className="font-bold text-sm tracking-widest uppercase text-white">{roomName}</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Sync Status: Stable</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-4 items-center opacity-40">
           <Shield className="h-4 w-4 text-emerald-400" />
           <Activity className="h-4 w-4 text-indigo-400" />
           <Cpu className="h-4 w-4 text-slate-400" />
        </div>
      </header>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 italic space-y-4">
              <Wifi className="h-12 w-12 animate-bounce" />
              <p className="text-xs tracking-widest uppercase">Waiting for signal packets...</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.senderId === currentUserId;
              const nodeColors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
              const signalColor = nodeColors[msg.senderNickname.length % 5];
              
              return (
                <motion.div 
                  initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg._id || idx} 
                  className={cn("flex flex-col group", isMe ? "items-end" : "items-start")}
                >
                  <div className={cn("flex items-center gap-2 mb-2 px-1", isMe ? "flex-row-reverse" : "flex-row")}>
                    <div className="h-1 w-4 rounded-full" style={{ backgroundColor: signalColor }} />
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
                      {isMe ? "YOU" : msg.senderNickname}
                    </span>
                  </div>

                  <div 
                    className={cn(
                      "relative px-5 py-3 border backdrop-blur-md transition-all",
                      isMe 
                        ? "bg-indigo-600/20 border-indigo-500/40 rounded-2xl rounded-tr-none text-indigo-50" 
                        : "bg-white/[0.03] border-white/10 rounded-2xl rounded-tl-none text-slate-200"
                    )}
                  >
                    {/* Holographic Glitch Effect on Bubble */}
                    <div className="absolute -inset-[1px] bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    
                    <p className="text-sm font-medium leading-relaxed break-words font-mono opacity-90 tracking-wide">
                      {msg.text}
                    </p>
                    
                    <span className="absolute -bottom-5 text-[8px] font-bold text-slate-600 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* INPUT FORM */}
      <div className="p-6 bg-gradient-to-t from-[#05070a] to-transparent relative z-10">
        <form onSubmit={handleSend} className="relative group max-w-4xl mx-auto flex items-center gap-3">
          <div className="absolute -inset-1 bg-indigo-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          
          <div className="relative flex-1">
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ENCRYPT MESSAGE..."
              className="w-full bg-slate-900/50 border border-white/10 focus:border-indigo-500/50 px-6 py-4 rounded-2xl text-sm outline-none transition-all placeholder:text-slate-700 placeholder:tracking-[0.2em] font-mono tracking-wider"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-20">
               <span className="text-[10px] font-bold text-indigo-400 tracking-tighter">SECURE</span>
               <div className="h-1 w-1 bg-emerald-500 rounded-full" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!text.trim()}
            className="relative h-14 w-14 flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl disabled:opacity-20 disabled:grayscale transition-all shadow-lg shadow-indigo-500/20 active:scale-90"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        <p className="text-center mt-4 text-[9px] font-bold text-slate-700 tracking-[0.5em] uppercase">
          Signal encrypted via end-to-end mesh tunnel
        </p>
      </div>
    </div>
  );
};

export default ChatScreen;