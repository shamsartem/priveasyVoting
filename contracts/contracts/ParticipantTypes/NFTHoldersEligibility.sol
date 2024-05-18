// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./IEligibility.sol";

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
}

contract NFTHoldersEligibility is IEligibility {
    IERC721 public nft;

    constructor(address _nftAddress) {
        nft = IERC721(_nftAddress);
    }

    function isEligible(address _voter) external view override returns (bool) {
        return nft.balanceOf(_voter) > 0;
    }
}
