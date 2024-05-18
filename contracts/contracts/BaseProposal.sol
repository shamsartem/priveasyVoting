// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// Base contract for voting containing the basic logic for voting shared by all voting types
abstract contract BaseProposal {
    struct Candidate {
        string name;
        string photo;
        uint256 votes;
    }

    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount;

    enum VotingParticipant { TokenHolders, NFTHolders, Address, Email, Open }
    VotingParticipant public votingParticipant;

    mapping(address => bool) public hasVoted;

	error NotEligibleToVote();

	modifier onlyEligibleVoters() {
		if (!isEligible(msg.sender)) {
			revert NotEligibleToVote();
		}
		_;
	}

    function setVotingParticipant(VotingParticipant _votingParticipant) public {
        votingParticipant = _votingParticipant;
    }

    function addCandidate(string memory _name, string memory _photo) public {
        candidates[candidateCount] = Candidate(_name, _photo, 0);
        candidateCount++;
    }

    function isEligible(address _voter) public view virtual returns (bool);

    function vote(uint256 _candidateId, bytes32 _votingID) public virtual {};

    function getCandidate(uint256 _candidateId) public view returns (string memory, string memory, uint256) {
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.photo, candidate.votes);
    }
}
