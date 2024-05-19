import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import Groups from "@mui/icons-material/Groups";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";

const items = [
  {
    icon: <Groups />,
    title: "Public voting",
    description:
      "On public blockchains, voting data can be seen at any point. This reveals what individual addresses are voting for. Additionally, subsequent voters can see what prior users have voted for which can bias their decision.",
  },
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: "Restrictive voting styles",
    description:
      "Traditionally blockchain voting models have had to stick to simplistic systems such as First Past the Post due to computational overhead incurring excessive gas costs. On zkSync, the chain is scalable enough to facilitate more complex voting types such as Ranked Choice Voting (arguably a superior voting style for determining consensus).",
  },
  {
    icon: <NoAccountsIcon />,
    title: "Only available for blockchain users",
    description:
      "In order to vote on a blockchain, users had to already have a blockchain wallet and funds to pay for the voting transaction. zkSync's native account abstraction is leveraged to allow social logins and a Gasmaster is deployed to fund their transactions. This massively lowers the barrier for entry, as users simply need an email to receive their unique voting code.",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "hsl(220, 30%, 2%)",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4">
            Problems Solving
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  p: 3,
                  height: "100%",
                  border: "1px solid",
                  borderColor: "hsla(220, 25%, 25%, .3)",
                  background: "transparent",
                  backgroundColor: "grey.900",
                  boxShadow: "none",
                }}
              >
                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                <div>
                  <Typography fontWeight="medium" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
