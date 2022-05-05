// components/GlobalContext.js
import React from "react";
import {ConnectedWallet} from "@terra-dev/use-wallet/useConnectedWallet";

interface IGlobalContext {
  tokens: string[],
  tokensInfo?: any,
  connectedWallet?: ConnectedWallet,
  setLogout: any
}

const GlobalContext = React.createContext({} as IGlobalContext);

export default GlobalContext;
