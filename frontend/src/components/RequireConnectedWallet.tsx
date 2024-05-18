"use client";

import { Box, Button, Typography, alpha } from "@mui/material";
import { useEthereum } from "./Context";
import { PropsWithChildren } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

export function RequireConnectedWallet(props: PropsWithChildren) {
  const { account, connect, disconnect } = useEthereum();

  return account.isConnected ? (
    props.children
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          fontSize: "clamp(1.2rem, 5vw, 2.3rem)",
          mb: "15px",
        }}
      >
        You&nbsp;have&nbsp;to&nbsp;connect&nbsp;your&nbsp;
        <Typography
          component="span"
          variant="h2"
          sx={{
            fontSize: "inherit",
            color: (theme) =>
              theme.palette.mode === "light" ? "primary.main" : "primary.light",
          }}
        >
          wallet
        </Typography>
        &nbsp;first
      </Typography>
      <Button variant="contained" onClick={connect}>
        Connect wallet
      </Button>
    </Box>
  );
}
