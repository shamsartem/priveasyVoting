import { deployVotingContract } from "./utils";
import { ethers } from "ethers";

// Main deployment function
export default async function main() {
  console.log("Starting deployment...");

  const contractType = "FPTPProposal";
  const eligibilityType = "TokenHoldersEligibility";

  const proposalName = "Test Proposal";
  const proposalDescription = "This is a test proposal";

  const tokenAddress = "0x7E2026D8f35872923F5459BbEDDB809F6aCEfEB3"; // TEST
  const proposalLength = 300; // Proposal length in seconds

  const constructorArguments = [tokenAddress, proposalLength];

  console.log("Deploying contract with the following parameters:");
  console.log(`Contract Type: ${contractType}`);
  console.log(`Eligibility Type: ${eligibilityType}`);
  console.log(`Proposal Name: ${proposalName}`);
  console.log(`Proposal Description: ${proposalDescription}`);
  console.log(`Constructor Arguments: ${constructorArguments}`);

  try {
    console.log("Attempting to deploy the contract...");
    const contract = await deployVotingContract(contractType, eligibilityType, proposalName, proposalDescription, constructorArguments);
    const address = await contract.getAddress();
    console.log(`Contract deployed at address: ${address}`);
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main().catch((error) => {
  console.error("Unexpected error in deployment script:", error);
  process.exit(1);
});
