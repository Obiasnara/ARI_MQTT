// src/GeoTrigger.tsx
import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MQTT_BROKER = 'ws://74.234.192.245:9001'; // Replace with your MQTT broker IP and WebSocket port
const MQTT_TOPIC = 'geo/location';

interface GeoTriggerProps {
  client: mqtt.MqttClient | null;
}

const GeoTrigger: React.FC<GeoTriggerProps> = ({ client }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const updateLocation = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });

      // Publish location to MQTT topic
      if (client) {
        const message = JSON.stringify({ lat: latitude, lng: longitude });
        client.publish(MQTT_TOPIC, message, (err) => {
          if (err) {
            console.error('Failed to publish location:', err);
          } else {
            console.log('Location published:', message);
          }
        });
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
    };

    const watchId = navigator.geolocation.watchPosition(updateLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [client]);

  return (
    <div>
      <h2>Geolocation Data</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {location ? (
        <p>
          Latitude: {location.lat}, Longitude: {location.lng}
        </p>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
};

export default GeoTrigger;
