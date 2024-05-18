// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./ResolutionTypes/FPTPProposal.sol";
import "./ResolutionTypes/RCVProposal.sol";
import "./ResolutionTypes/STVProposal.sol";
import "./ResolutionTypes/QVProposal.sol";
import "./ParticipantTypes/IEligibility.sol";
import "./ParticipantTypes/TokenHoldersEligibility.sol";
import "./ParticipantTypes/NFTHoldersEligibility.sol";
import "./ParticipantTypes/AddressEligibility.sol";
import "./ParticipantTypes/EmailEligibility.sol";
import "./Types.sol";

contract ProposalFactory {
    using Types for *;

    event ProposalDeployed(address proposalAddress);

    function createProposal(
        Types.ProposalType _proposalType,
        Types.EligibilityType _eligibilityType,
        address _tokenAddress,
        uint256 _proposalLength,
        string memory _proposalName,
        string memory _proposalDescription,
        string[] memory _candidateNames,
        string[] memory _candidateDescriptions,
        string[] memory _candidatePhotos,
        address[] memory _eligibleAddresses,
        bytes32[] memory _votingIDs
    ) public returns (address) {
        IEligibility eligibilityContract;
        
        // Deploy eligibility contract based on the selected type
        if (_eligibilityType == Types.EligibilityType.TokenHolders) {
            eligibilityContract = new TokenHoldersEligibility(_tokenAddress);
        } else if (_eligibilityType == Types.EligibilityType.NFTHolders) {
            eligibilityContract = new NFTHoldersEligibility(_tokenAddress);
        } else if (_eligibilityType == Types.EligibilityType.Address) {
            eligibilityContract = new AddressEligibility(_eligibleAddresses);
        } else if (_eligibilityType == Types.EligibilityType.Email) {
            eligibilityContract = new EmailEligibility(_votingIDs);
        } else {
            revert Types.InvalidEligibilityType();
        }

        address proposalContract;
        
        // Deploy the selected proposal type contract
        if (_proposalType == Types.ProposalType.FPTP) {
            proposalContract = address(new FPTPProposal(
                address(eligibilityContract),
                _proposalLength,
                _proposalName,
                _proposalDescription,
                _eligibilityType,
                _candidateNames,
                _candidateDescriptions,
                _candidatePhotos
            ));
        } else if (_proposalType == Types.ProposalType.RCV) {
            proposalContract = address(new RCVProposal(
                address(eligibilityContract),
                _proposalLength,
                _proposalName,
                _proposalDescription,
                _eligibilityType,
                _candidateNames,
                _candidateDescriptions,
                _candidatePhotos
            ));
        } else if (_proposalType == Types.ProposalType.STV) {
            proposalContract = address(new STVProposal(
                address(eligibilityContract),
                _proposalLength,
                _proposalName,
                _proposalDescription,
                _eligibilityType,
                _candidateNames,
                _candidateDescriptions,
                _candidatePhotos
            ));
        } else if (_proposalType == Types.ProposalType.QV) {
            proposalContract = address(new QVProposal(
                address(eligibilityContract),
                _proposalLength,
                _proposalName,
                _proposalDescription,
                _eligibilityType,
                _candidateNames,
                _candidateDescriptions,
                _candidatePhotos
            ));
        } else {
            revert Types.InvalidProposalType();
        }

        emit ProposalDeployed(proposalContract);
        return proposalContract;
    }
}
