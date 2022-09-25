const votemodel = require("../models/vote.model");
const pastvotemodel = require("../models/pastVote.model");

const GovernorABI = require("../contracts/GovernorABI"); // Governor ABI
const GovernorAddress = require("../contracts/GovernorAddress"); // Governor Address

const Web3 = require("web3");
const web3 = new Web3(process.env.RPCURL);
const governor = new web3.eth.Contract(GovernorABI, GovernorAddress);

const cron = require("node-cron");
const { vote } = require("../controllers/votes.controller");

const getTransactions = cron.schedule(
    "1 * * * * *",
    async function () {
        try {
            console.log("1초마다 트랜잭션을 탐색합니다.")

            // 1. votes.controller 에서 propose 함수가 실행되고 proposalId 가 기록된 자료가 DB에 저장된다.
            // 2. 데몬이 DB에 저장된 자료 중 상태가 Pending, Active, Succeeded인 것을 읽어와 블록체인에서의 상태 변화를 감시한다.
            //    블록체인에서 proposalId로 state 함수를 실행시켜
            //    상태를 Pending(0), Active(1), Defeated(3), Succeeded(4), Executed(7) 에 따라 DB에 업데이트한다.
            // 4. 거버넌스 페이지에서는 DB의 상태에 따라 페이지에 항목별로 나누어 보여준다.
            //    (Pending // Active // Defeated // Succeeded // Executed)
            let voteData = await votemodel.getVote();

            for await (const vote of voteData) {
                const currentStatus = await governor.methods.state(vote.proposalId).call();              
                
                // 현재 상태가 defeated 또는 executed 라면 기존 DB에서 지우고 백업용 DB에 저장하라
                if(currentStatus === "3" || currentStatus === "7") {
                    const voteResult = await governor.methods.proposalVotes(vote.proposalId).call();
                    console.log(vote.description, "새로운 객체", voteResult);
                    const pastVote = {
                        proposalId: vote.proposalId,
                        proposal_id: vote.proposal_id,
                        values: vote.values,
                        description: vote.description,
                        mothods: vote.methods,
                        for: parseInt(voteResult["1"]),
                        status: vote.status,
                        proposer_id: vote.proposer_id,
                        targets: vote.targets,
                        calldatas: vote.calldatas,
                        contract: vote.contract,
                        params: vote.params,
                        against: parseInt(voteResult["0"]),
                        createdAt: vote.createdAt,
                    }
                    await new pastvotemodel(pastVote).saveVote();
                    await votemodel.removeVote(vote.proposalId);
                }
                // 그밖에 "pending" 상태가 아니면 업데이트 해라
                if(currentStatus !== "0"){
                    await votemodel.updateVote(vote.proposalId, currentStatus)
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