import {WalletController} from "@terra-money/wallet-controller";

export interface RootState {
  version: string,
}

export interface WalletControllerState {
  init: boolean
  instance: WalletController | undefined
}
