import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendMessage from './message_system/SendMessage';
import mqtt from 'mqtt';
import MessageDisplay from './message_system/MessageDisplay';

const MQTT_BROKER = 'ws://74.234.192.245:9001'; // Replace with your MQTT broker IP and WebSocket port

const MQTT_TOPIC = 'message/topic';

const App: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [c, setClient] = useState<any>(null);
  const [name, setName] = useState<string>('');
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    height: '100%',
    padding: "-10px",
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

  // Load name from local storage
  React.useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      setName(name);
    }
    const mqttClient = mqtt.connect(MQTT_BROKER);
    
    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error('Failed to subscribe to topic:', err);
        } else {
          console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
        }
      });
    });
    setClient(mqttClient);
  }, []);

  return (
    <Box style={{ width: '100vw', margin: 0, height: '100vh', padding: 0 }}>
      <Dialog
        open={name == ''}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const name = formJson.name;
            setName(name);
            // Save to local storage
            localStorage.setItem('name', name);

          },
        }}
      >
         <DialogTitle>User info</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To use the app please enter a nickname.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Nikname"
            type="login"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Subscribe</Button>
        </DialogActions>

      </Dialog>
        <Grid size={8} style={{ height: '90vh' }}>
            { name != '' ? 
            <Item>
              <MessageDisplay client={c} topic={MQTT_TOPIC} />
            </Item>
            : <CircularProgress style={ { color: 'white' } } /> }
        </Grid>
        <Grid size={4} style={{ height: '10vh' }}>
            { name != '' ? 
            <Item>
              <SendMessage client={c} topic={MQTT_TOPIC} />
            </Item> : 
            <CircularProgress style={ { color: 'white' } } /> }
        </Grid>
    </Box>
  );
};

export default App;
