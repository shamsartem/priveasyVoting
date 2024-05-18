import { deployVotingContract } from "./utils";
import { ethers } from "ethers";

// Main deployment function
export default async function () {
  // Options for contract types
  const contractTypes = ["FPTPProposal", "RCVProposal", "STVProposal", "QVProposal"];
  
  // Options for eligibility types
  const eligibilityTypes = ["TokenHoldersEligibility", "NFTHoldersEligibility", "AddressEligibility", "EmailEligibility"];
  
  // Select contract type
  const contractType = contractTypes[0]; // Change index to select different contract types
  
  // Select eligibility type
  const eligibilityType = eligibilityTypes[0]; // Change index to select different eligibility types

  // Constructor Arguments
  const tokenAddress = "0xYourTokenAddressHere";
  const nftAddress = "0xYourNFTAddressHere";
  const proposalLength = 604800; // Proposal length in seconds
  const eligibleAddresses = ["0xAddress1", "0xAddress2", "0xAddress3"];
  const eligibleEmails = ["email1@example.com", "email2@example.com", "email3@example.com"];

  // Construct constructor arguments dynamically
  let constructorArguments: any[] = [];
  
  if (eligibilityType === "TokenHoldersEligibility") {
    constructorArguments = [tokenAddress, proposalLength];
  } else if (eligibilityType === "NFTHoldersEligibility") {
    constructorArguments = [nftAddress, proposalLength];
  } else if (eligibilityType === "AddressEligibility") {
    constructorArguments = [eligibleAddresses, proposalLength];
  } else if (eligibilityType === "EmailEligibility") {
    const votingIDs = eligibleEmails.map(email => ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["string", "uint256"], [email, Date.now()])));
    constructorArguments = [votingIDs, proposalLength];
  }

  // Deploy the contract
  await deployVotingContract(contractType, eligibilityType, constructorArguments);
}
