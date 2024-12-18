const express = require('express');
const WebSocket = require('ws');
const fetch = require('node-fetch');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

const server = app.listen(port, () => {});

const wss = new WebSocket.Server({ server });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function openaiApi(text) {
  try {
    const openAiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
    });

    return openAiResponse.choices[0].message.content;
  } catch (error) {
    throw new Error('openAi 오류 발생 ', error.message);
  }
}

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

        const clovaApiResult = await clovaResponse.json();

        if (clovaApiResult.text) {
          const openaiApiResult = await openaiApi(clovaApiResult.text);

          ws.send(
            JSON.stringify({
              clovaApiResult: clovaApiResult.text,
              openaiApiResult: openaiApiResult,
            }),
          );
        } else {
          ws.send(
            JSON.stringify({
              error: 'openAi 텍스트 전달 실패',
            }),
          );
        }
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          error: 'openAi API 오류' + error.message,
        }),
      );
    }
  });

  ws.on('close', () => {});
});

app.get('/', (req, res) => {
  res.send('서버 작동 중');
});
