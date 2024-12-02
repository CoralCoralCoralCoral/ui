import React, { useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

const CreateGameButton = () => {
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8080/game/create', {
        method: 'POST',
        headers: [

        ]
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // Process the response data here
      console.log(data['id'])

      const socket = new SockJS('http://localhost:8080/websocket')
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log(str); // Debugging STOMP messages
        },
        onConnect: () => {
          console.log('Connected to WebSocket server');
          
          // Subscribe to a STOMP topic
          stompClient.subscribe('/topic/game-update/'+data['id'], (message: IMessage) => {
            console.log('Received message:', message.body);
          });
        },
        onDisconnect: () => {
          console.log('Disconnected from WebSocket');
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
        },
      })

      stompClient.activate();
      

      setResponseMessage(data.message || 'Success!');
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Create Game'}
      </button>
      {responseMessage && <p>Response: {responseMessage}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default CreateGameButton;
