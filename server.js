const express = require('express');
const WebSocket = require('ws');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 3000;

const server = app.listen(port, () => {});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    try {
      if (Buffer.isBuffer(data)) {
        const clovaResponse = await fetch(
          'https://clovaspeech-gw.ncloud.com/recog/v1/stt?lang=Kor',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              'X-CLOVASPEECH-API-KEY': process.env.CLOVA_SECRET_KEY,
              'X-CLOVASPEECH-LANGUAGE': 'ko',
            },
            body: data,
          },
        );

        const apiResult = await clovaResponse.json();

        ws.send(JSON.stringify(apiResult));
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          error: error.message,
        }),
      );
    }
  });

  ws.on('close', () => {});
});

app.get('/', (req, res) => {
  res.send('서버 작동 중');
});
