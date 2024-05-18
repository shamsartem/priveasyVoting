import { deployVotingContract } from "./utils";
import { ethers } from "ethers";

// Main deployment function
export default async function main() {
  console.log("Starting deployment...");

  const contractType = "FPTPProposal";
  const eligibilityType = "TokenHoldersEligibility";

  const proposalName = "Test Proposal";
  const proposalDescription = "This is a test proposal";
  const votingParticipant = 0; // TokenHolders

  const tokenAddress = "0x7E2026D8f35872923F5459BbEDDB809F6aCEfEB3"; // TEST
  const proposalLength = 3600; // Proposal length in seconds

  // Example candidate data
  const candidateNames = ["Alice", "Bob"];
  const candidateDescriptions = ["Candidate Alice loves Cake", "Candidate Bob loves Pie"];
  const candidatePhotos = [
    "ipfs://QmZfCpgKQq1kMwzHD1R2SFVNtJLSrATFnbu8EvXmVcWD5E/27138ad7-5088-4c61-8043-239ede78977d.webp", // Replace with actual IPFS link
    "ipfs://QmPaZQT9kBM5K8cPRVZNB9qaw2FgAzUDzEJZkwrMdck7bt/f6de0125-24a7-47ef-bfdb-8d136c5f1f37.webp", // Replace with actual IPFS link
  ];

  const constructorArguments = [
    tokenAddress,
    proposalLength,
    proposalName,
    proposalDescription,
    votingParticipant,
    candidateNames,
    candidateDescriptions,
    candidatePhotos,
  ];

  console.log("Deploying contract with the following parameters:");
  console.log(`Contract Type: ${contractType}`);
  console.log(`Eligibility Type: ${eligibilityType}`);
  console.log(`Proposal Name: ${proposalName}`);
  console.log(`Proposal Description: ${proposalDescription}`);
  console.log(`Constructor Arguments: ${constructorArguments}`);

  try {
    console.log("Attempting to deploy the contract...");
    const contract = await deployVotingContract(
      contractType,
      eligibilityType,
      proposalName,
      proposalDescription,
      votingParticipant,
      constructorArguments
    );
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
