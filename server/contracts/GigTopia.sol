// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";

contract GigTopia is Governor, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {
    constructor(IVotes _token)
        Governor("GigTopia")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(50)
    {}

    function votingDelay() public pure override returns (uint256) {
        return 1; // 1 block
    }

    function votingPeriod() public pure override returns (uint256) {
        return 10; // 10 block
    }

    function proposalThreshold() public pure override returns (uint256) {
        return 1;
    }

    // The following functions are overrides required by Solidity.

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getProposalId(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        pure returns(uint256) {
        return uint256(keccak256(abi.encode(targets, values, calldatas, keccak256(bytes(description)))));
    }

    function getDescriptionHash(string memory description) public pure returns(bytes32) {
        return keccak256(bytes(description));
    }

    function castVote(uint256 proposalId, address _voter, uint8 support) public returns (uint256) {
        return _castVote(proposalId, _voter, support, "");
    }
}