import IERC20 from "./FPTPProposal.json";
import ProposalFactory from "./ProposalFactory.json";
import BaseProposal from "./BaseProposal.json";

export const erc20ABI = IERC20;

export const contractConfig = {
  address: "0x863156066e319DD982fc0804B0a8647086E6EdEc", // zkSync Era Sepolia Testnet DAI token address
  abi: erc20ABI,
} as const;

export const proposalFactoryAbi = ProposalFactory.abi;

export const proposalFactory = {
  address: "0x065efaB1B2c49d1170ECF0d3F2B9327850904842",
  abi: ProposalFactory.abi,
} as const;

export const baseProposalAbi = BaseProposal.abi;
