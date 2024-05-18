// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

// Base contract for voting containing the basic logic for voting shared by all voting types
abstract contract BaseProposal {
    struct Candidate {
        string name;
        string description;
        string photo;
        uint256 votes;
    }

    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount;

    enum VotingParticipant { TokenHolders, NFTHolders, Address, Email, Open }
    VotingParticipant public votingParticipant;

    mapping(address => bool) public hasVoted;

    uint256 public proposalLength;
    uint256 public startTime;

    uint256 public winnerCandidateId;
    bool public winnerDeclared;

    string public proposalName;
    string public proposalDescription;

    address public admin;

    error AlreadyVoted();
    error NotEligibleToVote();
    error VotingPeriodOver();
    error WinnerAlreadyDeclared();
    error WinnerNotDeclared();
    error InvalidVote();
    error NotAuthorized();
    error InvalidCandidate();
    error CandidateDataLengthMismatch();

    modifier onlyAdmin() {
        if (msg.sender != admin) {
            revert NotAuthorized();
        }
        _;
    }

    modifier withinVotingPeriod() {
        if (block.timestamp > startTime + proposalLength) {
            revert VotingPeriodOver();
        }
        _;
    }

    modifier onlyEligibleVoters(bytes32 _votingID) {
        if (!isEligible(msg.sender, _votingID)) {
            revert NotEligibleToVote();
        }
        _;
    }

    constructor(
        string memory _proposalName,
        string memory _proposalDescription,
        VotingParticipant _votingParticipant,
        string[] memory _candidateNames,
        string[] memory _candidateDescriptions,
        string[] memory _candidatePhotos
    ) {
        if (_candidateNames.length != _candidateDescriptions.length || _candidateNames.length != _candidatePhotos.length) {
            revert CandidateDataLengthMismatch();
        }

        admin = msg.sender;
        proposalName = _proposalName;
        proposalDescription = _proposalDescription;
        votingParticipant = _votingParticipant;

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates[candidateCount] = Candidate({
                name: _candidateNames[i],
                description: _candidateDescriptions[i],
                photo: _candidatePhotos[i],
                votes: 0
            });
            candidateCount++;
        }
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
