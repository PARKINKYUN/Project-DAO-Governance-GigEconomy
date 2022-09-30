# Project Title

# 🧑‍🌾👷Gigtopia👩‍🍳🧑‍🔧

---

# 1. Introduction

## Gigtopia(as Platform)는

긱 워커(Gig Worker)와 고용주를 연결하는 플랫폼이며, 고용주는 자신의 요구 사항을 충족하는 노동력을 핀포인트로 고용하여 시간과 비용을 절약할 수 있습니다.

## Gigtopia(as DAO)는

1. Gig Worker를 위한 커뮤니티를 지향합니다.

   최근 국내외에서 긱 이코노미(Gig Economy)가 새로운 일의 형태로 떠오르고 있습니다. Gig이라는 단어는 일시적인 일을 뜻하며, 긱 워커는 필요한 곳에 필요할 때 필요한 만큼의 노동력을 제공하는 이들입니다. 즉, 긱 워커는 자신이 원할 때 원하는 만큼 일을 합니다. 노동자의 자율성이 높아진 많큼 삶의 질도 올라갈 것 같지만 현실은 꼭 그렇지만은 않습니다. 긱 워커는 정규직이 아닙니다. 따라서 보험, 상여금 등의 각종 복지혜택을 누리기 힘듭니다. 긱 토피아는 긱 워커의 긱 워커에 의한 긱 워커를 위한 커뮤니티를 구축하여 이러한 문제를 해결하고자 합니다.

2. 긱 워커의 울타리가 되어줍니다.

   기존의 긱 이코노미의 문제점 중 하나는 긱 워커의 입장을 대변할 집단이 존재하지 않는다는 것입니다. 이 문제를 해결하기 위해 긱 토피아는 거버넌스를 통하여 의사결정을 합니다. 긱 워커의 소중한 의견을 구성원 모두가 공유하고, 이 의견은 블록체인 기술로 구현된 공정하고 투명한 투표 시스템을 거쳐 긱 토피아의 운영에 반영됩니다.

3. 긱 워커와 함께 성장합니다.

   긱 토피아는 성숙한 DAO로 거듭나고자 합니다. 긱 워커는 단순한 노동력이 아닌 DAO의 구성원이며, 한 명 한 명이 집단의 주인입니다. 개인의 성장은 집단의 성장으로 이어지게 됩니다. 긱 이코노미와 토큰 이코노미(Token Economy)의 결합은 긱 워커에게 생태계 확장을 위한 동기를 부여할 것입니다. DAO의 성장에 꾸준히 기여한 긱 워커에게는 보다 적극적으로 의사결정에 참여할 수 있는 기회가 주어집니다.

---

# 2. Built with

- Front-end
  - ReactJs
  - MUI React UI tools
- Back-end
  - Express.js
  - Mongo Database
- Smart Contarct
  - ERC-20, ERC-721 Token
  - Openzeppeling Governor Contract
  - Hardhat

---

# 3. Quick Start

- Front-end
  1. Install packages

     ```jsx
     npm install
     ```

  2. Set smart contract addresses & ABIs
- Back-end
  1. Install packages

     ```jsx
     npm install
     ```

  2. Set .env file

     ```
     .env.example

     MONGO_URL = mongodb+srv://USERNAME:USERKEY@cluster0.n5rc5ym.mongodb.net/?retryWrites=true&w=majority
     RPC_URL = https://ropsten.infura.io/v3/APIKEY
     ACCESS_SECRET = gigtopia
     HTTPS_PORT = 4000
     ADMIN_WALLET_ACOUNT = 0xd...
     ADMIN_WALLET_PRIVATE_KEY =
     MODERATOR_URI = https://ipfs.io/ipfs/bafybeifanfpb7iwdhjveyccm4vv2bsj2omh
     ```
- Smart Contract
  1. Install packages

     ```
     npm install
     ```

  2. Deploy contracts

     ```
     npx hardhat deploy
     ```

     gig token, gig score token, moderator nft, governor 순으로 배포됩니다.

  3. Run Scripst

     거버너 컨트랙트에서 사용할 타겟 컨트랙트와 타겟 컨트랙트의 메서드, 인자 등은 helper-hardhat-config.js 에서 설정.

     - 거버너 propose 실행
       ```
       npx hardhat run script/propose.js
       ```
     - 거버너 queue 와 excute 실행
       ```
       npx hardhat run script/queue-and-excute.js
       ```
     - 커버너 vote 실행
       ```
       npx hardhat run script/vote.js
       ```

---

# 4. Features

## Order

