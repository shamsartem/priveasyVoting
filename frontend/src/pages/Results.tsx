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
import { PieChart } from "@mui/x-charts";

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

export function Results() {
  let { id } = useParams();
  const { getSigner } = useEthereum();
  const {
    result: proposal,
    execute: getProposal,
    inProgress,
    error,
  } = useAsync(async (): Promise<Proposal | null> => {
    if (id === undefined) {
      return null;
    }

    const signer = await getSigner();

    const contract = new Contract(id, baseProposalAbi, signer);

    const candidateCount = await contract.candidateCount();
    const candidates = (await Promise.all(
      times(Number(candidateCount)).map(async (i) => {
        const candidate = await contract.getCandidate(i);
        return {
          name: candidate[0],
          description: candidate[1],
          photo: candidate[2],
          votes: Number(candidate[3]),
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
  });

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
        Voting Results
      </Typography>
      {proposal && id && (
        <>
          <Typography variant="h2">{proposal.proposalName}</Typography>
          <Typography variant="body1">
            {proposal.proposalDescription}
          </Typography>
          <DateTimePicker
            label="Voting ends"
            disabled
            value={dayjs((proposal.startTime + proposal.proposalLength) * 1000)}
          />
          <PieChart
            series={[
              {
                data: proposal.candidates.map(({ name, votes }, id) => {
                  return {
                    id,
                    label: name,
                    value: votes,
                  };
                }),
              },
            ]}
            width={400}
            height={200}
          />
        </>
      )}
      {inProgress && <div>Loading proposal...</div>}
      {error && <div>Error: {error?.message}</div>}
    </PageWrapper>
  );
}
