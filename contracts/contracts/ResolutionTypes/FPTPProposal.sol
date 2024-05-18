// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../BaseProposal.sol";
import "../ParticipantTypes/IEligibility.sol";
import "../ParticipantTypes/EmailEligibility.sol";

contract FPTPProposal is BaseProposal {
    IEligibility public eligibilityContract;

    error AlreadyVoted();
    error InvalidCandidate();

    constructor(address _eligibilityContract, uint256 _proposalLength) {
        eligibilityContract = IEligibility(_eligibilityContract);
        proposalLength = _proposalLength;
        startTime = block.timestamp;
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

        candidates[_candidateId].votes++;
        hasVoted[msg.sender] = true;

        // Mark voting ID as used if it's an email-based voting ID
        if (address(eligibilityContract) == address(EmailEligibility)) {
            EmailEligibility(address(eligibilityContract)).useVotingID(_votingID);
        }
    }
}
