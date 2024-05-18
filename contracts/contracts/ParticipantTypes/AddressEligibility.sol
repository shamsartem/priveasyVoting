//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./IEligibility.sol";

contract AddressEligibility is IEligibility {
    mapping(address => bool) public eligibleAddresses;
    address public admin;

    error OnlyAdminCanPerformAction();

    modifier onlyAdmin() {
        if (msg.sender != admin) {
            revert OnlyAdminCanPerformAction();
        }
        _;
    }

    constructor(address[] memory _initialAddresses) {
        admin = msg.sender;
        for (uint256 i = 0; i < _initialAddresses.length; i++) {
            eligibleAddresses[_initialAddresses[i]] = true;
        }
    }

    function addAddress(address _address) external onlyAdmin {
        eligibleAddresses[_address] = true;
    }

    function removeAddress(address _address) external onlyAdmin {
        eligibleAddresses[_address] = false;
    }

    function isEligible(address _voter, bytes32) external view override returns (bool) {
        return eligibleAddresses[_voter];
    }
}
