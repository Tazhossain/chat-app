const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// All remaining requests return the React app, so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Initialize Telegram Bot
const bot = new TelegramBot(config.TELEGRAM_TOKEN, { polling: true });

// In-memory storage
const chatState = {
  onlineUsers: new Set(),
  messages: [],
  MAX_MESSAGES: 100 // Limit stored messages
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  let userNickname;

  socket.on('join', ({ nickname, password }) => {
    if (!nickname || password !== config.CHAT_PASSWORD) {
      socket.emit('error', 'Invalid credentials');
      return;
    }

    if (chatState.onlineUsers.has(nickname)) {
      socket.emit('error', 'Nickname already taken');
      return;
    }

    userNickname = nickname;
    chatState.onlineUsers.add(nickname);
    
    // Send recent message history
    socket.emit('message_history', chatState.messages);
    
    // Broadcast user joined
    io.emit('updateUsers', Array.from(chatState.onlineUsers));
    const joinMessage = { user: 'System', text: `${nickname} has joined the chat`, timestamp: Date.now() };
    chatState.messages.push(joinMessage);
    io.emit('message', joinMessage);

    // Notify Telegram
    bot.sendMessage(config.TELEGRAM_CHAT_ID, `${nickname} joined the chat`);
  });

  socket.on('message', ({ text }) => {
    if (!userNickname || !text.trim()) return;

    const message = {
      user: userNickname,
      text: text.trim(),
      timestamp: Date.now()
    };

    chatState.messages.push(message);
    if (chatState.messages.length > chatState.MAX_MESSAGES) {
      chatState.messages.shift();
    }

    io.emit('message', message);
    bot.sendMessage(config.TELEGRAM_CHAT_ID, `${userNickname}: ${text}`);
  });

  socket.on('disconnect', () => {
    if (userNickname) {
      chatState.onlineUsers.delete(userNickname);
      io.emit('updateUsers', Array.from(chatState.onlineUsers));
      const leaveMessage = { user: 'System', text: `${userNickname} has left the chat`, timestamp: Date.now() };
      chatState.messages.push(leaveMessage);
      io.emit('message', leaveMessage);
    }
  });
});

// Telegram bot commands
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith('/send ')) {
    const message = text.replace('/send ', '');
    const telegramMessage = {
      user: 'Telegram',
      text: message,
      timestamp: Date.now()
    };
    
    chatState.messages.push(telegramMessage);
    io.emit('message', telegramMessage);
    bot.sendMessage(chatId, 'Message sent to the chat');
  } else {
    bot.sendMessage(chatId, 'Use /send [message] to send a message to the chat');
  }
});

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
