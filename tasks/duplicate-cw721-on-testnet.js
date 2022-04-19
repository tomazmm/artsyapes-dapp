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
            const token_id = parseInt(tokens[it].info.name).toString();
            const token_uri = tokens[it].info.token_uri;
            const extension = tokens[it].info.extension;
            await mint(owner, owner.key.accAddress,  token_id, token_uri ,extension);
            it++;
        }
        catch (_) {
            // ignore error and just broadcast tx once again
        }
    }
});
