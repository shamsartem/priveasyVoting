// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

library Types {
    enum ProposalType { FPTP, RCV, STV, QV }
    enum EligibilityType { TokenHolders, NFTHolders, Address, Email, Open }

    error InvalidProposalType();
    error InvalidEligibilityType();
    error InvalidCandidate();
}
