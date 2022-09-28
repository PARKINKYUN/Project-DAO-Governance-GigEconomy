import { network } from "hardhat";

export async function moveTime(amount) {
  console.log("Moving blocks...");
  await network.provider.send("evm_increaseTime", [amount]);

  console.log("Done");
}
