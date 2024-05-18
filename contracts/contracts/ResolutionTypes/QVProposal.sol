// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "../BaseProposal.sol";
import "../ParticipantTypes/IEligibility.sol";
import "../ParticipantTypes/EmailEligibility.sol";
import "../Types.sol";

contract QVProposal is BaseProposal {
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
        proposalType = Types.ProposalType.QV;

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

        // TODO: Implement QV voting logic

        hasVoted[msg.sender] = true;

        if (eligibilityType == Types.EligibilityType.Email) {
            EmailEligibility(address(eligibilityContract)).useVotingID(_votingID);
        }
    }

    function declareWinner() public override {
        // TODO: Implement QV winner declaration logic
    }
}
