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

async function openaiApi(text, customerContext) {
  try {
    const openAiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `당신은 영업사원을 돕는 AI 어시스턴트입니다.
          고객의 발언을 듣고 영업사원에게 적절한 응대 방법과 정보를 제공해주세요.
          영업사원에게 조언하는 톤으로 답변해주세요.
          
            고객 정보:
          - 연령대: ${customerContext?.customerDetails?.age || '정보 없음'}
          - 구매 목적: ${customerContext?.customerDetails?.purpose || '정보 없음'}
          - 예산: ${customerContext?.customerDetails?.budget || '정보 없음'}
          - 선호 스타일: ${customerContext?.customerDetails?.preference || '정보 없음'}
          - 관심 분야: ${customerContext?.salesField || '정보 없음'}`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 1,
    });

    return openAiResponse.choices[0].message.content;
  } catch (error) {
    throw new Error('openAi 오류 발생 ' + error.message);
  }
}

async function openaiApiTts(text) {
  try {
    const tts = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'shimmer',
      input: text,
    });
    const buffer = Buffer.from(await tts.arrayBuffer());
    return buffer;
  } catch (error) {
    throw new Error('openAi 음성 변환 실패' + error.message);
  }
}

wss.on('connection', (ws) => {
  let customerContext = null;

  ws.on('message', async (data) => {
    try {
      if (typeof data === 'string') {
        try {
          const customerParsedData = JSON.parse(data);
          if (customerParsedData.type === 'customerCardContext') {
            customerContext = customerParsedData.customerInfo;
          }
          return;
        } catch (error) {
          ws.send(
            JSON.stringify({
              error: 'customerContext 실패' + error.message,
            }),
          );
        }
      }

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
          const openaiApiResult = await openaiApi(
            clovaApiResult.text,
            customerContext,
          );
          const voiceAPiResult = await openaiApiTts(openaiApiResult);

          ws.send(
            JSON.stringify({
              clovaApiResult: clovaApiResult.text,
              openaiApiResult: openaiApiResult,
              audioData: voiceAPiResult.toString('base64'),
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

  ws.on('close', () => {
    customerContext = null;
  });
});

app.get('/', (req, res) => {
  res.send('서버 작동 중');
});
