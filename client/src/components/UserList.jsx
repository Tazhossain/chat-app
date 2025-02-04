import React from 'react';
import { Paper, List, ListItem, ListItemText, Typography } from '@mui/material';

const UserList = ({ users }) => (
  <Paper
    sx={{
      width: '200px',
      height: '100%',
      overflow: 'auto',
      borderRadius: 1,
      bgcolor: 'grey.50'
    }}
  >
    <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      Online Users ({users.length})
    </Typography>
    <List>
      {users.map((user, index) => (
        <ListItem key={index}>
          <ListItemText primary={user} />
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default UserList;
