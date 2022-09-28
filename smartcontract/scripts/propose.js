import { ethers, network } from "hardhat";
import {
  developmentChains,
  VOTING_DELAY,
  FUNC,
  PROPOSAL_DESCRIPTION,
  VALUE,
  targetContract,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-blocks";

export async function propose(
  targetContract,
  args,
  functionToCall,
  proposalDescription
) {
  const governor = await ethers.getContract("GigTopia");
  const target = await ethers.getContract(`${targetContract}`);
  const encodedFunctionCall = target.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(`Proposing ${functionToCall} on ${target.address} with ${args}`);
  console.log(`Proposal Description:\n  ${proposalDescription}`);
  const proposeTx = await governor.propose(
    [target.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }
  const proposeReceipt = await proposeTx.wait(1);
  const proposalId = proposeReceipt.events[0].args.proposalId;
  console.log(`Proposed with proposal ID:\n  ${proposalId}`);

  const proposalState = await governor.state(proposalId);
  const proposalSnapShot = await governor.proposalSnapshot(proposalId);
  const proposalDeadline = await governor.proposalDeadline(proposalId);

  console.log(`State: ${proposalState}`);
  console.log(`Snapshot: ${proposalSnapShot}`);
  console.log(`Deadline: ${proposalDeadline}`);
}

propose(targetContract, [VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
