import Box from "@mui/material/Box";
import { useState } from "react";
import { PageWrapper } from "../components/PageWrapper";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ProposalsList } from "../components/ProposalsList";

export function VoteSelect() {
  const navigate = useNavigate();
  const [proposalId, setProposalId] = useState("");
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
        Select proposal:
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
            navigate(`/vote/${proposalId}`);
          }}
          sx={{ ml: 2 }}
        >
          Visit voting page
        </Button>
      </Box>
      <ProposalsList />
    </PageWrapper>
  );
}
