import { Provider, Wallet } from "zksync-ethers";
import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync";
import dotenv from "dotenv";
import { ethers } from "ethers";

import "@matterlabs/hardhat-zksync-node/dist/type-extensions";
import "@matterlabs/hardhat-zksync-verify/dist/src/type-extensions";

// Load env file
dotenv.config();

export const getProvider = () => {
  const rpcUrl = hre.network.config.url;
  if (!rpcUrl)
    throw `⛔️ RPC URL wasn't found in "${hre.network.name}"! Please add a "url" field to the network config in hardhat.config.ts`;

  // Initialize zkSync Provider
  const provider = new Provider(rpcUrl);
  return provider;
};

export const getWallet = (privateKey?: string) => {
  if (!privateKey) {
    // Get wallet private key from .env file
    if (!process.env.WALLET_PRIVATE_KEY)
      throw "⛔️ Wallet private key wasn't found in .env file!";
  }

  const provider = getProvider();

  // Initialize zkSync Wallet
  const wallet = new Wallet(
    privateKey ?? process.env.WALLET_PRIVATE_KEY!,
    provider,
  );

  return wallet;
};

export const verifyEnoughBalance = async (wallet: Wallet, amount: bigint) => {
  // Check if the wallet has enough balance
  const balance = await wallet.getBalance();
  if (balance < amount)
    throw `⛔️ Wallet balance is too low! Required ${ethers.formatEther(amount)} ETH, but current ${wallet.address} balance is ${ethers.formatEther(balance)} ETH`;
};

export const verifyContract = async (data: {
  address: string;
  contract: string;
  constructorArguments: string;
  bytecode: string;
}) => {
  const verificationRequestId: number = await hre.run("verify:verify", {
    ...data,
    noCompile: true,
  });
  return verificationRequestId;
};

type DeployContractOptions = {
  silent?: boolean;
  noVerify?: boolean;
  wallet?: Wallet;
};

export const deployVotingContract = async (
  contractType: string,
  eligibilityType: string,
  proposalName: string,
  proposalDescription: string,
  votingParticipant: number,
  constructorArguments: any[],
  options?: DeployContractOptions,
) => {
  const log = (message: string) => {
    if (!options?.silent) console.log(message);
  };

  log(`\nStarting deployment process of "${proposalName}", type:"${contractType}"...`);

  const wallet = options?.wallet ?? getWallet();
  const deployer = new Deployer(hre, wallet);
  const contractArtifact = await deployer
    .loadArtifact(contractType)
    .catch((error) => {
      if (
        error?.message?.includes(
          `Artifact for contract "${contractType}" not found.`,
        )
      ) {
        console.error(error.message);
        throw `⛔️ Please make sure you have compiled your contracts or specified the correct contract name!`;
      } else {
        throw error;
      }
    });

  const eligibilityArtifact = await deployer
    .loadArtifact(eligibilityType)
    .catch((error) => {
      if (
        error?.message?.includes(
          `Artifact for contract "${eligibilityType}" not found.`,
        )
      ) {
        console.error(error.message);
        throw `⛔️ Please make sure you have compiled your contracts or specified the correct eligibility contract name!`;
      } else {
        throw error;
      }
    });

  // Deploy the eligibility contract first
  log("Deploying eligibility contract...");
  const eligibilityContract = await deployer.deploy(eligibilityArtifact, constructorArguments.slice(0, 1));
  const eligibilityAddress = await eligibilityContract.getAddress();

  log(`Deployed eligibility contract at: ${eligibilityAddress}`);

  // Adjust the constructor arguments to include the deployed eligibility contract address and the new parameters
  const updatedConstructorArguments = [
    eligibilityAddress,
    constructorArguments[1], // proposalLength
    proposalName,
    proposalDescription,
    votingParticipant,
    constructorArguments[5], // candidateNames
    constructorArguments[6], // candidateDescriptions
    constructorArguments[7]  // candidatePhotos
  ];

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(
    contractArtifact,
    updatedConstructorArguments,
  );
  log(`Estimated deployment cost: ${ethers.formatEther(deploymentFee)} ETH`);

  // Check if the wallet has enough balance
  await verifyEnoughBalance(wallet, deploymentFee);

  // Deploy the main voting contract to zkSync
  log("Deploying main contract...");
  const contract = await deployer.deploy(contractArtifact, updatedConstructorArguments);
  const address = await contract.getAddress();
  const constructorArgs = contract.interface.encodeDeploy(updatedConstructorArguments);
  const fullContractSource = `${contractArtifact.sourceName}:${contractArtifact.contractName}`;

  // Display contract deployment info
  log(`\n"${contractArtifact.contractName}" was successfully deployed:`);
  log(` - Contract address: ${address}`);
  log(` - Contract source: ${fullContractSource}`);
  log(` - Encoded constructor arguments: ${constructorArgs}\n`);

  if (!options?.noVerify && hre.network.config.verifyURL) {
    log(`Requesting contract verification...`);
    await verifyContract({
      address,
      contract: fullContractSource,
      constructorArguments: constructorArgs,
      bytecode: contractArtifact.bytecode,
    });
  }

  return contract;
};
