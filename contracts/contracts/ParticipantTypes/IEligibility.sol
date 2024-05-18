// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IEligibility {
    function isEligible(address _voter) external view returns (bool);
}
