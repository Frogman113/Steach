# Steach

스티치는 대화를 할 때 무슨 말을 해야할지 모르는 사람들을 위해 제작된 어플리케이션입니다.  
Ai의 도움을 받아 대화에 알맞은 답변을 추천 받을 수 있습니다.

## 목차

<!-- toc -->

- [선정 이유](#%EC%84%A0%EC%A0%95-%EC%9D%B4%EC%9C%A0)
- [개발 환경](#%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD)
- [미리 보기](#%EB%AF%B8%EB%A6%AC-%EB%B3%B4%EA%B8%B0)
- [구현 과정](#%EA%B5%AC%ED%98%84-%EA%B3%BC%EC%A0%95)
  - [어떻게 대화의 속도를 따라갈 것인가?](#%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8C%80%ED%99%94%EC%9D%98-%EC%86%8D%EB%8F%84%EB%A5%BC-%EB%94%B0%EB%9D%BC%EA%B0%88-%EA%B2%83%EC%9D%B8%EA%B0%80)
    - [1. API 선정](#1-api-%EC%84%A0%EC%A0%95)
    - [2. STT(Speak To Text)로 대화 인식](#2-sttspeak-to-text%EB%A1%9C-%EB%8C%80%ED%99%94-%EC%9D%B8%EC%8B%9D)
    - [3. WebSocket을 사용한 실시간 통신](#3-websocket%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%9C-%EC%8B%A4%EC%8B%9C%EA%B0%84-%ED%86%B5%EC%8B%A0)
  - [2. 말의 끝을 판단하여 변환하기](#2-%EB%A7%90%EC%9D%98-%EB%81%9D%EC%9D%84-%ED%8C%90%EB%8B%A8%ED%95%98%EC%97%AC-%EB%B3%80%ED%99%98%ED%95%98%EA%B8%B0)
- [진행 방식](#%EC%A7%84%ED%96%89-%EB%B0%A9%EC%8B%9D)
- [개인 회고](#%EA%B0%9C%EC%9D%B8-%ED%9A%8C%EA%B3%A0)

<!-- tocstop -->

## 선정 이유

요즘은 MBTI로 E와 I를 나누어 I는 소심한 편에 속하는 사람이라고 구분하기도 합니다. 소심한 편에 속하는 사람들 중 다수가 상대방과의 대화를 어려워합니다.
친구와의 대화, 직장 사람들과의 대화, 처음 보는 사람과의 대화 등에서 적절한 답변을 생각하는 데 피곤함과 부담을 많이 느낍니다.

그런 사람들을 위해 대신 생각해 주고 적절한 답변을 말해주는 도우미가 있다면 조금이나마 대화에 대한 부담이 줄어들지 않을까 해서 선정하게 되었습니다.

## 개발 환경

| 분류       | 기술                                                                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 개발 언어  | <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />                                                                                                  |
| 클라이언트 | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/ReactNative-61DAFB?style=for-the-badge&logo=React&logoColor=black"> |
| 서버       | <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=black"> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white"> |

## 미리 보기

<img src="https://github.com/user-attachments/assets/7822736a-6fec-426f-a6e0-5cf5be23a36e" alt="Image 1" width="200"/>
<img src="https://github.com/user-attachments/assets/d2aadcd7-b753-4421-9508-de20bf4ddbe2" alt="Image 2" width="201"/>
<img src="https://github.com/user-attachments/assets/f6d805da-6dce-460f-8850-66a4fe2d2ba2" alt="Image 3" width="207"/>

## 구현 과정

### 어떻게 대화의 속도를 따라갈 것인가?

대화는 채팅처럼 기다리면서 하지않고 상대방과 실시간으로 교류가 일어납니다. 그렇기 때문에 상대방의 말을 실시간으로 듣고 빠르게 답변을 줘야만 대화의 흐름이 어색하지 않을 것이라고 판단했습니다.

#### 1. API 선정

음성 파일 텍스트로 변환 => CLOVA API

텍스트로 변환된 파일 기반 답변 생성 => openAI  
선정 사유: WebSocket을 지원하기 때문에 앱 제작 목적과 일치하여 선정했습니다.

생성된 답변 보이스로 출력 => openAI
선정 사유: 사람과 비슷하게 자연스러운 보이스로 전환할 수 있어 생성된 답변을 들었을 때  
사용자가 듣기에 이질감이 덜 할 것이라고 판단하여 선정했습니다.

#### 2. STT(Speak To Text)로 대화 인식

#### 3. WebSocket을 사용한 실시간 통신

음성 녹음을 통해 저장된 음성 파일을 CLOVA API로 전송 후 텍스트 출력합니다.

```jsx
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
```

<br>

텍스트로 변환된 파일을 openAi API로 전송 후 텍스트 기준 알맞은 답변을 생성해 텍스트로 출력합니다.

```jsx
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
      temperature: 1,
    });

    return openAiResponse.choices[0].message.content;
  } catch (error) {
    throw new Error('openAi 오류 발생 ' + error.message);
  }
}
```

<br>

생성된 텍스트 답변을 자연스러운 보이스로 전환하기 위해 openAi API를 사용하여 사용자에게 전달합니다.

```jsx
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
    throw new Error('openAi 텍스트 음성변환 실패' + error.message);
  }
}
```

### 2. 말의 끝을 판단하여 변환하기

대화의 기준을 어디로 두고 변환할 것인가?를 생각해보았을 때, 꽤 어려운 문제였습니다. 사람마다 한 번에 말하는 문장의 양도 다르고 형태도 다르기 때문에 기준을 어디로 잡아야 할지가 가장 키 포인트라고 생각했습니다.

자칫 잘못하면 상대방이 앞서 말한 말에 대해 적절한 답변을 주지 못하고 엉뚱한 답변을 할 수도 있고, 한 번에 변환하는 문장이 길다면 정확한 맥락을 파악하여 전달하지 못할 것이라고 판단했습니다.

## 진행 방식

## 개인 회고

팀 프로젝트를 진행하고 개인 프로젝트를 진행하다보니 어려운 부분이 정말 많았습니다.
