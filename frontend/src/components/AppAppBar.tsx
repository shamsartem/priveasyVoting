import { PaletteMode, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import LinkMaterial from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";

import { Link } from "react-router-dom";
import { Connect } from "./Connect";
import { useEthereum } from "./Context.js";
import { useState } from "react";

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export default function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const [open, setOpen] = useState(false);
  const { account } = useEthereum();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            borderRadius: "999px",
            bgcolor:
              theme.palette.mode === "light"
                ? "hsla(220, 60%, 99%, 0.6)"
                : "hsla(220, 0%, 0%, 0.7)",
            backdropFilter: "blur(24px)",
            maxHeight: 40,
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              theme.palette.mode === "light"
                ? "0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)"
                : "0 1px 2px hsla(210, 0%, 0%, 0.5), 0 2px 12px hsla(210, 100%, 25%, 0.3)",
          })}
        >
          <LinkMaterial
            sx={{ mr: "50px" }}
            component={Link}
            to="/"
            onClick={handleClick}
          >
            priveasyVoting
          </LinkMaterial>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              px: 0,
            }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <LinkMaterial sx={{ mr: "10px" }} component={Link} to="/create">
                Create
              </LinkMaterial>
              <LinkMaterial sx={{ mr: "10px" }} component={Link} to="/vote">
                Vote
              </LinkMaterial>
              <LinkMaterial sx={{ mr: "10px" }} component={Link} to="/results">
                Results
              </LinkMaterial>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              alignItems: "center",
            }}
          >
            <Typography variant="body1" color="gray" sx={{ mr: "10px" }}>
              {account.isConnected ? account.address : ""}
            </Typography>
            {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
            <Connect />
          </Box>
          <Box sx={{ display: { sm: "flex", md: "none" } }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "background.default",
                }}
              >
                {/* <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <ToggleColorMode
                    mode={mode}
                    toggleColorMode={toggleColorMode}
                  />
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box> */}
                {/* <Divider sx={{ my: 3 }} /> */}
                <MenuItem>
                  <LinkMaterial
                    sx={{ width: "100%" }}
                    component={Link}
                    to="/"
                    onClick={handleClick}
                  >
                    priveasyVoting
                  </LinkMaterial>
                </MenuItem>
                <MenuItem>
                  <LinkMaterial
                    sx={{ width: "100%" }}
                    component={Link}
                    to="/create"
                    onClick={handleClick}
                  >
                    Create
                  </LinkMaterial>
                </MenuItem>
                <MenuItem>
                  <LinkMaterial
                    sx={{ width: "100%" }}
                    component={Link}
                    to="/vote"
                    onClick={handleClick}
                  >
                    Vote
                  </LinkMaterial>
                </MenuItem>
                <MenuItem>
                  <LinkMaterial
                    sx={{ width: "100%" }}
                    component={Link}
                    to="/results"
                    onClick={handleClick}
                  >
                    Results
                  </LinkMaterial>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
