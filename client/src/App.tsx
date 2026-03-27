import React, { useEffect, useState } from 'react';
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
    localStorage.removeItem('circle_talk_userId');
    localStorage.removeItem('circle_talk_nickname');
    localStorage.removeItem('circle_talk_latitude');
    localStorage.removeItem('circle_talk_longitude');
    setSession(null);
    setLocation(null);
    setActiveRoom(null);
    disconnectSocket();
  };
  useEffect(() => {
    const token = localStorage.getItem('circle_talk_token');
    const userId = localStorage.getItem('circle_talk_userId');
    const nickname = localStorage.getItem('circle_talk_nickname');
    const lat = localStorage.getItem('circle_talk_latitude');
    const lon = localStorage.getItem('circle_talk_longitude');


    if (token && userId && nickname) {
      setSession({ token, userId, nickname });
      if (lat && lon) {
        setLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
        initializeSocket(token);
      }
    }
  }, []);


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
      logout={handleLogout}
    />
  );
}

export default App;