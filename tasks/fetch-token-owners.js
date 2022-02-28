const { task } = require("@iboss/terrain");
const lib = require("../lib");
const createCsvWriter = require('csv-writer').createObjectCsvWriter

/*
* Fetch all cw-nft token owners and their corresponding tokens and
* stores them into Owners.csv file.
* */
task(async (env) => {
    const csvWriter = createCsvWriter({
        path: 'Owners.csv',
        header: [
            {id: 'owner', title: 'Owner'},
            {id: 'token_count', title: 'Token count'},
            {id: 'tokens', title: 'Tokens'},
        ]
    });

    const { num_tokens, owner_of, tokens } = lib(env);
    const {count} = await num_tokens();
    const owners = []
    const rows = []
    for(let it = 1; it <= count; it++){
        const {owner} = await owner_of(it.toString());
        if (!owners.includes(owner)){
            owners.push(owner)
            const ownerTokens = await tokens(owner);
            rows.push({
                owner,
                token_count: ownerTokens.tokens.length,
                tokens: ownerTokens.tokens
            })
        }
    }

    await csvWriter.writeRecords(rows)
});
