// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./IEligibility.sol";

contract EmailEligibility is IEligibility {
    mapping(bytes32 => bool) public validVotingIDs;
    mapping(bytes32 => bool) public usedVotingIDs;
    address public admin;

    constructor(bytes32[] memory _initialVotingIDs) {
        admin = msg.sender;
        for (uint256 i = 0; i < _initialVotingIDs.length; i++) {
            validVotingIDs[_initialVotingIDs[i]] = true;
        }
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function addVotingID(bytes32 _votingID) external onlyAdmin {
        require(!validVotingIDs[_votingID], "Voting ID already exists");
        validVotingIDs[_votingID] = true;
    }

    function removeVotingID(bytes32 _votingID) external onlyAdmin {
        require(validVotingIDs[_votingID], "Voting ID does not exist");
        validVotingIDs[_votingID] = false;
    }

    function isEligible(address, bytes32 _votingID) external view override returns (bool) {
        return validVotingIDs[_votingID] && !usedVotingIDs[_votingID];
    }

    function useVotingID(bytes32 _votingID) external {
        require(validVotingIDs[_votingID], "Invalid voting ID");
        require(!usedVotingIDs[_votingID], "Voting ID already used");
        usedVotingIDs[_votingID] = true;
    }
}
