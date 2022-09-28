import { deployments, ethers } from "hardhat";
import { targetContract } from "../../helper-hardhat-config";

describe("Governor Flow", async () => {
  let governor;
  let governanceToken;
  let target;
  const voteWay = 1;
  const reason = "";
  beforeEach(async () => {
    await deployments.all();
    governor = await ethers.getContract("GigTopia");
    governanceToken = await ethers.getContract("GigToken");
    target = await ethers.getContract(`${targetContract}`);
  });
});
