import Typography from "@mui/material/Typography";
import { RequireConnectedWallet } from "./RequireConnectedWallet.js";
import {
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockProposals } from "../pages/ResultsSelect.js";

export function ProposalsList() {
  const navigate = useNavigate();

  return (
    <>
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
    </>
  );
}
