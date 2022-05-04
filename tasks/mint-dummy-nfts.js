const { task } = require("@iboss/terrain");
const lib = require("../lib");

task(async (env) => {
    const { num_tokens, mint } = lib(env);
    let {count} = await num_tokens();
    const owner = env.wallets.dev0;

    let it = count;
    while (it < count + 5) {
        try {
            await mint(owner, owner.key.accAddress,  it.toString());
            it++;
        }
        catch (e) {
            // ignore error and just broadcast tx once again
            // console.log(e.response.data);
        }
    }
});
