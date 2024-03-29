import { LCDClient, MsgExecuteContract, Fee } from "@terra-money/terra.js";
import { contractAdress } from "./address";
import {ConnectedWallet} from "@terra-dev/use-wallet/useConnectedWallet";

// ==== utils ====

const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _exec =
  (msg: any, fee = new Fee(200000, { uluna: 10000 })) =>
  async (wallet: ConnectedWallet) => {
    const lcd = new LCDClient({
      URL: wallet.network.lcd,
      chainID: wallet.network.chainID,
    });

    const { result } = await wallet.post({
      fee,
      msgs: [
        new MsgExecuteContract(
          wallet.walletAddress,
          contractAdress(wallet),
          msg
        ),
      ],
    });

    while (true) {
      try {
        return await lcd.tx.txInfo(result.txhash);
      } catch (e) {
        if (Date.now() < untilInterval) {
          await sleep(500);
        } else if (Date.now() < until) {
          await sleep(1000 * 10);
        } else {
          throw new Error(
            `Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
          );
        }
      }
    }
  };

// ==== execute contract ====

export const increment = _exec({ increment: {} });

export const reset = async (wallet: any, count: any) =>
  _exec({ reset: { count } })(wallet);
