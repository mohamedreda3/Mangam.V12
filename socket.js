const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 1299 });

wss.on('connection', function connection(ws) {
  console.log('New client connected');

  // Send a message to all connected clients
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send('A new client connected');
    }
  });

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    // Broadcast received message to all clients except the sender
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.send('Connected to server');
});

module.exports = { wss }