//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "../BaseProposal.sol";
import "../ParticipantTypes/IEligibility.sol";
import "../ParticipantTypes/EmailEligibility.sol";

contract QVProposal is BaseProposal {
    IEligibility public eligibilityContract;

    error AlreadyVoted();
    error InvalidCandidate();

    constructor(
        address _eligibilityContract,
        uint256 _proposalLength,
        string memory _proposalName,
        string memory _proposalDescription
        ) {
        eligibilityContract = IEligibility(_eligibilityContract);
        proposalLength = _proposalLength;
        startTime = block.timestamp;
        proposalName = _proposalName;
        proposalDescription = _proposalDescription;
    }

        function isEligible(address _voter, bytes32 _votingID) public view override returns (bool) {
        return eligibilityContract.isEligible(_voter, _votingID);
    }

    function vote(uint256 _candidateId, bytes32 _votingID) public override onlyEligibleVoters(_votingID) withinVotingPeriod {
        if (hasVoted[msg.sender]) {
            revert AlreadyVoted();
        }
        if (_candidateId >= candidateCount) {
            revert InvalidCandidate();
        }

        // TODO: Implement QV voting logic
    }

    function declareWinner() public override {}

}