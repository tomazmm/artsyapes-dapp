// sync-ed from root via `tr sync-refs`
import config from "../refs.terrain.json"

// @ts-ignore
export const contractAdress = (wallet: any) => config[wallet.network.name]["cw721-metadata-onchain"].contractAddresses.default
