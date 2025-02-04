import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const ChatRoom = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
      <Paper
        sx={{
          flex: 1,
          mb: 2,
          p: 2,
          overflow: 'auto',
          bgcolor: 'grey.50'
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              mb: 1,
              p: 1,
              bgcolor: msg.user === 'System' ? 'grey.200' : 'white',
              borderRadius: 1
            }}
          >
            <Typography variant="subtitle2" color="primary">
              {msg.user}
            </Typography>
            <Typography variant="body1">{msg.text}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          size="small"
        />
        <Button variant="contained" type="submit">
          Send
        </Button>
      </form>
    </Box>
  );
};

export default ChatRoom;
