// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./IEligibility.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract TokenHoldersEligibility is IEligibility {
    IERC20 public token;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function isEligible(address _voter) external view override returns (bool) {
        return token.balanceOf(_voter) > 0;
    }
}
