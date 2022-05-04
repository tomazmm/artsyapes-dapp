const { task } = require("@iboss/terrain");
const lib = require("../lib");
const fs = require('fs');
const tokens = require("../tokens/tokens.json")

task(async (env) => {
    const { mint } = lib(env);
    const owner = env.wallets.dev0;

    let it = 0;
    while (it !== tokens.length) {
        try {
            const real_owner = tokens[it].access.owner;
            const token_id = parseInt(tokens[it].info.extension.name.split(" ")[1]).toString();
            const token_uri = tokens[it].info.token_uri;
            const extension = tokens[it].info.extension;
            // console.log(token_id)
            await mint(owner, real_owner,  token_id, token_uri ,extension);
            it++;
        }
        catch (_) {
            // ignore error and just broadcast tx once again
        }
    }
});
