import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const pollTypes = [
  "First Past The Post",
  "Ranked Choice",
  "Single Transferable Vote",
  "Quadratic Voting",
] as const;

type Candidate = {
  name: string;
  description: string;
};

export function Create() {
  const [pollType, setPollType] = useState(pollTypes[0]);
  const [votingParticipants, setVotingParticipants] = useState({
    tokenHolders: true,
    nftHolders: false,
    address: false,
    emails: false,
    open: false,
  });
  const handleVotingParticipantsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVotingParticipants({
      ...votingParticipants,
      [event.target.name]: event.target.checked,
    });
  };
  const { tokenHolders, nftHolders, address, emails, open } =
    votingParticipants;

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  return (
    <div>
      <Box
        sx={(theme) => ({
          width: "100%",
          backgroundImage:
            theme.palette.mode === "light"
              ? "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)"
              : "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
          backgroundRepeat: "no-repeat",
        })}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 14, sm: 20 },
            pb: { xs: 8, sm: 12 },
          }}
        >
          <Stack
            spacing={2}
            alignItems="center"
            useFlexGap
            sx={{ width: { xs: "100%", sm: "70%" } }}
          >
            <Typography
              variant="h1"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                fontSize: "clamp(3rem, 10vw, 3.5rem)",
              }}
            >
              Create&nbsp;new&nbsp;
              <Typography
                component="span"
                variant="h1"
                sx={{
                  fontSize: "inherit",
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "primary.main"
                      : "primary.light",
                }}
              >
                poll
              </Typography>
            </Typography>
            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ width: { sm: "100%", md: "80%" } }}
            >
              Select a poll type
            </Typography>
            <Stack
              direction={{ xs: "column" }}
              spacing={1}
              useFlexGap
              sx={{ pt: 2, width: { xs: "100%" } }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Poll type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={pollType}
                  label="Age"
                  onChange={(e) => {
                    setPollType(e.target.value as typeof pollType);
                  }}
                >
                  {pollTypes.map((pollType) => (
                    <MenuItem key={pollType} value={pollType}>
                      {pollType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">Select Voting Participants</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tokenHolders}
                    onChange={handleVotingParticipantsChange}
                    name="tokenHolders"
                  />
                }
                label="Token Holders"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={nftHolders}
                    onChange={handleVotingParticipantsChange}
                    name="nftHolders"
                  />
                }
                label="NFT Holders"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={address}
                    onChange={handleVotingParticipantsChange}
                    name="address"
                  />
                }
                label="Address"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={emails}
                    onChange={handleVotingParticipantsChange}
                    name="emails"
                  />
                }
                label="Emails"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={open}
                    onChange={handleVotingParticipantsChange}
                    name="open"
                  />
                }
                label="Open"
              />
            </FormGroup>
          </FormControl>
          {candidates.map((candidate, index) => (
            <Candidate
              key={index}
              nameValue={candidate.name}
              onNameInput={(event) => {
                const newCandidates = [...candidates];
                newCandidates[index].name = event.target.value;
                setCandidates(newCandidates);
              }}
              descriptionValue={candidate.description}
              onDescriptionInput={(event) => {
                const newCandidates = [...candidates];
                newCandidates[index].description = event.target.value;
                setCandidates(newCandidates);
              }}
            />
          ))}
          <Button
            variant="contained"
            sx={{ mb: "10px" }}
            color="primary"
            onClick={() =>
              setCandidates([...candidates, { name: "", description: "" }])
            }
          >
            Add Candidate
          </Button>
          <Button variant="contained" color="primary">
            Create
          </Button>
        </Container>
      </Box>
    </div>
  );
}

function Candidate(props: {
  nameValue: string;
  onNameInput: (event: React.FormEvent<HTMLInputElement>) => void;
  descriptionValue: string;
  onDescriptionInput: (event: React.FormEvent<HTMLInputElement>) => void;
}) {
  return (
    <Container
      sx={{
        display: "flex",
        mb: "20px",
      }}
    >
      <TextField
        label="Name"
        value={props.nameValue}
        onInput={props.onNameInput}
      />
      <TextField
        label="Description"
        value={props.descriptionValue}
        onInput={props.onDescriptionInput}
      />
    </Container>
  );
}