1. client는 Find Worker 페이지에서 worker를 선택하여 직접 의뢰하거나, Find Order 페이지에서 의뢰를 작성할 수 있습니다. 의뢰 작성 후, worker가 올린 제안 중 마음에 드는 제안을 선택하여 의뢰를 시작할 수 있습니다.
2. worker는 Find Order 페이지에서 order를 선택하여 기간과 요구 보상을 설정후 client에게 제안을 보낼 수 있습니다. 또한, MyPage에서 상태를 pending으로 전환하면 프로필이 Find Worker에 노출되어 client가 직접 의뢰를 보낼 수 있게 됩니다. pending 상태로 전환에는 GigToken이 소요됩니다. 이 후 MyPa-ge에서 client가 직접 보낸 의뢰를 확인 후 수락하여 의뢰를 시작할 수 있습니다.
3. 위의 과정을 통하여 의뢰가 시작되면 client와 worker는 tap을 통하여 소통할 수 있습니다.
4. 의뢰가 완료되면 client는 워커에게 사전에 합의된 보상 GIgToken을 지급합니다. 또한 worker는 소정의 GIgScore를 획득합니다.
5. clinet는 worker를 평가합니다. client의 평가가 높으면 GigScore를 획득하고, 평가가 지나치게 낮다면 GigScore가 차감됩니다. worker가 client의 평가에 불복할 경우 이의를 제기할 수 있습니다(Court 참조).
6. worker는 해당 의뢰에 대한 회고를 작성하여 GIgToken을 지급 받습니다.

## Court

1. 의뢰 완료 후 client의 평가에 불복한다면 worker는 이의를 제기할 수 있습니다.
2. moderator(추후 설명)는 Governance 페이지에서 worker가 올린 이의를 확인 할 수 있습니다.
3. moderator는 이의를 심사하여 GigScore를 획득합니다.
4. 다수의 moderator가 동의하여 이의가 합당하다고 판단될 경우 Client는 평가를 정정해야 합니다.

## Vote

1. client는 일정량 이상의 GigScore를 사용해서 moderator 권한(NFT)을 획득할 수 있습니다. moderator NFT는 계정당 하나만 획득할 수 있습니다.
2. moderator는 proposal을 작성할 수 있습니다.
3. 다수의 worker가 동의한 proposal은 거버너 컨트랙트의 propose 함수를 통하여 voting으로 전환됩니다.
4. 투표는 moderator만 가능하며, moderator NFT 하나당 한 표, 즉 한 계정은 한 표만 행사할 수 있으며 모든 표의 가치(weight)는 동일합니다. 투표 후 GigScore가 지급됩니다.
5. 투표가 정족수를 넘었고 다수가 동의했다면 해당 제안은 성공으로 전주되어 거버너 컨트랙트의 excute 함수를 실행할 수 있게 됩니다
6. 정족수를 넘지 못하거나 다수가 동의하지 않는다면 투표는 실패하게 되고, 제안자의 GigScore가 차감됩니다. 따라서 제안은 신중하게 올려야 합니다.

![tokenEconomy](https://lh3.googleusercontent.com/ZIyJxWJ1BDogRfWd4wj5qvfHhJVv0RLqnvPLKSKRIaOzM_ubz7EMn8fWbglmsk5bUf7-mwKSXq2BP6dh8i4AWYMPgImyNBzJTcn11sb1C3XvbyRhIclGPN7ihxtpuIGwPejaReFYsZAwjiBCsdeTHPS2l9BMdC-kBOWYN3gXYZFWWVW7A4UDthJGXKgpQKgrHIkbuF0yHAwCnCXjK1anX3UtOCKoBC96xq6_xm1Uz-LpByUQ-b_xT5RGBrHtl9eNacbQQJLbTUlyPeuPC2zmmz9B2tb-wyAibtG7kgFHwyY2f-ge6z3CYFk4gA6I7RbWU70YD-6lgTqU-ELFN3vUAPzTmmzMguWaWgFUkNxGWkFiTLlA32OVOrEZwwkb7mSq28QuGqdsFSaFPgr9Spbk37cGcvk5XWkDc5FYpfo-ywIb6wEO5tHudRLfAIGOWRHBd67lUW-ngq5DRH_9IZnNy5yveqPZobVBjwZ1-bMD_ok9XB6F12vJEwRtl0QtHxkbqCYO98KIyRfCre8F33uD8qKMutZezT2lN1E1w9pJ7JzXU311sFyeTF5fbICEBIaRuJxK-w3uGBPNZVXcFOvX0IR1UNpm-dhrL0ftBcuE3A0JuHlGGWrZ8izY3wLDhiU1I9bYrl0jO23hpJ03hbhds35jweJo7vUj-uNd2zBOZOluxu_f74qQvtOo6_njExu6MzhpFdBvCWf_81uWKBOCwXLADv2fYC423FxbHZQTnTXgYbdPm1p_bNefZ_aiCJSY_LGjydadG_dPnfj_B9d5-ZhAiPGMauiyDvwdWMXlKwJcg-zuqRco6ZRLjcJyo4Jswgqe0ePfcxJP8Vp1w6QQZ1RZ1NyjCHwEivyPOqSoRnh5lYaGl51AjEHQuVJt7MPvFPJt5WhWWhCizibm5Hy3Kxu4tPNyC5JDX8HVvsfBqPK7m6ksjCY7V_FkVyjQB0d9zJoiBg=w1432-h676-no?authuser=0)

---

# 5. RESTFul API and other Documents

[https://vast-shoemaker-7d4.notion.site/Gigtopia-APIs-470fca6294834f43b1de54cd83c84e25](https://www.notion.so/Gigtopia-APIs-470fca6294834f43b1de54cd83c84e25)

---

# 6. Team

## 박인균 (팀장)

- PM, Fullstack, SmartContract

## 김승주

- Fullstack

## 오정헌

- Backend, SmartContract

## 이효정

- Fullstack
