import { deployProposalFactory } from "./utils";

// Main deployment function
export default async function main() {
  console.log("Starting deployment...");

  try {
    console.log("Attempting to deploy the ProposalFactory contract...");
    const contract = await deployProposalFactory();
    const address = await contract.getAddress();
    console.log(`ProposalFactory contract deployed at address: ${address}`);
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main().catch((error) => {
  console.error("Unexpected error in deployment script:", error);
  process.exit(1);
});
