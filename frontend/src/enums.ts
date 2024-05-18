export enum ProposalType {
  FPTP,
  RCV,
  STV,
  QV,
}
export const pollTypeNames: Record<ProposalType, string> = {
  [ProposalType.FPTP]: "First Past The Post",
  [ProposalType.RCV]: "Ranked Choice",
  [ProposalType.STV]: "Single Transferable Vote",
  [ProposalType.QV]: "Quadratic Voting",
};
export enum EligibilityType {
  TokenHolders,
  NFTHolders,
  Address,
  Emails,
}
export const votingParticipantsNames: Record<EligibilityType, string> = {
  [EligibilityType.TokenHolders]: "Token Holders",
  [EligibilityType.NFTHolders]: "NFT Holders",
  [EligibilityType.Address]: "Address",
  [EligibilityType.Emails]: "Emails",
};
