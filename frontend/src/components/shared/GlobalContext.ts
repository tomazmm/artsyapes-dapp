// components/GlobalContext.js
import React from "react";

interface ITokensInfo {
  tokenNum?: any,
  tokensInfo?: any
  connectedWallet?: any
  navigateToOrder: (id: string) => void
}


const GlobalContext = React.createContext({} as ITokensInfo);

export default GlobalContext;
