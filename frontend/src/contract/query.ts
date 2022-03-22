import { LCDClient } from '@terra-money/terra.js'
import { contractAdress } from './address'
import {Wallet} from "@terra-dev/use-wallet/useWallet";

export const numTokens = async (wallet : Wallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(contractAdress(wallet), { num_tokens: {} })
}
