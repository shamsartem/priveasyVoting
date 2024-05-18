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

const mockPolls = [
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
        Select what you are voting for
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
      <RequireConnectedWallet>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {mockPolls.map(({ description, name, id }, i) => {
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
                {i !== mockPolls.length - 1 && (
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
