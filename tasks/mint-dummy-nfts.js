const { task } = require("@iboss/terrain");
const lib = require("../lib");

task(async (env) => {
    const { num_tokens, mint } = lib(env);
    const {count} = await num_tokens();
    const owner = env.wallets.dev0;
    for(let it = count + 1; it <= count + 5; it++){
        await mint(owner, owner.key.accAddress,  it.toString());
    }
});
