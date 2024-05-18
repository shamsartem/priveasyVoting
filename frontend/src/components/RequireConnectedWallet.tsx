"use client";

import { Box, Button, Typography, alpha } from "@mui/material";
import { useEthereum } from "./Context";
import { PropsWithChildren, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import Web3 from "web3";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
// IMP START - Dashboard Registration
const clientId =
  "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x13881", // Sepolia Testnet Chain ID in hexadecimal
  rpcTarget: "https://rpc.sepolia.zksync.io/", // Example RPC endpoint for zkSync Sepolia Testnet
  displayName: "zkSync Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.zksync.io/explorer", // Example block explorer for zkSync Sepolia Testnet
  ticker: "ETH",
  tickerName: "Ethereum",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider: privateKeyProvider,
});

export function RequireConnectedWallet(
  props: PropsWithChildren & { isVoter?: true },
) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether",
    );
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!", // configure your own password here.
    );
    uiConsole(signedMessage);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <Button
      variant="contained"
      onClick={login}
      sx={{
        mt: "10px",
      }}
    >
      Social login
    </Button>
  );

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
        You&nbsp;have&nbsp;to&nbsp;
        <Typography
          component="span"
          variant="h2"
          sx={{
            fontSize: "inherit",
            color: (theme) =>
              theme.palette.mode === "light" ? "primary.main" : "primary.light",
          }}
        >
          login
        </Typography>
        &nbsp;first
      </Typography>
      <Button variant="contained" onClick={connect}>
        Connect wallet
      </Button>
      <div className="container">
        <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
        <div id="console" style={{ whiteSpace: "pre-line" }}>
          <p style={{ whiteSpace: "pre-line" }}></p>
        </div>
      </div>
      {props.isVoter === true ? (
        <IDKitWidget
          app_id="app_staging_9a394b1b163fe32bd97a4c740f54c2bb" // obtained from the Developer Portal
          action="testing-action" // obtained from the Developer Portal
          onSuccess={() => {
            console.log("IDKitWidget onSuccess");
          }} // callback when the modal is closed
          handleVerify={() => {
            console.log("IDKitWidget handleVerify");
          }} // callback when the proof is received
          verification_level={VerificationLevel.Orb}
        >
          {({ open }) => (
            <div className="relative">
              <Button
                onClick={open}
                variant="contained"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <LogoIcon />
                <Typography
                  component="span"
                  sx={{
                    ml: "10px",
                  }}
                >
                  Continue with Worldcoin
                </Typography>
              </Button>
            </div>
          )}
        </IDKitWidget>
      ) : null}
    </Box>
  );
}

function LogoIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_499_80323)">
        <path
          d="M491.846 156.358C478.938 125.854 460.489 98.5154 436.987 75.013C413.485 51.5105 386.085 33.0617 355.642 20.1536C324.041 6.75847 290.553 0 255.97 0C221.447 0 187.898 6.75847 156.297 20.1536C125.793 33.0617 98.4545 51.5105 74.9521 75.013C51.4496 98.5154 33.0008 125.915 20.0928 156.358C6.75847 187.898 0 221.447 0 255.97C0 290.493 6.75847 324.041 20.1536 355.642C33.0617 386.146 51.5105 413.485 75.013 436.987C98.5154 460.489 125.915 478.938 156.358 491.846C187.959 505.181 221.447 512 256.03 512C290.553 512 324.102 505.242 355.703 491.846C386.207 478.938 413.545 460.489 437.048 436.987C460.55 413.485 478.999 386.085 491.907 355.642C505.242 324.041 512.061 290.553 512.061 255.97C512 221.447 505.181 187.898 491.846 156.358ZM170.971 231.919C181.626 191.003 218.889 160.742 263.154 160.742H440.884C452.331 182.844 459.637 206.895 462.499 231.919H170.971ZM462.499 280.02C459.637 305.045 452.27 329.095 440.884 351.197H263.154C218.95 351.197 181.687 320.936 170.971 280.02H462.499ZM108.988 108.988C148.26 69.7158 200.44 48.1008 255.97 48.1008C311.499 48.1008 363.679 69.7158 402.951 108.988C404.169 110.206 405.326 111.423 406.483 112.641H263.154C224.856 112.641 188.872 127.559 161.777 154.653C140.467 175.964 126.706 202.815 121.774 231.98H49.5012C54.7984 185.523 75.4392 142.537 108.988 108.988ZM255.97 463.899C200.44 463.899 148.26 442.284 108.988 403.012C75.4392 369.463 54.7984 326.477 49.5012 280.081H121.774C126.645 309.246 140.467 336.097 161.777 357.408C188.872 384.502 224.856 399.42 263.154 399.42H406.543C405.387 400.637 404.169 401.855 403.012 403.073C363.74 442.223 311.499 463.899 255.97 463.899Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_499_80323">
          <rect width="512" height="512" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
