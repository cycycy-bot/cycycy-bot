const express = require('express');
const path = require('path');
const WebSocketServer = require('ws').Server;
const http = require('http');
const url = require('url');

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.get('/showemote', (req, res) => {
  res.render('pages/showemote');
});

const clients = [];

const server = http.createServer(app);

const wss = new WebSocketServer({
  noServer: true,
});


wss.on('connection', (connection) => {
  console.log(`${new Date()} Connection accepted.`);
  const index = clients.push(connection) - 1;

  connection.on('message', (message) => {
    const json = JSON.stringify({ type: 'message', data: message });
    console.log(`${new Date()} ${json}`);
    for (let i = 0; i < clients.length; i++) {
      if(message === '__ping__') {
        return clients[i].send('__pong__');
      }
      clients[i].send(json);
    }
  });
});

server.on('upgrade', (req, socket, head) => {
  const { pathname } = url.parse(req.url);

  if (pathname === '/') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  }
});

server.listen(8080);
console.log('Server is loaded on port 8080');
