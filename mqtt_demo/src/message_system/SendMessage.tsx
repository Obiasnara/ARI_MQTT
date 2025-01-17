// src/SendMessage.tsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import Alert from '@mui/material/Alert';


interface SendMessageProps {
  client: any; // Replace `any` with the appropriate MQTT client type if available
  topic: string;
}

const SendMessage: React.FC<SendMessageProps> = ({ client, topic }) => {
  const [message, setMessage] = useState<string>('');
  const [send_error_alert, setSendErrorAlert] = useState<boolean>(false);
  const handleSendMessage = () => {
    if (client && message) {
      const message_format = JSON.stringify({ 
        sender: localStorage.getItem('name'),
        message: message 
      });
      client.publish(topic, message_format, (err: any) => {
        // Alert Material-UI dialog if there is an error
        if (err) {
          console.error('Failed to publish message:', err);
          setSendErrorAlert(true);
          setTimeout(() => {
            setSendErrorAlert(false);
          }
          , 2000);
        }
      });
      setMessage('');
    }
  };

  // Enter key listener for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      { send_error_alert && <Alert severity="error">Failed to send message</Alert> }
      <TextField
        label="Enter a message"
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        autoFocus={true}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
      >
        Send Message
      </Button>
    </>
  );
};

export default SendMessage;
