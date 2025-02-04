import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [input, setInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('updateUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('error', (errorMessage) => {
      alert(errorMessage);
    });

    return () => socket.disconnect();
  }, []);

  const login = () => {
    socket.emit('join', { nickname, password });
    setIsLoggedIn(true);
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', { text: input });
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      {!isLoggedIn ? (
        <div className="login">
          <h2>Login to Chat</h2>
          <input
            type="text"
            placeholder="Enter nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Join</button>
        </div>
      ) : (
        <div className="chat">
          <div className="users">
            <h3>Online Users:</h3>
            {onlineUsers.map((user, index) => (
              <div key={index}>{user}</div>
            ))}
          </div>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="input">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
