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

# 2. Basic Features

## Client(Employer) side

![client side](./image/client.gif)

1. 고용주가 회원가입을 하고 로그인을 하면, 메인 페이지에 Find Worker와 Find Order 메뉴가 보여집니다.
2. Find Order 메뉴는 여러 고용주가 의뢰한 작업 목록을 볼 수 있으며, 고용주는 본인이 의뢰할 작업을 등록할 수 있습니다.
   고용주는 다른 고용주가 작성한 의뢰 내용을 볼 수는 있지만, 어떠한 추가적인 액션을 할 수는 없습니다.
3. Find Worker 메뉴는 작업 대기 중인 Worker의 정보가 표시되는 페이지입니다.
   추후 카테고리 기능 추가를 통해 사용자 편의를 개선할 수 있습니다.
4. Worker 목록에서 특정 Worker를 선택하면 프로필, 평가점수, 그리고 작업 후기를 볼 수 있습니다.
   특히 작업 후기는 고용주 입장에서 Worker의 업무 역량을 파악하는 중요한 정성적 정보가 될 것입니다.
5. Worker 에 대해 궁금한 점이 있는 경우 대화하기 버튼을 눌러 채팅을 할 수 있습니다.
   채팅 내용은 서버에 저장되어 추후 Worker가 접속하면 내용이 보여집니다.
6. 고용주가 마음에 드는 Worker를 선택하고 작업 내용을 적어 Direct Order를 신청할 수 있습니다.
   이 경우 Order는 해당 Worker에게만 노출됩니다.
7. My Info 페이지에서도 새로 의뢰할 작업을 등록할 수 있으며, 과거 의뢰했던 모든 Order 이력을 조회할 수 있습니다.
8. 생태계 내에서 통용되는 화폐인 Gig Token 전송 기능도 이용할 수 있습니다.
9. 현재 의뢰 중이거나, 작업에 착수한 주문, 작업이 완료된 주문의 목록을 확인 가능합니다.
10. 현재 의뢰 중인 작업 목록에 들어가면 Offer를 신청한 Worker의 정보를 볼 수 있으며, 마음에 드는 Worker를 선택하여 작업 지시를 할 수 있습니다.
11. 작업 중인 주문 목록에서는 계약 기간을 연장하거나, 작업을 완료할 수 있습니다.
12. 작업이 종료된 주문의 정보에서는 작업 결과에 대한 만족도에 따라 Worker에게 평점을 주는 것으로 Client side에서의 Order 싸이클은 종료됩니다.

## Worker(Employee) side

![worker side](./image/worker.gif)

1. Worker가 회원가입을 하고 로그인을 하면 Find Worker, Find Order 그리고 Governance 메뉴가 보여집니다.
   Governance 페이지는 아래 3번 Special Features에서 다루도록 하겠습니다.
2. Find Worker 메뉴를 누르면 작업 대기중인 다른 Worker의 모습을 볼 수 있습니다.
   하지만 Worker로 로그인한 사용자는 다른 Worker에게 어떤 액션도 할 수 없습니다.
3. Find Order 메뉴를 누르면 현재 작업 대기 중인 Order 목록이 보여집니다.
   관심있는 Order를 누르면 Offer 신청이 가능하며, 고용주의 선택을 기다리게 됩니다.
   또한 해당 Order에 Offer를 신청한 다른 Worker의 정보를 알 수 있습니다.
   해당 Order에 대해 궁금한 점이 있으면 대화하기를 눌러 고용주에게 채팅을 할 수 있습니다.
4. My Info 페이지에서 Worker는 상태 변경 버튼을 눌러 작업 대기(Pending) 상태로 전환할 수 있고, Find Worker 페이지에 노출되게 됩니다.
   이때 Pending 비용이 소비되며, 이것은 플랫폼에 지불하는 중계 수수료와 같습니다.
5. 나의 정보에는 Gig Score 라는 ERC20 표준의 기여도를 확인할 수 있고, 작업했던 Order에 대한 고용주의 평가 점수를 볼 수 있습니다.
   Gig Score가 쌓이면 ERC721 기반의 Moderator 지원 자격을 얻을 수 있으며, Governance에서 정책 결정에 참여할 수 있게 됩니다.
   Gig Score는 통용 화폐인 Gig Token과는 다른 개념이며, 분리되어 있습니다.
6. Order 이력은 과거 작업했던 목록과 작업 후기를 모두 확인할 수 있습니다.
7. Token 전송을 클릭하면 사용자간 ERC20 표준의 Gig Token 전송이 가능합니다.
8. 대기중인 Order 목록에서는 Worker가 받은 Direct Order를 확인할 수 있습니다.
   이 경우 고용주가 아닌, Worker에게만 작업 시작에 대한 권한이 있습니다.
