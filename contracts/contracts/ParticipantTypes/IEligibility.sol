//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface IEligibility {
    function isEligible(address _voter, bytes32 _votingID) external view returns (bool);
}
