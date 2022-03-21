import { LCDClient } from '@terra-money/terra.js'
import { contractAdress } from './address'

export const numTokens = async (wallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(contractAdress(wallet), { num_tokens: {} })
}
