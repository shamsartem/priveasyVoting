import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { PageWrapper } from "../components/PageWrapper";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ProposalsList } from "../components/ProposalsList.js";

export function ResultsSelect() {
  const [proposalId, setProposalId] = useState("");
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Typography
        variant="h2"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          fontSize: "clamp(3rem, 10vw, 3.5rem)",
          ml: "auto",
          mr: "auto",
        }}
      >
        Check out results:
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TextField
          label="Proposal Address"
          value={proposalId}
          onInput={(e) => {
            // @ts-ignore
            setProposalId(e.target.value);
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            navigate(`/results/${proposalId}`);
          }}
          sx={{ ml: 2 }}
        >
          Visit results page
        </Button>
      </Box>
      <ProposalsList isResults />
    </PageWrapper>
  );
}
