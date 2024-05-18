"use client";

import { Button } from "@mui/material";
import { useEthereum } from "./Context";

export function Connect() {
  const { account, connect, disconnect } = useEthereum();

  return (
    <div>
      {account.isConnected ? (
        <Button variant="contained" onClick={disconnect} size="small">
          Disconnect wallet
        </Button>
      ) : (
        <Button variant="contained" onClick={connect} size="small">
          Connect wallet
        </Button>
      )}
    </div>
  );
}
