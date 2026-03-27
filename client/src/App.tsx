import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import ChatScreen from './components/ChatScreen';
import { initializeSocket, disconnectSocket } from './lib/socket';

function App() {
  const [session, setSession] = useState<{ token: string; userId: string; nickname: string } | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [activeRoom, setActiveRoom] = useState<{ id: string; name: string } | null>(null);

  const handleLogin = (data: { token: string; userId: string; nickname: string }, lat: number, lon: number) => {
    setSession(data);
    setLocation({ lat, lon });
    initializeSocket(data.token);
  };

  const handleLogout = () => {
    localStorage.removeItem('circle_talk_token');
    setSession(null);
    setLocation(null);
    setActiveRoom(null);
    disconnectSocket();
  };

  if (!session || !location) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (activeRoom) {
    return (
      <ChatScreen 
        roomId={activeRoom.id}
        roomName={activeRoom.name}
        currentUserId={session.userId}
        latitude={location.lat}
        longitude={location.lon}
        onBack={() => setActiveRoom(null)}
      />
    );
  }

  return (
    <DashboardScreen 
      latitude={location.lat}
      longitude={location.lon}
      nickname={session.nickname}
      onJoinRoom={(roomId, roomName) => setActiveRoom({ id: roomId, name: roomName })}
    />
  );
}

export default App;