import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { io } from 'socket.io-client';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import UserList from './components/UserList';

const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin
  : 'http://localhost:3000';

function App() {
  const [socket, setSocket] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('message_history', (history) => {
      setMessages(history);
    });

    socket.on('updateUsers', (users) => {
      setUsers(users);
    });

    socket.on('error', (error) => {
      alert(error);
      setIsLoggedIn(false);
    });

    return () => {
      socket.off('message');
      socket.off('message_history');
      socket.off('updateUsers');
      socket.off('error');
    };
  }, [socket]);

  const handleLogin = (nickname, password) => {
    socket.emit('join', { nickname, password });
    setIsLoggedIn(true);
  };

  const handleSendMessage = (text) => {
    socket.emit('message', { text });
  };

  if (!socket) return null;

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            height: '100%',
            bgcolor: 'background.default'
          }}
        >
          <UserList users={users} />
          <ChatRoom messages={messages} onSendMessage={handleSendMessage} />
        </Box>
      </Container>
    </>
  );
}

export default App;
