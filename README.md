# Steach

<div align="center">
<img src="https://github.com/user-attachments/assets/a22bdc24-da4f-4442-8eb8-a2eae108451f" alt="Steach" width="320"/>
</div>

<br>

<div align="center">
스티치는 영업직에 종사하는 사람들 위해 제작된 앱입니다.

AI와 함께 고객을 응대하여 더 좋은 서비스를 제공할 수 있습니다.

</div>

## 목차

<!-- toc -->

- [프로젝트 동기](#%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%8F%99%EA%B8%B0)
- [개발 환경](#%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD)
- [UI 미리보기](#ui-%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0)
- [기능 소개](#%EA%B8%B0%EB%8A%A5-%EC%86%8C%EA%B0%9C)
- [구현 기능](#%EA%B5%AC%ED%98%84-%EA%B8%B0%EB%8A%A5)
  - [1. 고객 정보 입력](#1-%EA%B3%A0%EA%B0%9D-%EC%A0%95%EB%B3%B4-%EC%9E%85%EB%A0%A5)
    - [1-1. 다양한 분야와 다양한 고객층](#1-1-%EB%8B%A4%EC%96%91%ED%95%9C-%EB%B6%84%EC%95%BC%EC%99%80-%EB%8B%A4%EC%96%91%ED%95%9C-%EA%B3%A0%EA%B0%9D%EC%B8%B5)
    - [1-2. 고객 카드 설정](#1-2-%EA%B3%A0%EA%B0%9D-%EC%B9%B4%EB%93%9C-%EC%84%A4%EC%A0%95)
  - [2. 음성 인식](#2-%EC%9D%8C%EC%84%B1-%EC%9D%B8%EC%8B%9D)
    - [2-1. API 선정 및 구성](#2-1-api-%EC%84%A0%EC%A0%95-%EB%B0%8F-%EA%B5%AC%EC%84%B1)
    - [2-2. STT(Speak To Text)로 대화 인식](#2-2-sttspeak-to-text%EB%A1%9C-%EB%8C%80%ED%99%94-%EC%9D%B8%EC%8B%9D)
    - [2-3. 변환된 텍스트를 기반으로 적절한 답변 생성](#2-3-%EB%B3%80%ED%99%98%EB%90%9C-%ED%85%8D%EC%8A%A4%ED%8A%B8%EB%A5%BC-%EA%B8%B0%EB%B0%98%EC%9C%BC%EB%A1%9C-%EC%A0%81%EC%A0%88%ED%95%9C-%EB%8B%B5%EB%B3%80-%EC%83%9D%EC%84%B1)
    - [2-4. TTS(Text-To-Speech)로 자연스러운 보이스 생성](#2-4-ttstext-to-speech%EB%A1%9C-%EC%9E%90%EC%97%B0%EC%8A%A4%EB%9F%AC%EC%9A%B4-%EB%B3%B4%EC%9D%B4%EC%8A%A4-%EC%83%9D%EC%84%B1)
- [개인 회고](#%EA%B0%9C%EC%9D%B8-%ED%9A%8C%EA%B3%A0)

<!-- tocstop -->

## 프로젝트 동기

고객을 응대하면서 영업을 하다 보면 다양한 상황에 직면하게 됩니다. 모든 상황에 대비할 수 있다면 좋겠지만, 현실적으로 그러기란 어렵습니다.  
때로는 내가 알고 있는 지식 이상으로 정보가 필요할 때도 있고, 고객의 요구 사항을 빠르게 해결해야 할 때도 있습니다.

이러한 부분을 AI를 통해 도움받는다면 위와 같은 상황을 더욱 빠르게 해결할 수 있어 고객 입장에서는 더 나은 서비스를 받을 수 있습니다.  
또한, 사용자 입장에서는 업무의 질이 향상되어 영업에 좋은 시너지를 줄 것이라고 생각해 제작하게 되었습니다.

## 개발 환경

| 분류       | 기술                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 개발 언어  | <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />                                                                                                                                                                                                                                                                                                                           |
| 클라이언트 | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/ReactNative-61DAFB?style=for-the-badge&logo=React&logoColor=black"> <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" /> <img src="https://img.shields.io/badge/zustand-orange?style=for-the-badge&logo=zustand&logoColor=white"> |
| 서버       | <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=black"> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white">                                                                                                                                                                                                                          |

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

gif

## 구현 기능

### 1. 고객 정보 입력

#### 1-1. 다양한 분야와 다양한 고객층

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

<br>

그러나 영업 분야에 대해서 입력하지 않는다면 포괄적인 답변이 나올 수 있기 때문에 최소한의 조건으로 영업 분야는 필수 입력으로 해두었습니다.

```jsx
if (!salesField.trim()) {
      alert('영업 분야를 입력해주세요');
```

#### 1-2. 고객 카드 설정

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

<br>

고객 카드에 상담 시작을 누르게 되면 AI 음성 인식을 할 수 있는 화면으로 전환됩니다.  
해당 버튼을 누르고 상담을 진행하면 상담을 진행한 내용이 텍스트로 쌓이게 됩니다. 쌓인 텍스트들은 상담 일지로 기록이되어 고객 카드를 삭제하지 않는다면  
언제든지 볼 수 있습니다. 고객 카드에 상담 일지는 하나만 기록되는 것이 아닙니다.  
고객과의 상담은 한번이 아닌 여러번 이루어질 수 있기 때문에 상담 일지 1, 상담 일지 2 형식으로 고객 카드에 상담 일지를 쌓아갈 수 있습니다.  
만약 해당 상담 일지가 필요하지 않게 되었다면 해당 상담 일지만 부분적으로 삭제할 수도 있습니다.

상담 전 작성한 고객 카드는 상담이 끝난 후에도 고객 카드를 수정할 수 있습니다. 상담을 마치게 되면 필수적으로 변경되는 사항들이 생깁니다. 그렇기 때문에 상담 종료시점에
고객 카드에 바로 접근하여 고객과 이야기 나눈 부분을 다시 한번 체크하면서 고객 카드를 수정할 수 있습니다.

고객 카드를 상담 전과 상담 후에도 접근할 수 있도록 Zustand를 사용했습니다.

```jsx
const useCustomerStore = create((set) => ({
  customerCards: [],
  currentId: 1,
  addCustomer: (newCustomer) =>
    set((state) => ({
      customerCards: [
        ...state.customerCards,
        {
          id: state.currentId,
          ...newCustomer,
        },
      ],
      currentId: state.currentId + 1,
    })),
}));
```

여러 화면에서 고객 카드에 접근하더라도 동일한 데이터에 접근 할 수 있습니다. 또 추가, 수정, 삭제처럼 변경사항 또한 즉시 반영되기 때문에 상담 시에도 업데이트가 되지 않은 정보사항으로 상담하는 리스크를 없애줍니다.
Zustand를 통해 고객 카드에 Id를 부여하기 때문에 Id가 중복되지 않아 데이터의 유일성을 보장해줍니다.  
그리고 고객 카드를 통해 실시간 음성 인식 화면으로 넘어갈 경우 고객 카드 정보를 컨텍스트로 전달하게 됩니다. 이때도 다른 고객 카드의 정보가 잘 못 전달되는 일이 없도록 해줍니다.

### 2. 음성 인식

#### 2-1. API 선정 및 구성

1. CLOVA Speech (STT)  
   CLOVA Speech Recognition API를 활용하여 실시간으로 고객의 음성을 텍스트로 변환합니다.  
   한국어에 특화된 음성 인식 성능을 제공하며, 다양한 억양과 발음을 효과적으로 처리할 수 있습니다.

2. OpenAI GPT 3.5 (맥락 파악)  
   OpenAI GPT-3.5 모델을 사용하여 고객의 발언을 분석하고 고객 정보(연령, 예산, 선호 스타일 등)를 바탕으로 최적화된 응답을 생성해줍니다.
   설정한 톤으로 영업사원에게 답변을 전달해줍니다.

3. OpenAI Text-to-Speech  
   자연스러운 음성 합성으로 이질감 없는 듣기가 가능합니다.
   Base64 인코딩으로 효율적인 음성 데이터 전송할 수 있습니다.

#### 2-2. STT(Speak To Text)로 대화 인식

음성 인식을 통해 대화를 텍스트로 변환하는 과정은 여러 단계를 거치기 때문에 안정성이 필요했습니다.  
처음에는 기본적인 방법으로 HTTP를 통해 음성 파일 전송을 했습니다. 완성된 음성 파일을 한번에 전송하기 때문에 데이터의 안정성이 보장 되었고, 오디오와 같이 큰 파일을 다루는데도 적합했습니다.

하지만 실제 영업 현장에서의 사용을 생각해봤을 때, 고객과의 대화는 끊임없이 이어지기도 하고 어떤 대화에서는 빠르게 답변을 주어야하는 상황도 생길 수 있습니다.  
정해지지 않은 다양한 상황을 반영하고 대처하기 위해서는 실시간성이 필요하다고 느꼈기 때문에 HTTP 방식 대신 WebSocket을 사용하게 되었습니다. WebSocket은 클라이언트와 서버 간에 양뱡향 통신을 가능하게 해주고 지속적으로 데이터를 전달하고 받기 때문에 실시간성에 적합했습니다.

음성 녹음은 Expo Audio API를 사용하여 구현했습니다. iOS 환경에서 녹음하기 위해 세부적인 설정이 필요했고, CLOVA Speech가 m4a 형식을 지원하지 않아 wav 형식을 지정해줘야 했습니다.  
또 음성 인식이 최대한 정확하게 인식되려면 오디오의 퀄리티가 좋아야하기 때문에 샘플레이트 조정도 설정에 넣어뒀습니다.

```jsx
await createRecording.prepareToRecordAsync({
  ios: {
    extension: '.wav',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    numberOfChannels: 1,
    sampleRate: 16000,
  },
});
```

<br>

녹음된 음성 데이터는 Binary 형태로 WebSocket을 통해 서버로 전송됩니다. 원본 데이터를 변환하지 않고 전송하기 때문에 데이터의 무결성을 유지하며 전송할 수 있습니다.  
또 Buffer를 사용하여 Binary 데이터 효율적으로 다룰 수 있고 데이터를 고정된 크기로 관리하기 때문에 실시간 통신에서 지연을 줄이는 역할을 합니다.

위와 같은 기반을 바탕으로 서버에서 받은 음성 데이터를 CLOVA Speech API로 전송하여 텍스트로 변환합니다.

```jsx
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
```

<br>

#### 2-3. 변환된 텍스트를 기반으로 적절한 답변 생성

단순히 고객의 음성 데이터만 텍스트로 변환하여 저장한다면, 지난 상담을 되돌아보는 기록에 지나지 않을 것이라 생각했습니다.
그러나 기록을 넘어서 고객이 하는 말에 따라 적절한 응답을 줄 수 있다면, 더 질 좋은 상담을 할 수 있을 것입니다.

고객이 어떤 말을 하든 이해하는 것을 넘어 적절한 응답을 주기 위해 OpenAI의 GPT 모델을 사용하였습니다.
이 모델은 음성 데이터가 텍스트로 변환되고, 변환된 텍스트를 기반으로 적절한 응답을 생성해줍니다.

그리고 가장 중요하게 생각한 것은 고객 카드에 저장된 정보를 활용하여 더욱 맞춤화된 답변을 생성하는 것이었습니다.
고객 카드에서 전달받은 정보를 AI가 답변을 생성하기 전에 제공받습니다. 그 정보를 바탕으로 AI가 고객을 좀 더 이해할 수 있고,
상담받는 고객이 원하는 것을 빠르게 찾을 수 있도록 해줍니다.

만약 고객 카드의 정보가 없었다면, 원하는 답이 나오기까지 시간이 더 걸릴 것입니다.
최종적으로 원하는 답변을 받을 수 있겠지만, 고객에게 더 나은 서비스를 제공하지 못한 상담이 됩니다.
상담에서는 시간이 중요하기 때문에, 고객이 원하는 것을 빠르게 제시해 줘야 합니다.

```jsx
{
  role: 'system',
  content: `당신은 영업사원을 돕는 AI 어시스턴트입니다.
  고객의 발언을 듣고 영업사원에게 적절한 응대 방법과 정보를 제공해주세요.
  영업사원에게 조언하는 톤으로 답변해주세요.

  고객 정보:
  - 연령대: ${customerInfo.customerDetails.age}
  - 구매 목적: ${customerInfo.customerDetails.purpose}
  - 예산: ${customerInfo.customerDetails.budget}
  - 선호 스타일: ${customerInfo.customerDetails.preference}
  - 관심 분야: ${customerInfo.salesField}`
}
```

<br>

AI에게 고객 카드의 정보를 전달할 때, 단순히 컨텍스트로 전달한 것이 아닌 항목별로 구조화를 시켜서 전달했습니다.
또 AI에게 영업사원을 돕는 어시스턴트라고 역할을 인지시켰습니다. 이는 AI가 고객에게 직접 답변하는 것이 아니라 영업사원에게 조언을 주는 형태로 답변을 생성합니다.
영업사원은 조언을 주는 톤으로 답변을 받기 때문에 실제 현장에서 원활한 상담을 가능하게 해줍니다.

상담에서 적절한 답변을 받기 위해서 AI의 무작위성과 창의성을 조절해줬습니다. `temperature`를 파라미터로 설정해주고 숫자를 입력해 조절할 수 있습니다.
0부터 2까지 설정해줄 수 있으며, 2에 가까워질수록 무작위성과 창의성이 높아지고, 0과 가까워질수록 답변이 결정적이고 무작위성이 줄어들게 됩니다.

상담에서는 고객의 전체적인 말을 이해하면서 결정적인 답변을 주는 것이 중요하기 때문에 중간값인 1로 설정해줬습니다.

#### 2-4. TTS(Text-To-Speech)로 자연스러운 보이스 생성

생성된 답변을 텍스트로만 전달해 준다면, 지금까지 이야기했던 고객에게 더 좋은 상담을 제공한다는 취지와 어긋나게 됩니다.
고객과 상담 중에 텍스트를 읽고 답변하는 과정이 지속적으로 일어난다면, 고객은 상담의 흐름이 끊기는 느낌을 받을 수 있고,
영업사원이 상담에 집중하지 못한다는 인상을 받을 수 있습니다.

고객과 관계 형성이 중요한 상담에서 이러한 부분은 치명적입니다. 그렇기 때문에 영업사원이 고객과 대화에 집중할 수 있도록, 생성된 답변을 보이스로 읽어주는 것이 필요했습니다.

처음에는 Expo Speech API를 활용해서 보이스를 생성했지만, 기계음 같은 부자연스러운 목소리로 답변을 읽어주었습니다.
부자연스러운 목소리는 실제 현장에서 상담 분위기를 해칠 것이라 생각했고, 더 나아가 이 앱을 사용하는 영업사원에게도 좋은 사용성을 주는 것이 중요하다고 판단했습니다.

이러한 이유로 인해 OpenAI의 Text-To-Speech API를 선택하게 되었습니다. OpenAI는 실제 사람과 유사한 여러 목소리를 제공해주기 때문에, 앞서 말한 문제점들을 보완해 주었습니다.

```jsx
async function openaiApiTts(text) {
  try {
    const tts = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'shimmer', // 목소리 종류
      input: text,
    });
    const buffer = Buffer.from(await tts.arrayBuffer());
    return buffer;
  } catch (error) {
    throw new Error('openAi 텍스트 음성변환 실패' + error.message);
  }
}
```

<br>

API로부터 받은 음성 데이터는 arrayBuffer 형태로 반환하고, 이것을 Base64 형식으로 변환하여 WebSocket을 통해 클라이언트로 전송합니다.
Base64는 Binary 데이터를 문자열로 안전하게 전송 해주고 JSON 형식의 메세지에 음성 데이터를 포함 시킬 수 있기 때문에

## 개인 회고

팀 프로젝트를 진행하고 다음으로 개인 프로젝트를 진행하다 보니 어려운 부분이 정말 많았습니다.
팀으로 분담하여 하던 일을 혼자 하다 보니 자료 조사부터 문서 정리까지 할 일이 굉장히 많았습니다.
한편으로는 팀의 중요성을 깨닫게 되는 계기이기도 했습니다.

웹과 다른 React Native를 처음 사용해 보면서 여러 경험을 하게 되어 좋았습니다. 웹에서 생각했던 것과 다르게 모바일 환경에서는 추가적인 설정이 필요한 경우가 있었습니다. 그리고 이 프로젝트는 iOS를 위해 제작했지만, 만약 안드로이드에서까지 동작되게 한다고 했을 때 기능적인 코드뿐만 아니라 UI까지 점검을 해야 하니 앱도 많은 배움이 필요하다고 느꼈습니다.

실제 경험을 바탕으로 프로젝트를 진행하다 보니 기능을 추가함에 있어서 도움이 많이 되었습니다. 실제로는 뭐가 필요할까? 또는 이건 불필요한 기능이 아닐까?라는 측면에서 선택을 내리기가 비교적 쉬웠습니다. 보통 어떤 대상을 위해 무언가를 만들 때 대상의 입장이 되어 보는 것이 중요한데, 그러한 경험이 있었기 때문에 이 프로젝트가 나올 수 있었다고 생각합니다.

많은 것을 배우고 많은 것을 느낀 개인 프로젝트였습니다. 웹과 앱의 차이를 느끼게 해 준 프로젝트라 더욱 값지다고 생각합니다.
