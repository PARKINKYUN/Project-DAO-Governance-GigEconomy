import verify from "../helper-functions";
import { networkConfig, developmentChains } from "../helper-hardhat-config";
import { ethers } from "hardhat";

const deployGigToken = async function (hre) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying...");
  const gigToken = await deploy("GigToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });
  log(`Token address is ${gigToken.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(gigToken.address, []);
  }
};

export default deployGigToken;
