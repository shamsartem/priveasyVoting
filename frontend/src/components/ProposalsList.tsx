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

const mockProposals = [
  {
    name: "What is the best food?",
    description: "Everyone eats food, but what is the best food?",
    photo: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
    id: "0x4780d83f1164AAF7A6982Dc64E48e6e150f0D09f",
  },
  {
    name: "Should simpleDAO deploy on zkSync?",
    description:
      "It IS a blockchain and can be deployed to, and simpleDAO loves to deloy on things. So, what do you think?",
    photo: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
    id: "0x14FbF52E5131a582593B23027301F45c51b6D7a7",
  },
];

export function ProposalsList(props: { isResults?: boolean }) {
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
        Or select one you are eligible to vote for:
      </Typography>
      <RequireConnectedWallet isVoter>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {mockProposals.map(({ description, name, photo, id }, i) => {
            return (
              <div key={i}>
                <ListItemButton
                  alignItems="flex-start"
                  onClick={() => {
                    navigate(
                      props.isResults ? `/results/${id}` : `/vote/${id}`,
                    );
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={name}
                      src={`https://${photo}.ipfs.dweb.link/`}
                    />
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
                  <Divider variant="inset" component="li" />
                )}
              </div>
            );
          })}
        </List>
      </RequireConnectedWallet>
    </>
  );
}
