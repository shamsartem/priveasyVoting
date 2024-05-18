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

contract ProposalFactory {
    enum ProposalType { FPTP, RCV, STV, QV }
    enum EligibilityType { TokenHolders, NFTHolders, Address, Email }

    error InvalidProposalType();
    error InvalidEligibilityType();

    function createProposal(
        ProposalType _proposalType,
        EligibilityType _eligibilityType,
        address _tokenAddress,
        uint256 _proposalLength,
        string memory _proposalName,
        string memory _proposalDescription,
        BaseProposal.VotingParticipant _votingParticipant,
        string[] memory _candidateNames,
        string[] memory _candidateDescriptions,
        string[] memory _candidatePhotos,
        address[] memory _eligibleAddresses,
        bytes32[] memory _votingIDs
    ) public returns (address) {
        IEligibility eligibilityContract;
        
        // Deploy eligibility contract based on the selected type
        if (_eligibilityType == EligibilityType.TokenHolders) {
            eligibilityContract = new TokenHoldersEligibility(_tokenAddress);
        } else if (_eligibilityType == EligibilityType.NFTHolders) {
            eligibilityContract = new NFTHoldersEligibility(_tokenAddress);
        } else if (_eligibilityType == EligibilityType.Address) {
            eligibilityContract = new AddressEligibility(_eligibleAddresses);
        } else if (_eligibilityType == EligibilityType.Email) {
            eligibilityContract = new EmailEligibility(_votingIDs);
        } else {
            revert InvalidEligibilityType();
        }

        address proposalContract;
        
        // Deploy the selected proposal type contract
        if (_proposalType == ProposalType.FPTP) {
            proposalContract = address(new FPTPProposal(
                address(eligibilityContract),
                _proposalLength,
                _proposalName,
                _proposalDescription,
                _votingParticipant,
                _candidateNames,
                _candidateDescriptions,
                _candidatePhotos
            ));
        } else if (_proposalType == ProposalType.RCV) {
            proposalContract = address(new RCVProposal(
                address(eligibilityContract),
                _proposalLength,
                _proposalName,
                _proposalDescription,
                _votingParticipant,
                _candidateNames,
                _candidateDescriptions,
                _candidatePhotos
            ));
        } else if (_proposalType == ProposalType.STV) {
            proposalContract = address(new STVProposal(
                address(eligibilityContract),
                _proposalLength,
                _proposalName,
                _proposalDescription,
                _votingParticipant,
                _candidateNames,
                _candidateDescriptions,
                _candidatePhotos
            ));
        } else if (_proposalType == ProposalType.QV) {
            proposalContract = address(new QVProposal(
                address(eligibilityContract),
                _proposalLength,
                _proposalName,
                _proposalDescription,
                _votingParticipant,
                _candidateNames,
                _candidateDescriptions,
                _candidatePhotos
            ));
        } else {
            revert InvalidProposalType();
        }

        return proposalContract;
    }
}
