import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

interface MessageDisplayProps {
  client: any | null;
  topic: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ client, topic }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!client) return;

    const handleMessage = (receivedTopic: string, payload: Buffer) => {
      const formatedMessages = JSON.parse(payload.toString());
      const newMessage = `${formatedMessages.sender}: ${formatedMessages.message}`;
      if (receivedTopic === topic) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    // Subscribe to the topic and listen for messages
    client.subscribe(topic, (err: any) => {
      if (err) {
        console.error('Failed to subscribe to topic:', err);
      } else {
        console.log(`Subscribed to topic: ${topic}`);
      }
    });

    client.on('message', handleMessage);

    return () => {
      client.unsubscribe(topic, (err: any) => {
        if (err) {
          console.error('Failed to unsubscribe from topic:', err);
        } else {
          console.log(`Unsubscribed from topic: ${topic}`);
        }
      });

      client.off('message', handleMessage);
    };
  }, [client, topic]);

  useEffect(() => {
    // Scroll to the end of the list when messages update
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <Paper sx={{ maxHeight: "90vh", overflowY: 'auto' }} elevation={3}>
        <List>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText primary={msg} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" align="center">
              No messages received yet.
            </Typography>
          )}
          {/* Invisible div to scroll to */}
          <div ref={listEndRef} />
        </List>
      </Paper>
    </>
  );
};

export default MessageDisplay;
