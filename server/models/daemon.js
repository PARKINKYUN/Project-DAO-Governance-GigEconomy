const token_abi = require("../contracts/contract_abi");
const token_address = require("../contracts/contract_address");

const cron = require("node-cron");
const Web3 = require("web3");

const web3 = new Web3(process.env.RPCURL);

const getTransactions = cron.schedule(
    "* */1 * * * *",
    async function () {
        console.log("1초마다 트랜잭션을 탐색합니다.")
    },
    {
        scheduled: false,
    }
);

module.exports = getTransactions;