const token_abi = require("../contracts/contract_abi");
const token_address = require("../contracts/contract_address");
const blockinfo = require("./blockinfo.model");

const cron = require("node-cron");
const Web3 = require("web3");

const web3 = new Web3(process.env.RPCURL);

const getTransactions = cron.schedule(
    "* */1 * * * *",
    async function () {
        try {
            console.log("1초마다 트랜잭션을 탐색합니다.")

            // 제안... 상태에 따라서
            // 

            // 체인에 마지막으로 생성된 블럭 조회
            const latestBlockNumber = await web3.eth.getBlockNumber().call();
            // server에서 마지막으로 조회했던 블럭 번호 조회
            const currentBlockNumber = await blockinfo.getLatestBlockNumber();

            if(latestBlockNumber > currentBlockNumber[0].end){
                await blockinfo.setLatestBlockNumber(currentBlockNumber, latestBlockNumber);

                for(let i = currentBlockNumber + 1 ; i <= latestBlockNumber ; i++ ){
                    // 블럭의 정보를 불러와서 server계정으로 발생한 트랜잭션 정보 저장
                }
            }
        } catch (err) {
            console.error(err, "트랜잭션 탐색에 실패했습니다.")
        }
    },
    {
        scheduled: false,
    }
);

module.exports = getTransactions;