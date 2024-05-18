// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./ResolutionTypes/FPTPProposal.sol";
import "./ResolutionTypes/RCVProposal.sol"; 
import "./ResolutionTypes/STVProposal.sol";
import "./ResolutionTypes/QVProposal.sol";
import "./ParticipantTypes/TokenHoldersEligibility.sol";
import "./ParticipantTypes/NFTHoldersEligibility.sol";
import "./ParticipantTypes/AddressEligibility.sol";

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
    error UnsupportedParticipantType();
    error UnsupportedVotingResolution();

    function createProposal(
        VotingResolution _resolution,
        VotingParticipant _participant,
        address _tokenAddress,
        address _nftAddress,
        address[] memory _eligibleAddresses
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
        } else {
            revert UnsupportedParticipantType();
        }

        // Create the appropriate voting contract
        if (_resolution == VotingResolution.FPTP) {
            proposalContract = new FPTPVoting(address(eligibilityContract));
        } else if (_resolution == VotingResolution.RCV) {
            proposalContract = new RCVElection(address(eligibilityContract));
        } else if (_resolution == VotingResolution.STV) {
            proposalContract = new STVElection(address(eligibilityContract));
        } else if (_resolution == VotingResolution.QV) {
            proposalContract = new QVElection(address(eligibilityContract));
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
