// src/SendMessage.tsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';


interface SendMessageProps {
  client: any; // Replace `any` with the appropriate MQTT client type if available
  topic: string;
}

const SendMessage: React.FC<SendMessageProps> = ({ client, topic }) => {
  const [message, setMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (client && message) {
      const message_format = JSON.stringify({ 
        sender: localStorage.getItem('name'),
        message: message 
      });
      client.publish(topic, message_format, (err: any) => {
        if (err) {
          console.error('Failed to publish message:', err);
        } else {
          console.log('Message published:', message);
        }
      });
      setMessage('');
    }
  };

  return (
    <Box sx={{ padding: 3, fontFamily: 'Arial, sans-serif', maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        MQTT React App
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Enter a message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{ padding: 1.5 }}
        >
          Send Message
        </Button>
      </Box>
    </Box>
  );
};

export default SendMessage;
