import verify from "../helper-functions";
import { developmentChains } from "../helper-hardhat-config";
import { ethers } from "hardhat";

const deployGigScoreToken = async function (hre) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying...");
  const gigScoreToken = await deploy("GigScore", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });
  log(`Token address is ${gigScoreToken.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(gigScoreToken.address, []);
  }
};

export default deployGigScoreToken;
