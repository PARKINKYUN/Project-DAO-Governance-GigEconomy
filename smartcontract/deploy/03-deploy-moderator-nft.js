import verify from "../helper-functions";
import { developmentChains } from "../helper-hardhat-config";

const deployModeratorNft = async function (hre) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying...");
  const moderatorNft = await deploy("GigModerator", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });
  log(`Token address is ${moderatorNft.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(moderatorNft.address, []);
  }
};

export default deployModeratorNft;
