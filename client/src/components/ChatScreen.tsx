import React, { useEffect, useState, useRef } from 'react';
import { getSocket } from '../lib/socket';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// utility to merge tw classes easily
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
        alert(response?.message || 'Error joining room');
        onBack();
      }
    });

    socket.on('receive_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on('user_joined', (data: any) => {
      // Optional: show systemic message
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_joined');
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
      if (response && response.success) {
         // Optionally confirm sent -> already receiving it globally from io.to(roomId) in some cases, 
         // but our backend broadcasts to ROOM and returning success.
      }
    });
    setText('');
  };

  if (connecting) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
        <span className="text-muted-foreground animate-pulse">Connecting to room...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="glass-panel border-b-0 sticky top-0 z-10 px-4 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="font-bold text-lg">{roomName}</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-white/50">Live</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-white/30 py-10">
            No messages yet. Say hello!
          </div>
        )}
        
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUserId;
          // Simple trick to color distinct nicknames differently based on their first char code
          const colorCode = msg.senderNickname.charCodeAt(0) % 5;
          const nicknameColors = [
            'text-rose-400', 'text-sky-400', 'text-emerald-400', 'text-amber-400', 'text-purple-400'
          ];
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg._id || idx} 
              className={cn("flex flex-col max-w-[85%]", isMe ? "ml-auto items-end" : "items-start")}
            >
              {!isMe && (
                <span className={cn("text-[11px] font-medium mb-1 pl-1", nicknameColors[colorCode])}>
                  {msg.senderNickname}
                </span>
              )}
              <div 
                className={cn(
                  "px-4 py-2.5 rounded-2xl relative",
                  isMe 
                    ? "bg-rose-500 text-white rounded-tr-sm" 
                    : "glass-input rounded-tl-sm text-gray-100"
                )}
              >
                <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
              </div>
            </motion.div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 glass-panel border-t border-white/5 flex gap-2">
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 glass-input px-4 py-3.5 rounded-xl text-[15px] focus:outline-none"
        />
        <button 
          type="submit" 
          disabled={!text.trim()}
          className="bg-rose-500 text-white p-3.5 rounded-xl hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatScreen;
