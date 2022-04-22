// components/GlobalContext.js
import React from "react";

interface ITokensInfo {
  tokenNum?: any,
  tokensInfo?: any
  connectedWallet?: any
}


const GlobalContext = React.createContext({} as ITokensInfo);

export default GlobalContext;
