import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const Login = ({ onLogin }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    onLogin(nickname.trim(), password);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Welcome to Chat
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            label="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            error={!!error}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button variant="contained" type="submit" size="large">
            Join Chat
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
