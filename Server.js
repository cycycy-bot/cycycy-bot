const express = require('express');
const path = require('path');
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({
  port: 5050,
});

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.get('/showemote', (req, res) => {
  res.render('pages/showemote');
});

const clients = [];

wss.on('connection', (ws) => {
  const index = clients.push(ws) - 1;

  ws.on('message', (message) => {
    const json = JSON.stringify({ type: 'message', data: message });
    for (let i = 0; i < clients.length; i++) {
      clients[i].send(json);
    }
  });
});


app.listen(8080);
console.log('Server is loaded on port 8080');
