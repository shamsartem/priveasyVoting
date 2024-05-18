//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./IEligibility.sol";

contract EmailEligibility is IEligibility {
    mapping(bytes32 => bool) public validVotingIDs;
    mapping(bytes32 => bool) public usedVotingIDs;
    address public admin;
    bool public isEmailEligibility;

    error InvalidVotingID(bytes32 votingID);
    error VotingIDAlreadyUsed(bytes32 votingID);

    constructor(bytes32[] memory _initialVotingIDs) {
        admin = msg.sender;
        isEmailEligibility = true;
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
        if (!validVotingIDs[_votingID]) {
            revert InvalidVotingID(_votingID);
        }
        if (usedVotingIDs[_votingID]) {
            revert VotingIDAlreadyUsed(_votingID);
        }
        usedVotingIDs[_votingID] = true;
    }
}