9. 작업 중인 Order 목록을 통해 본인이 수행하고 있는 Order를 확인하고 고용주에게 대화하기 채팅을 할 수 있습니다.
10. 종료된 Order에서는 고용주가 작업 종료를 지시한 목록을 확인합니다.
    종료된 작업에 대해서는 작업 후기를 남길 수 있고, Worker side에서 Order 싸이클이 종료됩니다.

# 3. Special Features

## DAO by Governance

![moderator](./image/moderator.gif)

1. Worker는 Order를 성실히 완료하고, 작업 후기를 남기는 등 생태계 발전에 기여를 하면,
   ERC20 기반의 Gig Score를 얻을 수 있으며, 이것을 소비하여 ERC721 기반의 Moderator로 전환을 할 수 있습니다.
2. Moderator로 전환한 Worker는 비로소 Governance에 합류하여 정책 결정에 참여할 수 있게 됩니다.

![governance](./image/governance.gif)

1. Governance 메뉴에 진입하면 현재 등록된 제안의 목록을 확인할 수 있습니다.
   제안은 Moderator라면 누구든지 비용없이 작성할 수 있습니다.
   작성된 제안에는 모든 Worker가 1인당 한 번씩 up, down을 선택할 수 있고, 이것으로 제안은 1차적으로 다수의 판단에 의해 필터링됩니다.
2. 만료 기간 내에 1차 정족수를 만족한 제안은 Governor 투표를 위해 시스템이 Passed Proposals 메뉴로 이동시킵니다.
3. Passed Proposals 메뉴에서는 블록체인에 투표를 상정하기 위한 작업이 이루어집니다.
   Governor 컨트랙트의 Propose 함수에 손쉽게 매개변수를 입력하여 실행 가능하도록 구현하였습니다.
4. Propose 함수가 정상적으로 실행되면 Governor 컨트랙트에서는 블록의 번호로 시간을 체크하여 일정 블록이 채굴되면 투표가 시작되게 됩니다.
   Moderator 는 현재 블록 번호가 몇 번인지 얼마나 시간이 지나야 하는지 알지 못하기 때문에
   서버의 데몬은 실시간으로 투표 아이디(proposalId)를 추적하여 투표의 상태가 active로 변경되면 Voting 메뉴로 해당 제안을 이동시킵니다.
5. Voting 메뉴의 숫자로 Moderator는 현재 진행중인 투표의 수를 알 수 있습니다.
   투표에 참여하면 시스템은 자동으로 Governor 컨트랙트의 castVote 함수를 실행시켜 투표 정보를 저장합니다.
   이때 Governor 컨트랙트는 ERC721 기반의 Moderator 컨트랙트를 참조하고 있고, NFT 한 개당 하나의 투표권만을 인정합니다.
   Moderator 컨트랙트는 하나의 계정당 하나의 NFT만을 허용하도록 커스터마이징 되어 있습니다.
6. 데몬은 투표 중인 제안을 추적하고 투표가 종료되면 해당 사실을 서버에 알립니다.
   시스템은 종료된 투표를 Voting Result 메뉴로 이동시키고, 투표에 따른 찬성표와 반대표 갯수 및 성공 여부를 확인할 수 있습니다.
7. 성공한 투표는 Execute 버튼이 활성화되며 누구든지 이 버튼을 눌러 제안을 현실로 만듭니다.
8. 이렇게 최종적으로 Execute 함수가 실행되면 하나의 투표 싸이클은 종료됩니다.

## Court

1. 의뢰 완료 후 client의 평가에 불복한다면 worker는 이의를 제기할 수 있습니다.
2. moderator는 Governance 페이지에서 worker가 올린 이의를 확인 할 수 있습니다.
3. moderator는 이의를 심사하여 GigScore를 획득합니다.
4. 다수의 moderator가 동의하여 이의가 합당하다고 판단될 경우 해당 평가는 Worker에게서 삭제됩니다.

---

# 4. Built with

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

# 5. Quick Start

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

# 6. RESTFul API and other Documents

[https://vast-shoemaker-7d4.notion.site/Gigtopia-APIs-470fca6294834f43b1de54cd83c84e25](https://www.notion.so/Gigtopia-APIs-470fca6294834f43b1de54cd83c84e25)

---

# 7. Team

## 박인균 (팀장)

- PM, Frontend & Backend, SmartContract

## 김승주

- Frontend & Backend

## 오정헌

- Backend, SmartContract

## 이효정

- Frontend & Backend
