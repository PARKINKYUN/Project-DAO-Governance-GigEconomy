import verify from "../helper-functions";
import {
  developmentChains,
  QUORUM_PERCENTAGE,
  VOTING_PERIOD,
  VOTING_DELAY,
} from "../helper-hardhat-config";

const deployGovernorContract = async function (hre) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const moderatorNft = await get("GigModerator");
  log("Deploying...");
  const governorContract = await deploy("GigTopia", {
    from: deployer,
    args: [
      moderatorNft.address,
      QUORUM_PERCENTAGE,
      VOTING_PERIOD,
      VOTING_DELAY,
    ],
    log: true,
    waitConfirmations: 1,
  });
  log(`GovernorContract address is ${governorContract.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(governorContract.address, []);
  }
};

export default deployGovernorContract;
