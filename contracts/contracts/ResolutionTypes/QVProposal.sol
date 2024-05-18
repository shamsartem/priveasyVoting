// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "../BaseProposal.sol";
import "../ParticipantTypes/IEligibility.sol";
import "../ParticipantTypes/EmailEligibility.sol";
import "../Types.sol";

contract QVProposal is BaseProposal {
    IEligibility public eligibilityContract;

    error AlreadyVoted();
    error InsufficientCredits();

    mapping(address => uint256) public voterCredits;
    mapping(uint256 => uint256) public candidateVoteCounts;

    uint256 public constant INITIAL_CREDITS = 100; // Each voter gets 100 voting credits

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

    // Placeholder function, QV requires allocating points to multiple _candidateIds
    function vote(uint256 _candidateId, bytes32 _votingID) public override {}
    
    // Placeholder function, QV requires allocating points to multiple _candidateIds
    function voteMulti(uint256[] calldata _candidateIds, bytes32 _votingID) public override {}

    function voteQuadratic(uint256 _candidateId, uint256 _numVotes, bytes32 _votingID) public override onlyEligibleVoters(_votingID) withinVotingPeriod {
        if (hasVoted[msg.sender]) {
            revert AlreadyVoted();
        }
        if (_candidateId >= candidateCount) {
            revert Types.InvalidCandidate();
        }

        uint256 cost = _numVotes * _numVotes; // Quadratic cost
        if (voterCredits[msg.sender] < cost) {
            revert InsufficientCredits();
        }

        voterCredits[msg.sender] -= cost;
        candidateVoteCounts[_candidateId] += _numVotes;
        candidates[_candidateId].votes += _numVotes; // Accumulate votes for the candidate

        hasVoted[msg.sender] = true;

        if (eligibilityType == Types.EligibilityType.Email) {
            EmailEligibility(address(eligibilityContract)).useVotingID(_votingID);
        }
    }

    function declareWinner() public override {
        require(hasVotingEnded(), "Voting period has not ended yet");

        uint256 winningCandidateId = 0;
        uint256 winningVotes = 0;

        for (uint256 i = 0; i < candidateCount; i++) {
            if (candidateVoteCounts[i] > winningVotes) {
                winningCandidateId = i;
                winningVotes = candidateVoteCounts[i];
            }
        }

        winnerCandidateId = winningCandidateId;
        winnerDeclared = true;
    }
}
