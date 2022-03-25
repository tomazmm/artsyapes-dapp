import config from "../refs.terrain.json"

export const contractAdress = (wallet: any) =>{
    const jsonObj = JSON.parse(JSON.stringify(config));
    return jsonObj[wallet.network.name]["cw721-metadata-onchain"].contractAddresses.default
}

