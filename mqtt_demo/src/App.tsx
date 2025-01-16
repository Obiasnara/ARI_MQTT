// src/App.tsx
import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MQTT_BROKER = 'ws://74.234.192.245:9001'; // Replace with your MQTT broker IP and WebSocket port
const MQTT_TOPIC = 'test/topic';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    // Connect to the MQTT broker
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

    mqttClient.on('message', (topic, payload) => {
      console.log(`Message received on topic ${topic}: ${payload}`);
      setReceivedMessages((prev) => [...prev, payload.toString()]);
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT error:', err);
    });

    setClient(mqttClient);

    // Cleanup on component unmount
    return () => {
      mqttClient.end();
    };
  }, []);

  const handleSendMessage = () => {
    if (client && message) {
      client.publish(MQTT_TOPIC, message, (err) => {
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MQTT React App</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button onClick={handleSendMessage} style={{ padding: '10px' }}>
          Send Message
        </button>
      </div>
      <h2>Received Messages:</h2>
      <ul>
        {receivedMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
