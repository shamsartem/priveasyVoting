// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./Types.sol";

abstract contract BaseProposal {
    struct Candidate {
        string name;
        string description;
        string photo;
        uint256 votes;
    }

    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount;

    Types.EligibilityType public eligibilityType;

    mapping(address => bool) public hasVoted;

    uint256 public proposalLength;
    uint256 public startTime;

    uint256 public winnerCandidateId;
    bool public winnerDeclared;

    string public proposalName;
    string public proposalDescription;

    error NotEligibleToVote();
    error VotingPeriodOver();
    error WinnerAlreadyDeclared();
    error WinnerNotDeclared();
    error InvalidVote();
    error AlreadyVoted();

    modifier onlyEligibleVoters(bytes32 _votingID) {
        if (!isEligible(msg.sender, _votingID)) {
            revert NotEligibleToVote();
        }
        _;
    }

    modifier withinVotingPeriod() {
        if (block.timestamp > startTime + proposalLength) {
            revert VotingPeriodOver();
        }
        _;
    }

    function addCandidate(string memory _name, string memory _description, string memory _photo) public {
        candidates[candidateCount] = Candidate(_name, _description, _photo, 0);
        candidateCount++;
    }

    function isEligible(address _voter, bytes32 _votingID) public view virtual returns (bool);

    function vote(uint256 _candidateId, bytes32 _votingID) public virtual;

    function getCandidate(uint256 _candidateId) public view returns (string memory, string memory, string memory, uint256) {
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.description, candidate.photo, candidate.votes);
    }
    
    function hasVotingEnded() public view returns (bool) {
        return block.timestamp > startTime + proposalLength;
    }

    function declareWinner() public virtual;

    function getWinner() public view returns (uint256) {
        if (!winnerDeclared) {
            revert WinnerNotDeclared();
        }
        return winnerCandidateId;
    }
}
