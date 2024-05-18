import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { PageWrapper } from "../components/PageWrapper.js";
import { RequireConnectedWallet } from "../components/RequireConnectedWallet.js";
import { useNavigate, useParams, Link } from "react-router-dom";
import { EligibilityType, ProposalType, proposalTypeNames } from "../enums.js";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import { Contract } from "zksync-ethers";
import { useAsync } from "../hooks/useAsync";
import { contractConfig } from "../contracts/contracts.js";
import { useEthereum } from "../components/Context";
import { TxInfo } from "../components/TxInfo.js";
import { baseProposalAbi } from "../contracts/contracts";
import { DateTimePicker } from "@mui/x-date-pickers";
import { times } from "lodash";
import { ethers } from "ethers";
import LinkMaterial from "@mui/material/Link";

type CandidateWithVotes = {
  name: string;
  description: string;
  photo: string;
  votes: number;
};

type Proposal = {
  proposalName: string;
  proposalDescription: string;
  proposalType: ProposalType;
  proposalLength: number;
  startTime: number;
  candidates: CandidateWithVotes[];
};

type Loading = null;
type NotEligible = undefined;
type AlreadyVoted = false;

export function Vote() {
  let { id } = useParams();
  const { getSigner } = useEthereum();
  const {
    result: proposal,
    execute: getProposal,
    inProgress,
    error,
  } = useAsync(
    async (): Promise<Proposal | Loading | NotEligible | AlreadyVoted> => {
      if (id === undefined) {
        return null;
      }

      const signer = await getSigner();

      const contract = new Contract(id, baseProposalAbi, signer);

      console.log(1);

      const isEligible = await contract.isEligible(
        signer?.address,
        ethers.ZeroHash,
      );

      if (!isEligible) {
        return undefined;
      }

      const hasVoted = await contract.hasVoted(signer?.address);

      if (hasVoted) {
        return false;
      }

      console.log(2);

      const candidateCount = await contract.candidateCount();
      console.log(3);
      const candidates = (await Promise.all(
        times(Number(candidateCount)).map(async (i) => {
          const candidate = await contract.getCandidate(i);
          return {
            name: candidate[0],
            description: candidate[1],
            photo: candidate[2],
            votes: candidate[3],
          };
        }),
      )) as CandidateWithVotes[];

      return {
        proposalName: (await contract.proposalName()) as string,
        proposalDescription: (await contract.proposalDescription()) as string,
        proposalType: Number(await contract.proposalType()) as ProposalType,
        proposalLength: Number(await contract.proposalLength()),
        startTime: Number(await contract.startTime()),
        candidates,
      };
    },
  );

  useEffect(() => {
    getProposal();
  }, [id]);

  return (
    <PageWrapper>
      <Typography
        variant="h1"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          fontSize: "clamp(3rem, 10vw, 3.5rem)",
          ml: "auto",
          mr: "auto",
        }}
      >
        Vote
      </Typography>
      <RequireConnectedWallet isVoter>
        {proposal && id && (
          <>
            <Typography variant="h2">{proposal.proposalName}</Typography>
            <Typography variant="body1">
              {proposal.proposalDescription}
            </Typography>
            <DateTimePicker
              label="Voting ends"
              disabled
              value={dayjs(
                (proposal.startTime + proposal.proposalLength) * 1000,
              )}
            />
            <VoteType proposal={proposal} id={id} />
          </>
        )}
        {proposal === undefined && (
          <Typography
            sx={{
              ml: "auto",
              mr: "auto",
            }}
            variant="h3"
          >
            You are not eligible to vote
          </Typography>
        )}
        {proposal === false && id !== undefined && (
          <>
            <Typography
              sx={{
                ml: "auto",
                mr: "auto",
              }}
              variant="h3"
            >
              You have already voted
            </Typography>
            <Results address={id} />
          </>
        )}
        {inProgress && <div>Loading proposal...</div>}
        {error && <div>Error: {error?.message}</div>}
      </RequireConnectedWallet>
    </PageWrapper>
  );
}

export function VoteType({ proposal, id }: { proposal: Proposal; id: string }) {
  switch (proposal.proposalType) {
    case ProposalType.FPTP:
      return <FirstPastThePost proposal={proposal} id={id} />;
    case ProposalType.RCV:
      return <RankedChoice />;
    case ProposalType.STV:
      return <SingleTransferableVote />;
    case ProposalType.QV:
      return <QuadraticVoting />;
    default:
      return <div>Unknown Type</div>;
  }
}

function FirstPastThePost(props: { proposal: Proposal; id: string }) {
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const { getSigner, getProvider } = useEthereum();
  const {
    result: transaction,
    execute: writeContract,
    inProgress,
    error,
  } = useAsync(async () => {
    const contract = new Contract(props.id, baseProposalAbi, await getSigner());
    const tx = await contract.vote(value, ethers.ZeroHash);
    waitForReceipt(tx.hash);
    return tx;
  });

  const {
    result: receipt,
    execute: waitForReceipt,
    inProgress: receiptInProgress,
    error: receiptError,
  } = useAsync(async (transactionHash) => {
    return await getProvider()!.waitForTransaction(transactionHash);
  });
  return (
    <>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">
          Candidates
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
        >
          {props.proposal.candidates.map(
            ({ name, description, photo, votes }, i) => (
              <FormControlLabel
                key={i}
                value={i}
                control={<Radio />}
                label={name}
              />
            ),
          )}
        </RadioGroup>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          writeContract();
        }}
        disabled={value === ""}
      >
        Vote
      </Button>
      {receipt && <Results address={props.id} />}
      <TxInfo
        inProgress={inProgress}
        transaction={transaction}
        receiptInProgress={receiptInProgress}
        receipt={receipt}
        error={error}
        receiptError={receiptError}
      />
    </>
  );
}

function Results(props: { address: string }) {
  return (
    <>
      <Typography variant="h2">Success</Typography>
      To see the results visit this link:{" "}
      <LinkMaterial
        sx={{ mr: "10px" }}
        component={Link}
        to={`/results/${props.address}`}
      >
        {props.address}
      </LinkMaterial>
    </>
  );
}

function RankedChoice() {
  return <>TBD</>;
}

function SingleTransferableVote() {
  return <>TBD</>;
}

function QuadraticVoting() {
  return <>TBD</>;
}
