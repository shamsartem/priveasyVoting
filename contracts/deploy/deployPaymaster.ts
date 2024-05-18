import { deployPaymasterContract } from "./utils";

// Main deployment function
export default async function main() {
  console.log("Starting deployment...");

  try {
    console.log("Attempting to deploy the GeneralPaymaster contract...");
    const contract = await deployPaymasterContract();
    const address = await contract.getAddress();
    console.log(`GeneralPaymaster contract deployed at address: ${address}`);
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main().catch((error) => {
  console.error("Unexpected error in deployment script:", error);
  process.exit(1);
});
