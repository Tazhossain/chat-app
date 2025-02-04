require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');

// Environment Variables
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const PORT = process.env.PORT || 3000;

// Initialize app, server, and WebSocket
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());

// Telegram Bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// In-memory storage for users
let onlineUsers = [];

// WebSocket connection
io.on('connection', (socket) => {
  // Handle user joining
  socket.on('join', ({ nickname, password }) => {
    if (!nickname || password !== 'chat_password') {
      socket.emit('error', 'Invalid login credentials.');
      return;
    }

    socket.nickname = nickname;
    onlineUsers.push(nickname);
    io.emit('updateUsers', onlineUsers);
    io.emit('message', { user: 'System', text: `${nickname} has joined the chat.` });

    // Notify Telegram
    bot.sendMessage('YOUR_TELEGRAM_CHAT_ID', `${nickname} joined the chat.`);
  });

  // Handle user sending messages
  socket.on('message', ({ text }) => {
    const nickname = socket.nickname || 'Anonymous';
    io.emit('message', { user: nickname, text });

    // Notify Telegram
    bot.sendMessage('YOUR_TELEGRAM_CHAT_ID', `${nickname}: ${text}`);
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    const nickname = socket.nickname;
    if (nickname) {
      onlineUsers = onlineUsers.filter((user) => user !== nickname);
      io.emit('updateUsers', onlineUsers);
      io.emit('message', { user: 'System', text: `${nickname} has left the chat.` });
    }
  });
});

// Telegram bot interaction
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Reply to user and send message to the chat
  if (text.startsWith('/send ')) {
    const message = text.replace('/send ', '');
    io.emit('message', { user: 'Telegram', text: message });
    bot.sendMessage(chatId, 'Message sent to the chat.');
  } else {
    bot.sendMessage(chatId, 'Use /send [message] to send a message to the chat.');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});