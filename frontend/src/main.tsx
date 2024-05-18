import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { App } from "./App";
import { EthereumProvider } from "./components/Context";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <EthereumProvider>
        <App />
      </EthereumProvider>
    </LocalizationProvider>
  </React.StrictMode>,
);
