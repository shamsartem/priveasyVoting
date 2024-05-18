// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "../BaseProposal.sol";
import "../ParticipantTypes/IEligibility.sol";
import "../ParticipantTypes/EmailEligibility.sol";

contract FPTPProposal is BaseProposal {
    IEligibility public eligibilityContract;

    constructor(
        address _eligibilityContract,
        uint256 _proposalLength,
        string memory _proposalName,
        string memory _proposalDescription,
        VotingParticipant _votingParticipant,
        string[] memory _candidateNames,
        string[] memory _candidateDescriptions,
        string[] memory _candidatePhotos
    )
        BaseProposal(_proposalName, _proposalDescription, _votingParticipant, _candidateNames, _candidateDescriptions, _candidatePhotos)
    {
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

        // Check if the eligibility contract is EmailEligibility by reading the state variable
        if (isEmailEligibilityContract()) {
            EmailEligibility(address(eligibilityContract)).useVotingID(_votingID);
        }
    }

    function isEmailEligibilityContract() internal view returns (bool) {
        // Check if the eligibility contract has the isEmailEligibility variable set to true
        try EmailEligibility(address(eligibilityContract)).isEmailEligibility() returns (bool isEmail) {
            return isEmail;
        } catch {
            return false;
        }
    }

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
