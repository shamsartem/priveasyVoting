// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "../BaseProposal.sol";
import "../ParticipantTypes/IEligibility.sol";
import "../ParticipantTypes/EmailEligibility.sol";
import "../Types.sol";

contract FPTPProposal is BaseProposal {
    IEligibility public eligibilityContract;

    error AlreadyVoted();

    constructor(
        address _eligibilityContract,
        uint256 _proposalLength,
        string memory _proposalName,
        string memory _proposalDescription,
        Types.EligibilityType _eligibilityType,
        string[] memory _candidateNames,
        string[] memory _candidateDescriptions,
        string[] memory _candidatePhotos
    ) {
        eligibilityContract = IEligibility(_eligibilityContract);
        proposalLength = _proposalLength;
        startTime = block.timestamp;
        proposalName = _proposalName;
        proposalDescription = _proposalDescription;
        eligibilityType = _eligibilityType;
        proposalType = Types.ProposalType.FPTP;

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            addCandidate(_candidateNames[i], _candidateDescriptions[i], _candidatePhotos[i]);
        }
    }

    function isEligible(address _voter, bytes32 _votingID) public view override returns (bool) {
        return eligibilityContract.isEligible(_voter, _votingID);
    }

    function vote(uint256 _candidateId, bytes32 _votingID) public override onlyEligibleVoters(_votingID) withinVotingPeriod {
        if (hasVoted[msg.sender]) {
            revert AlreadyVoted();
        }
        if (_candidateId >= candidateCount) {
            revert Types.InvalidCandidate();
        }

        candidates[_candidateId].votes++;
        hasVoted[msg.sender] = true;

        if (eligibilityType == Types.EligibilityType.Email) {
            EmailEligibility(address(eligibilityContract)).useVotingID(_votingID);
        }
    }

    function vote(uint256[] calldata _candidateId, bytes32 _votingID) public override {}

    function declareWinner() public override {
        uint256 winningCandidateId = 0;
        uint256 winningVotes = 0;

        for (uint256 i = 0; i < candidateCount; i++) {
            if (candidates[i].votes > winningVotes) {
                winningCandidateId = i;
                winningVotes = candidates[i].votes;
            }
        }

        winnerCandidateId = winningCandidateId;
        winnerDeclared = true;
    }
}
