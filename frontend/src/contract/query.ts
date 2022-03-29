import { LCDClient } from '@terra-money/terra.js'
import { contractAdress } from './address'
import { ConnectedWallet } from "@terra-dev/use-wallet/useConnectedWallet";

export const numTokens = async (wallet : ConnectedWallet): Promise<any> => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery<Promise<any>>(contractAdress(wallet), { num_tokens: {} })
}
