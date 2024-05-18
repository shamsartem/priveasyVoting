import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import { PageWrapper } from "../components/PageWrapper";
import { RequireConnectedWallet } from "../components/RequireConnectedWallet.js";
import {
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const mockProposals = [
  {
    name: "First Past The Post",
    description: "Vote in the first place",
    id: "some",
  },
  {
    name: "stuff",
    description: "Other stuff",
    id: "other",
  },
];

export function ResultsSelect() {
  const navigate = useNavigate();
  const [proposalId, setProposalId] = useState("");

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
        Check out results
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
      <Typography
        variant="h2"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          fontSize: "clamp(1rem, 5vw, 2rem)",
          ml: "auto",
          mr: "auto",
          textAlign: "center",
          mt: "50px",
        }}
      >
        Or select a proposal you are eligible to vote for
      </Typography>
      <RequireConnectedWallet isVoter>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {mockProposals.map(({ description, name, id }, i) => {
            return (
              <>
                <ListItemButton
                  alignItems="flex-start"
                  onClick={() => {
                    navigate(`/vote/${id}`);
                  }}
                  key={i}
                >
                  <ListItemAvatar>
                    <Avatar alt={name} src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={name}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {description}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
                {i !== mockProposals.length - 1 && (
                  <Divider
                    key={`divider_${i}`}
                    variant="inset"
                    component="li"
                  />
                )}
              </>
            );
          })}
        </List>
      </RequireConnectedWallet>
    </PageWrapper>
  );
}
