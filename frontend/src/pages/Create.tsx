import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import { Delete } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DateTimePicker } from "@mui/x-date-pickers";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import { RequireConnectedWallet } from "../components/RequireConnectedWallet.js";
import { Contract } from "zksync-ethers";
import { useAsync } from "../hooks/useAsync";
import { contractConfig, proposalFactory } from "../contracts/contracts.js";
import { useEthereum } from "../components/Context";
import { TxInfo } from "../components/TxInfo.js";
import { PageWrapper } from "../components/PageWrapper";
import {
  ProposalType,
  EligibilityType,
  proposalTypeNames,
  votingParticipantsNames,
} from "../enums.js";
import { ethers } from "ethers";
import { zip } from "lodash";
import LinkMaterial from "@mui/material/Link";
import { Link } from "react-router-dom";

type Candidate = {
  name: string;
  description: string;
  photo: string;
};

export function Create() {
  const [proposalName, setProposalName] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [ipfsCID, setIpfsCID] = useState("");
  const [proposalType, setProposalType] = useState(ProposalType.FPTP);
  const [eligibilityType, setEligibilityType] = useState(
    EligibilityType.TokenHolders,
  );
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [addressesOrEmails, setAddressesOrEmails] = useState<string[]>([]);

  const { getSigner, getProvider } = useEthereum();
  const {
    result: transaction,
    execute: writeContract,
    inProgress,
    error,
  } = useAsync(async () => {
    const signer = await getSigner();
    const contract = new Contract(
      proposalFactory.address,
      proposalFactory.abi,
      signer,
    );

    const proposalLength = Math.round(
      (Number(endDate?.toDate()) - Number(new Date())) / 1000,
    );

    const args = [
      proposalType,
      eligibilityType,
      eligibilityType === EligibilityType.TokenHolders && tokenAddress !== ""
        ? tokenAddress
        : ethers.ZeroAddress,
      proposalLength,
      proposalName,
      proposalDescription,
      ...zip(
        ...candidates.map((candidate) => [
          candidate.name,
          candidate.description,
          candidate.photo,
        ]),
      ),
      eligibilityType === EligibilityType.Address ? addressesOrEmails : [],
      // TODO: create random shit here
      eligibilityType === EligibilityType.Emails ? addressesOrEmails : [],
    ];

    console.log(JSON.stringify(args, null, 2));
    const tx = await contract.createProposal(...args);
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

  function handleSubmit() {
    writeContract();
  }
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
        Create&nbsp;new&nbsp;
        <Typography
          component="span"
          variant="h1"
          sx={{
            fontSize: "inherit",
            color: (theme) =>
              theme.palette.mode === "light" ? "primary.main" : "primary.light",
          }}
        >
          proposal
        </Typography>
      </Typography>
      <RequireConnectedWallet>
        <Stack
          direction={{ xs: "column" }}
          spacing={1}
          useFlexGap
          sx={{ pt: 2, width: "100%" }}
        >
          <TextField
            label="Name"
            value={proposalName}
            onInput={(e) => {
              // @ts-ignore
              setProposalName(e.target.value);
            }}
          />
          <TextField
            label="Description"
            value={proposalDescription}
            onInput={(e) => {
              // @ts-ignore
              setProposalDescription(e.target.value);
            }}
            sx={{ mt: "10px" }}
          />
          <FormControl fullWidth sx={{ mt: "10px" }}>
            <InputLabel id="proposal-type-label">Proposal type</InputLabel>
            <Select
              labelId="proposal-type-label"
              value={proposalType}
              label="Proposal type"
              onChange={(e) => {
                setProposalType(e.target.value as typeof proposalType);
              }}
            >
              {Object.values(ProposalType)
                .filter((v): v is ProposalType => !isNaN(Number(v)))
                .map((proposalType) => {
                  return (
                    <MenuItem key={proposalType} value={proposalType}>
                      {proposalTypeNames[proposalType]}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: "10px" }}>
            <InputLabel id="voting-participants-label">
              Voting Participants
            </InputLabel>
            <Select
              labelId="voting-participants-label"
              value={eligibilityType}
              label="Voting Participants"
              onChange={(e) => {
                setEligibilityType(e.target.value as EligibilityType);
              }}
            >
              {Object.values(EligibilityType)
                .filter((v): v is EligibilityType => !isNaN(Number(v)))
                .map((votingParticipant) => {
                  return (
                    <MenuItem key={votingParticipant} value={votingParticipant}>
                      {votingParticipantsNames[votingParticipant]}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          {(eligibilityType === EligibilityType.TokenHolders ||
            eligibilityType === EligibilityType.NFTHolders) && (
            <TextField
              label="Token Address"
              value={tokenAddress}
              onInput={(e) => {
                // @ts-ignore
                setTokenAddress(e.target.value);
              }}
              sx={{ mt: "10px" }}
            />
          )}
          {(eligibilityType === EligibilityType.Address ||
            eligibilityType === EligibilityType.Emails) && (
            <>
              {addressesOrEmails.map((addressOrId, index) => (
                <Box key={index} sx={{ mt: "10px", display: "flex" }}>
                  <TextField
                    key={index}
                    label={`${eligibilityType === EligibilityType.Address ? "Address" : "Email"} ${index + 1}`}
                    value={addressOrId}
                    onInput={(e) => {
                      const newAddressesOrEmails = [...addressesOrEmails];
                      // @ts-ignore
                      newAddressesOrEmails[index] = e.target.value;
                      setAddressesOrEmails(newAddressesOrEmails);
                    }}
                  />
                  <Button
                    sx={{ ml: "10px" }}
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={() => {
                      const newAddressesOrEmails = [...addressesOrEmails];
                      newAddressesOrEmails.splice(index, 1);
                      setAddressesOrEmails(newAddressesOrEmails);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              ))}
              <Button
                variant="outlined"
                onClick={() => {
                  const newAddressesOrEmails = [...addressesOrEmails];
                  newAddressesOrEmails.push("");
                  setAddressesOrEmails(newAddressesOrEmails);
                }}
                sx={{ mt: "10px" }}
              >
                Add{" "}
                {eligibilityType === EligibilityType.Address
                  ? "Address"
                  : "Email"}
              </Button>
            </>
          )}
          <DateTimePicker
            value={endDate}
            sx={{ mt: "10px" }}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            label="Proposal end time"
            disablePast
          />
        </Stack>
        <Stack
          spacing={2}
          alignItems="center"
          useFlexGap
          sx={{
            border: "1px solid lightgray",
            borderRadius: "10px",
            p: "30px",
            mb: "20px",
            width: "100%",
          }}
        >
          {candidates.map((candidate, index) => (
            <Candidate
              key={index}
              nameValue={candidate.name}
              onNameInput={(event) => {
                const newCandidates = [...candidates];
                // @ts-ignore
                newCandidates[index].name = event.target.value;
                setCandidates(newCandidates);
              }}
              descriptionValue={candidate.description}
              onDescriptionInput={(event) => {
                const newCandidates = [...candidates];
                // @ts-ignore
                newCandidates[index].description = event.target.value;
                setCandidates(newCandidates);
              }}
              photoValue={candidate.photo}
              onPhotoInput={(event) => {
                const newCandidates = [...candidates];
                // @ts-ignore
                newCandidates[index].photo = event.target.value;
                setCandidates(newCandidates);
              }}
              delete={() => {
                const newCandidates = [...candidates];
                newCandidates.splice(index, 1);
                console.log(newCandidates);
                setCandidates(newCandidates);
              }}
            />
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              setCandidates([
                ...candidates,
                {
                  name: "",
                  description: "",
                  photo: "",
                },
              ])
            }
          >
            Add Candidate
          </Button>
        </Stack>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create
        </Button>
        {receipt && (
          <>
            <Typography variant="h2">Success</Typography>
            Voters can vote by following this link:{" "}
            <LinkMaterial
              sx={{ mr: "10px" }}
              component={Link}
              to={`/vote/${receipt.contractAddress}`}
            >
              {receipt.contractAddress}
            </LinkMaterial>
          </>
        )}
        <TxInfo
          inProgress={inProgress}
          transaction={transaction}
          receiptInProgress={receiptInProgress}
          receipt={receipt}
          error={error}
          receiptError={receiptError}
        />
      </RequireConnectedWallet>
    </PageWrapper>
  );
}

function Candidate(props: {
  nameValue: string;
  onNameInput: (event: React.FormEvent<HTMLInputElement>) => void;
  descriptionValue: string;
  onDescriptionInput: (event: React.FormEvent<HTMLInputElement>) => void;
  photoValue: string;
  onPhotoInput: (event: React.FormEvent<HTMLInputElement>) => void;
  delete: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        mb: "10px",
        width: "100%",
        gap: "10px",
        pl: 0,
        pr: 0,
      }}
    >
      <TextField
        label="Name"
        value={props.nameValue}
        onInput={props.onNameInput}
        sx={{ flex: 1 }}
      />
      <TextField
        label="Description"
        sx={{ flex: 1 }}
        value={props.descriptionValue}
        onInput={props.onDescriptionInput}
      />
      <TextField
        label="IPFS CID"
        sx={{ flex: 1 }}
        value={props.photoValue}
        onInput={props.onPhotoInput}
      />
      <Button variant="outlined" startIcon={<Delete />} onClick={props.delete}>
        Delete
      </Button>
    </Box>
  );
}
