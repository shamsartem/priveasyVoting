import { deployVotingContract } from "./utils";
import { ethers } from "ethers";

// Main deployment function
export default async function () {
  const contractType = "FPTPProposal";
  const eligibilityType = "TokenHoldersEligibility";

  const tokenAddress = "0x7E2026D8f35872923F5459BbEDDB809F6aCEfEB3"; //TEST
  const proposalLength = 300; // Proposal length in seconds

  const constructorArguments = [tokenAddress, proposalLength];

  await deployVotingContract(contractType, eligibilityType, constructorArguments);
}
