const express = require('express');
const path = require('path');
const WebSocketServer = require('websocket').server;
const http = require('http');

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.get('/showemote', (req, res) => {
  res.render('pages/showemote');
});

const clients = [];

const server = http.createServer(app);

const wss = new WebSocketServer({
  httpServer: server,
});


wss.on('request', (ws) => {
  console.log(ws.host, ws.key);
  const connection = ws.accept(null, ws.origin);
  console.log(`${new Date()} Connection accepted.`);
  const index = clients.push(connection) - 1;

  connection.on('message', (message) => {
    const json = JSON.stringify({ type: 'message', data: message });
    console.log(`${new Date()} ${json}`);
    for (let i = 0; i < clients.length; i++) {
      clients[i].sendUTF(json);
    }
  });
});

server.listen(8080);
console.log('Server is loaded on port 8080');
