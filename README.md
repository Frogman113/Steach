# Steach

스티치는 영업직에 종사하는 사람들 위해 제작된 앱입니다.  
AI와 함께 고객을 응대하여 더 좋은 서비스를 제공할 수 있습니다.

## 목차

<!-- toc -->

- [프로젝트 동기](#%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%8F%99%EA%B8%B0)
- [개발 환경](#%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD)
- [UI 미리보기](#ui-%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0)
- [기능 소개](#%EA%B8%B0%EB%8A%A5-%EC%86%8C%EA%B0%9C)
- [구현 기능](#%EA%B5%AC%ED%98%84-%EA%B8%B0%EB%8A%A5)
  - [고객 정보 입력](#%EA%B3%A0%EA%B0%9D-%EC%A0%95%EB%B3%B4-%EC%9E%85%EB%A0%A5)
    - [1. 다양한 분야와 다양한 고객층](#1-%EB%8B%A4%EC%96%91%ED%95%9C-%EB%B6%84%EC%95%BC%EC%99%80-%EB%8B%A4%EC%96%91%ED%95%9C-%EA%B3%A0%EA%B0%9D%EC%B8%B5)
    - [2. 고객 카드](#2-%EA%B3%A0%EA%B0%9D-%EC%B9%B4%EB%93%9C)
    - [3. 상담 일지](#3-%EC%83%81%EB%8B%B4-%EC%9D%BC%EC%A7%80)
  - [음성 인식](#%EC%9D%8C%EC%84%B1-%EC%9D%B8%EC%8B%9D)
    - [1. API 선정](#1-api-%EC%84%A0%EC%A0%95)
    - [2. STT(Speak To Text)로 대화 인식](#2-sttspeak-to-text%EB%A1%9C-%EB%8C%80%ED%99%94-%EC%9D%B8%EC%8B%9D)
    - [3. WebSocket을 사용한 실시간 통신](#3-websocket%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%9C-%EC%8B%A4%EC%8B%9C%EA%B0%84-%ED%86%B5%EC%8B%A0)
    - [4. 말의 끝을 판단하여 변환하기](#4-%EB%A7%90%EC%9D%98-%EB%81%9D%EC%9D%84-%ED%8C%90%EB%8B%A8%ED%95%98%EC%97%AC-%EB%B3%80%ED%99%98%ED%95%98%EA%B8%B0)
- [진행 방식](#%EC%A7%84%ED%96%89-%EB%B0%A9%EC%8B%9D)
- [개인 회고](#%EA%B0%9C%EC%9D%B8-%ED%9A%8C%EA%B3%A0)

<!-- tocstop -->

## 프로젝트 동기

고객을 응대하면서 영업을 하다 보면 다양한 상황에 직면하게 됩니다. 모든 상황에 대비할 수 있다면 좋겠지만, 현실적으로 그러기란 어렵습니다.  
때로는 내가 알고 있는 지식 이상으로 정보가 필요할 때도 있고, 고객의 요구 사항을 빠르게 해결해야 할 때도 있습니다.

이러한 부분을 AI를 통해 도움받는다면 위와 같은 상황을 더욱 빠르게 해결할 수 있어 고객 입장에서는 더 나은 서비스를 받을 수 있습니다.  
또한, 사용자 입장에서는 업무의 질이 향상되어 영업에 좋은 시너지를 줄 것이라고 생각해 제작하게 되었습니다.

## 개발 환경

| 분류       | 기술                                                                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 개발 언어  | <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />                                                                                                  |
| 클라이언트 | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/ReactNative-61DAFB?style=for-the-badge&logo=React&logoColor=black"> |
| 서버       | <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=black"> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white"> |

## UI 미리보기

<table>
  <tr>
    <td width="33%">메인 화면</td>
    <td width="33%">고객 카드 화면</td>
    <td width="33%">고객 정보 등록 화면</td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/2cee2e35-861f-4455-9279-7a933803d6b4" alt="Image 1" width="200"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/250d60bc-a34e-4187-be54-9789e28129b3" alt="Image 2" width="201"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/780d3597-002c-4de7-a1a4-14e23d9a4c4d" alt="Image 3" width="207"/>
    </td>
  </tr>
  <tr>
    <td width="33%">고객 카드 관리 화면</td>
    <td width="33%">음성 인식 중 화면</td>
    <td width="33%">구현 중</td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/f377d56a-634a-4777-87e4-fba94fec2af8" alt="Image 3" width="207"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/f6d805da-6dce-460f-8850-66a4fe2d2ba2" alt="Image 3" width="224"/>
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/f6d805da-6dce-460f-8850-66a4fe2d2ba2" alt="Image 3" width="224"/>
    </td>
  </tr>
</table>

## 기능 소개

## 구현 기능

### 고객 정보 입력

#### 1. 다양한 분야와 다양한 고객층

영업직군은 여러 직군이 있고 고객층도 다양하게 있기 때문에 그에 맞춰서 AI를 설정해주지 않으며 포괄적인 대답이 나오게됩니다.  
어떻게 상황마다 적절하게 설정 값을 줄 수 있을까 고민 했을 때 상담 일지 또는 고객 관리 파일이 떠올랐습니다.  
보통 상담을 진행하게되면 고객에 대한 정보를 기록하게 됩니다. 그리고 그것을 바탕으로 상담을 진행하게 됩니다.

<img width="500" alt="SCR-20250113-ijwg" src="https://github.com/user-attachments/assets/a01742e8-84b2-40b8-94e5-0e8063edcf60" />

위에서 말한 것처럼 상황에 맞게 필요한 정보를 넣어서 설정해준다며 그 정보를 기반으로 생성된 답변을 받을 수 있을 것이라 생각했습니다.

그래서 고객에 대한 정보를 고객 카드라는 방식으로 등록하게 해두었습니다.  
고객 카드에는 중요하다고 판단되는 정보들을 바탕으로 구성해두었고, 무조건적으로 필수사항은 아니기 때문에 입력을 하지 않아도 됩니다.
<br>

<img src="https://github.com/user-attachments/assets/61f9f6e3-0aff-4614-8286-2d55f101380a" alt="Image 3" width="250"/>

<br>

```jsx
const newCustomer = {
  salesField,
  customerDetails: {
    age: age.trim(),
    purpose: purpose.trim(),
    budget: budget.trim(),
    preference: preference.trim(),
  },
};
```

그러나 영업 분야에 대해서 입력하지 않는다면 포괄적인 답변이 나올 수 있기 때문에 최소한의 조건으로 영업 분야는 필수 입력으로 해두었습니다.

```jsx
if (!salesField.trim()) {
      alert('영업 분야를 입력해주세요');
```

#### 2. 고객 카드

고객 정보를 입력하고 등록을 하게되면 위 사진처럼 고객 카드가 생깁니다.

<img src="https://github.com/user-attachments/assets/4b6279a9-5e2f-4f7d-ad84-a8aee9e1efcb" alt="Image 3" width="300"/>

<br>

고객 카드를 새로 추가한다면 기존에 생성되어있던 카드 아래에 생성되게 됩니다.

<img src="https://github.com/user-attachments/assets/097d8734-b656-409e-aaf2-8c7681394ef5" alt="Image 3" width="300"/>

<br>

이 고객 카드가 생성되었을 때 상담을 시작하거나 정보를 수정 및 삭제할 수 있습니다.  
고객에 요구사항은 언제든지 바뀔 수 있기 때문에 수정한다면 해당 내용이 반영되게 됩니다.

고객과 상담을 진행한 내용은 굉장히 중요하기 때문에 삭제 버튼을 누르고 생성되는 모달에 삭제하고자하는 고객의 이름을 입력해야만 삭제할 수 있습니다.

<img src="https://github.com/user-attachments/assets/6aa1ad7c-18e7-44e6-a9a6-cf1e4d89cdc1" alt="Image 3" width="300"/>

#### 3. 상담 일지

고객 카드에 상담 시작을 누르게 되면 AI 음성 인식을 할 수 있는 화면으로 전환됩니다.  
해당 버튼을 누르고 상담을 진행하면 상담을 진행한 내용이 텍스트로 쌓이게 됩니다. 쌓인 텍스트들은 상담 일지로 기록이되어 고객 카드를 삭제하지 않는다면  
언제든지 볼 수 있습니다. 고객 카드에 상담 일지는 하나만 기록되는 것이 아닙니다.  
고객과의 상담은 한번이 아닌 여러번 이루어질 수 있기 때문에 상담 일지 1, 상담 일지 2 형식으로 고객 카드에 상담 일지를 쌓아갈 수 있습니다.  
만약 해당 상담 일지가 필요하지 않게 되었다면 해당 상담 일지만 부분적으로 삭제할 수도 있습니다.

### 음성 인식

#### 1. API 선정

음성 파일 텍스트로 변환 => CLOVA API

텍스트로 변환된 파일 기반 답변 생성 => openAI  
선정 사유: WebSocket을 지원하기 때문에 앱 제작 목적과 일치하여 선정했습니다.

생성된 답변 보이스로 출력 => openAI  
선정 사유: 사람과 비슷하게 자연스러운 보이스로 전환할 수 있어 생성된 답변을 들었을 때  
사용자가 듣기에 이질감이 덜 할 것이라고 판단하여 선정했습니다.

#### 2. STT(Speak To Text)로 대화 인식

처음에는 HTTP 방식을 통해 음성 녹음 파일을 서버로 전송했습니다.  
 오디오 같이 크기가 큰 파일에 적합한 방식이기도 하고 음성 녹음이 끝난 후 완성된 파일을 전송하는 것이기 때문에
안정성도 높습니다.

#### 3. WebSocket을 사용한 실시간 통신

음성 녹음을 통해 저장된 음성 파일을 CLOVA API로 전송 후 텍스트 출력합니다.  
전송된 데이터는

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

#### 4. 말의 끝을 판단하여 변환하기

대화의 기준을 어디로 두고 변환할 것인가?를 생각해보았을 때, 꽤 어려운 문제였습니다. 사람마다 한 번에 말하는 문장의 양도 다르고 형태도 다르기 때문에 기준을 어디로 잡아야 할지가 가장 키 포인트라고 생각했습니다.

자칫 잘못하면 상대방이 앞서 말한 말에 대해 적절한 답변을 주지 못하고 엉뚱한 답변을 할 수도 있고, 한 번에 변환하는 문장이 길다면 정확한 맥락을 파악하여 전달하지 못할 것이라고 판단했습니다.

## 진행 방식

## 개인 회고

팀 프로젝트를 진행하고 개인 프로젝트를 진행하다보니 어려운 부분이 정말 많았습니다.
