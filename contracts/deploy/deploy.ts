import { deployVotingContract } from "./utils";

// An example of a basic deploy script for voting contracts
export default async function () {
  const contractType = "FPTPProposal"; // You can change this to "RCVProposal" or other types
  const eligibilityType = "TokenHoldersEligibility"; // Change this as needed
  const constructorArguments = ["0xYourTokenAddressHere", 604800]; // Example arguments: Token address and proposal length (in seconds)
  
  await deployVotingContract(contractType, eligibilityType, constructorArguments);
}
