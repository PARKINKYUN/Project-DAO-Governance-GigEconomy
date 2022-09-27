const Web3 = require("web3");

const GTabi = require("../contracts/GTabi"); // Gig Token ABI
const GTaddress = require("../contracts/GTaddress"); // Gig Token Address

const GSabi = require("../contracts/GSabi"); // Gig Score ABI
const GSaddress = require("../contracts/GSaddress"); // Gig Score Address

const GMabi = require("../contracts/GMabi"); // Moderator ABI
const GMaddress = require("../contracts/GMaddress"); // Moderator Address

const GovernorABI = require("../contracts/GovernorABI"); // Governor ABI
const GovernorAddress = require("../contracts/GovernorAddress"); // Governor Address

const web3 = new Web3(process.env.RPCURL);
const governor = new web3.eth.Contract(GovernorABI, GovernorAddress);
const gigtoken = new web3.eth.Contract(GTabi, GTaddress);
const gigscore = new web3.eth.Contract(GSabi, GSaddress);
const gigmoderator = new web3.eth.Contract(GMabi, GMaddress);

module.exports = {
    contractsetting: async (req, res) => {
        try {
            //
            /***** 각 컨트랙트 액세스 관계 셋팅 *****/
            /***** 주석을 해제하면 정상 작동하는 코드이며, 컨트랙트에 참조된 다른 컨트랙트의 주소를 변경할 수 있으니 신중하게 사용해야 합니다. *****/
            //
            // 1. GigToken 컨트랙트의 거버너 셋팅
            const accessData1 = await gigtoken.methods.setGovernor(GovernorAddress).encodeABI();
            const raw1 = {to: GTaddress, gas: 300000, data: accessData1};
            const signed1 = await web3.eth.accounts.signTransaction(raw1, process.env.ADMIN_WALLET_PRIVATE_KEY);
            console.log("여기서 시작", signed1)

            const sending1 = await web3.eth.sendSignedTransaction(signed1.rawTransaction);
            console.log("GigToken의 Governor Address 설정이 완료되었습니다.", sending1);
            
            // 2. GigScore 컨트랙트의 거버너, 모더레이터 셋팅
            const accessData2 = await gigscore.methods.setGovernorContractAddress(GovernorAddress).encodeABI();
            const raw2 = {to: GSaddress, gas: 300000, data: accessData2};
            const signed2 = await web3.eth.accounts.signTransaction(raw2, process.env.ADMIN_WALLET_PRIVATE_KEY);
            const sending2 = await web3.eth.sendSignedTransaction(signed2.rawTransaction);
            console.log("GigScore의 Governor Address 설정이 완료되었습니다.", sending2);
            const accessData3 = await gigscore.methods.setModeratorContractAddress(GMaddress).encodeABI();
            const raw3 = {to: GSaddress, gas: 300000, data: accessData3};
            const signed3 = await web3.eth.accounts.signTransaction(raw3, process.env.ADMIN_WALLET_PRIVATE_KEY);
            const sending3 = await web3.eth.sendSignedTransaction(signed3.rawTransaction);
            console.log("GigScore의 Moderator Address 설정이 완료되었습니다.", sending3);
            
            // 3. GigModerator 컨트랙트의 거버너, 긱스코어 셋팅
            const accessData4 = await gigmoderator.methods.setGovernor(GovernorAddress).encodeABI();
            const raw4 = {to: GMaddress, gas: 300000, data: accessData4};
            const signed4 = await web3.eth.accounts.signTransaction(raw4, process.env.ADMIN_WALLET_PRIVATE_KEY);
            const sending4 = await web3.eth.sendSignedTransaction(signed4.rawTransaction);
            console.log("GigModerator의 Governor Address 설정이 완료되었습니다.", sending4);
            const accessData5 = await gigmoderator.methods.setToken(GSaddress).encodeABI();
            const raw5 = {to: GMaddress, gas: 300000, data: accessData5};
            const signed5 = await web3.eth.accounts.signTransaction(raw5, process.env.ADMIN_WALLET_PRIVATE_KEY);
            const sending5 = await web3.eth.sendSignedTransaction(signed5.rawTransaction);
            console.log("GigModerator의 GigScore Address 설정이 완료되었습니다.", sending5);

            // 모더레이터 만들기
            // console.log("Gig Moderator 전환")
            // const moderator = "0x98Feb2552151600a78B684905064F02F908A3155" // 모더레이터 만들 주소
            // const rawData = await gigscore.methods.transferFrom(process.env.ADMIN_WALLET_ACOUNT, moderator, 500000).encodeABI();
            // const rawTX = {to: GSaddress, gas: 300000, data: rawData};
            // const signedTrans = await web3.eth.accounts.signTransaction(rawTX, process.env.ADMIN_WALLET_PRIVATE_KEY);
            // const sendedTX = await web3.eth.sendSignedTransaction(signedTrans.rawTransaction);
            // console.log("Gig Score 전송 완료", sendedTX)
            

            return res.status(200).send({ data: null, message: "Created new propose obj" })
        } catch (err) {
            console.log("Error...")
            res.status(400).send({
                data: null,
                message: "Can't run propose function",
            });
        }
    },
}