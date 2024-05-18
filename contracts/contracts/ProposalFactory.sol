// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./ResolutionTypes/FPTPProposal.sol";
import "./ResolutionTypes/RCVProposal.sol"; 
import "./ResolutionTypes/STVProposal.sol";
import "./ResolutionTypes/QVProposal.sol";
import "./ParticipantTypes/TokenHoldersEligibility.sol";
import "./ParticipantTypes/NFTHoldersEligibility.sol";
import "./ParticipantTypes/AddressEligibility.sol";
import "./ParticipantTypes/EmailEligibility.sol";

contract ProposalFactory {
    enum VotingResolution { FPTP, RCV, STV, QV }
    enum VotingParticipant { TokenHolders, NFTHolders, Address }

    struct ProposalInstance {
        address contractAddress;
        VotingResolution resolution;
        VotingParticipant participant;
    }

    ProposalInstance[] public proposalInstances;

    event ProposalCreated(address indexed contractAddress, VotingResolution resolution, VotingParticipant participant);

    error TokenAddressRequired();
    error NFTAddressRequired();
    error EligibleAddressesRequired();
    error EligibleEmailsRequired();
    error UnsupportedParticipantType();
    error UnsupportedVotingResolution();

    function createProposal(
        VotingResolution _resolution,
        VotingParticipant _participant,
        uint256 _proposalLength,
        address _tokenAddress,
        address _nftAddress,
        address[] memory _eligibleAddresses,
        string[] memory _eligibleEmails
    ) public {
        BaseProposal proposalContract;
        IEligibility eligibilityContract;

        // Create the appropriate eligibility contract
        if (_participant == VotingParticipant.TokenHolders) {
            if (_tokenAddress == address(0)) revert TokenAddressRequired();
            eligibilityContract = new TokenHoldersEligibility(_tokenAddress);
        } else if (_participant == VotingParticipant.NFTHolders) {
            if (_nftAddress == address(0)) revert NFTAddressRequired();
            eligibilityContract = new NFTHoldersEligibility(_nftAddress);
        } else if (_participant == VotingParticipant.Address) {
            if (_eligibleAddresses.length == 0) revert EligibleAddressesRequired();
            eligibilityContract = new AddressEligibility(_eligibleAddresses);
        } else if (_participant == VotingParticipant.Email) {
            if (_eligibleEmails.length == 0) revert EligibleEmailsRequired();
            bytes32[] memory votingIDs = new bytes32[](_eligibleEmails.length);
            for (uint256 i = 0; i < _eligibleEmails.length; i++) {
                votingIDs[i] = keccak256(abi.encodePacked(_eligibleEmails[i], block.timestamp));
            }
            eligibilityContract = new EmailEligibility(votingIDs);
        } else {
            revert UnsupportedParticipantType();
        }

        // Create the appropriate voting contract
        if (_resolution == VotingResolution.FPTP) {
            proposalContract = new FPTPProposal(address(eligibilityContract, _proposalLength));
        } else if (_resolution == VotingResolution.RCV) {
            proposalContract = new RCVProposal(address(eligibilityContract, _proposalLength));
        } else if (_resolution == VotingResolution.STV) {
            proposalContract = new STVProposal(address(eligibilityContract, _proposalLength));
        } else if (_resolution == VotingResolution.QV) {
            proposalContract = new QVProposal(address(eligibilityContract, _proposalLength));
        } else {
            revert UnsupportedVotingResolution();
        }

        ProposalInstance memory instance = ProposalInstance({
            contractAddress: address(proposalContract),
            resolution: _resolution,
            participant: _participant
        });

        proposalInstances.push(instance);
        emit ProposalCreated(address(proposalContract), _resolution, _participant);
    }

    function getProposalInstances() public view returns (ProposalInstance[] memory) {
        return proposalInstances;
    }
}
