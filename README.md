# priveasyVoting
Made with ❤️ at ZK Hack Krakow 2024

https://devfolio.co/projects/priveasyvoting-f4be

🏆 2nd Place w/ zkSync

## Deployments

### Vercel Frontend Deployment
https://priveasy-voting.vercel.app

### zkSync Sepolia
ProposalFactory: `0xEf8f786079C7c0F26d02E52A9081a9903D991ba6`

GaslessPaymaster: `0x1C16802A3EFa35cCB057D036bd683700A47aEd4e`

### Ethereum Sepolia
Proposal Factory: `0x03d8E78B6F8FCaD168c54860cC96e1F5D6AeccDB`

## Project Description

priveasyVoting is a private voting protocol designed to make creating proposals and voting on them as simple as possible for a wide range of users. With priveasyVoting, anyone can create a proposal and select between multiple options on the voting style as well as who is eligible to vote. Thanks to zkSync's Native Account Abstraction, anyone can vote - for free!

### Problems Solving
- **Public voting:** On public blockchains, voting data can be seen at any point. This reveals what individual addresses are voting for. Additionally, subsequent voters can see what prior users have voted for which can bias their decision.
- **Restrictive voting styles:** Traditionally blockchain voting models have had to stick to simplistic systems such as First Past the Post due to computational overhead incurring excessive gas costs. On zkSync, the chain is scalable enough to facilitate more complex voting types such as Ranked Choice Voting (arguably a superior voting style for determining consensus).
- **Only available for blockchain users:** In order to vote on a blockchain, users had to already have a blockchain wallet and funds to pay for the voting transaction. zkSync's native account abstraction is leveraged to allow social logins and a Gasmaster is deployed to fund their transactions. This massively lowers the barrier for entry, as users simply need an email to receive their unique voting code.

## Voting Resolution Styles

- FPTP (First Past the Post)
    -
    First Past the Post (FPTP) is a simple and straightforward voting method. Each voter selects their preferred candidate, and the candidate with the most votes wins.

    How it Works:
    - Each voter casts one vote for their preferred candidate.
    - The candidate with the highest number of votes wins.
    - If there is a tie, a tie-breaking mechanism (such as a runoff or random selection) may be used.

- RCV (Ranked Choice Voting)
    -
    Ranked Choice Voting (RCV), also known as Instant-Runoff Voting, allows voters to rank candidates in order of preference. If no candidate receives a majority of first-choice votes, the candidate with the fewest votes is eliminated, and votes for that candidate are redistributed to the voters' next choices. This process continues until a candidate receives a majority.

    How it Works:
    - Voters rank the candidates in order of preference (1st choice, 2nd choice, etc.).
    - If a candidate receives more than 50% of the first-choice votes, they win.
    - If no candidate receives a majority, the candidate with the fewest votes is eliminated.
    - Votes for the eliminated candidate are redistributed to the remaining candidates based on the voters' next choices.
    - The process repeats until a candidate receives a majority of votes.

- STV (Single Transferrable Voting)
    -
    Single Transferable Vote (STV) is a proportional representation system used for multi-winner elections. Voters rank candidates in order of preference, and candidates must reach a specified quota of votes to be elected. Surplus votes from elected candidates and votes from eliminated candidates are transferred to the remaining candidates based on voter preferences.

    How it Works:
    - Voters rank the candidates in order of preference.
    - A quota is determined based on the number of votes and the number of positions to be filled.
    - Candidates who reach the quota are elected.
    - Surplus votes from elected candidates are transferred to remaining candidates based on voter preferences.
    - If no candidate meets the quota, the candidate with the fewest votes is eliminated, and their votes are transferred.
    The process repeats until all positions are filled.

- QV (Quadratic Voting)
    -
    Quadratic Voting (QV) allows voters to express the intensity of their preferences by allocating multiple votes to a single option. The cost of each additional vote for a given option increases quadratically. This system is designed to capture voter intensity and allocate resources more efficiently.

    How it Works:
    - Voters are given a budget of voting credits.
    - Voters allocate credits to express their preferences, with the cost of each additional vote increasing quadratically (e.g., 1 vote costs 1 credit, 2 votes cost 4 credits, 3 votes cost 9 credits, etc.).
    - The total number of votes for each candidate is calculated, and the candidate with the most votes wins.


## Voting Participants

- Token Holders
    -
    User must hold a specified token to vote.
    - 1 Token = 1 Vote
- NFT Holders
    - 
    User must hold a specified NFT to vote.
    - 1 NFT = 1 Vote
- Addresses
    -
    User must be on the defined whitelist for voting.
    - 1 Address = 1 Vote
- Emails
    - 
    User receives an email that contains a unique voting code.
    - 1 Email = 1 Vote
- Open
    - 
    Voting is open for everyone, but must verify is Sybil
    - 1 WorldcoinID = 1 Vote

## Tutorial
    https://www.youtube.com/watch?v=WCNBvAhlE3M&embeds_referring_euri=https%3A%2F%2Fdevfolio.co%2F&embeds_referring_origin=https%3A%2F%2Fdevfolio.co&source_ve_path=Mjg2NjY&feature=emb_logo

### How to Use

1. Create a Proposal

    Navigate to the "Create Proposal" page.
    Fill in the proposal details such as name, description, proposal type, eligibility type, and candidate information.
    Click "Create Proposal".
    This will trigger the createProposal function on the ProposalFactory contract and deploy the proposal.

2. Vote on a Proposal

    Navigate to the "Proposals" page.
    Select the proposal you want to vote on.
    Enter your voting ID (if required, for email voters only) and select your candidate(s) based on the voting mechanism.
    Click "Submit Vote".

3. View Results

    During the voting period, minimal information is displayed to retain the private voting structure.
    
    After the voting period ends, click "Declare Winner" to finalize and view the results of the vote.

## Setup Project Locally

### Installation and Execution Process

Follow these steps to install and run the Voting dApp:
#### Prerequisites

    Node.js (v16 or later recommended)
    npm (v7 or later recommended)
    zkSync and Hardhat CLI tools
    Wallet browser extension

### Installation

#### Clone the repository:

    git clone https://github.com/your-repo/voting-dapp.git
    cd voting-dapp

#### Install dependencies:

    cd contracts
    npm install
    cd ../frontend
    npm install

#### Set up environment variables:

    Create a .env file in the contracts directory and add the following:

    WALLET_PRIVATE_KEY=your_private_key

#### Compilation

    cd contracts
    npx hardhat compile

#### Deployment

Deploy the ProposalFactory contract:

    npx hardhat run --network zkSyncSepoliaTestnet deploy/deployFactory.ts

Deploy the GeneralPaymaster contract:

    npx hardhat run --network zkSyncSepoliaTestnet deploy/deployPaymaster.ts

Fund the GeneralPaymaster contract:

    Transfer ETH to the deployed GeneralPaymaster contract    

#### Running the Frontend

    cd frontend
    npm run dev

    Open your browser and navigate to http://localhost:3000.

## Future Development Ideas
- Privacy integration with zkSync's upcoming Validiums
- Integration of L1 contracts to react to voting results
- Add on-chain execution of logic from proposals
- Ability to send unique voting codes through other methods such as via Social Media or SMS
- Allow for multiple types of voter eligibility in the same proposal
- Additional voting styles like AV (Approval Voting) & CV (Cumulative Voting)
- Integrate automated contract callers such as Gelato/Chainlink to call `getWinners` and finalize the proposal results
- Add restrictions on GaslessPaymaster for deployed proposals
- Support for mobile devices
- Integrated support for uploading to IPFS through the website
