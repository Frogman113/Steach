const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;

const server = app.listen(port, () => {});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    ws.send(`데이터 보냄 ${data}`);
  });

  ws.on('close', () => {});
});

app.get('/', (req, res) => {
  res.send('서버 작동 중');
});
