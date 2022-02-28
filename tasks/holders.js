const { task } = require("@iboss/terrain");
const lib = require("../lib");
const createCsvWriter = require('csv-writer').createObjectCsvWriter

task(async (env) => {
    const csvWriter = createCsvWriter({
        path: 'out.csv',
        header: [
            {id: 'owner', title: 'Owners'},
        ]
    });

    const { num_tokens, owner_of } = lib(env);
    const {count} = await num_tokens();
    const owners = []
    for(let it = 1; it <= count; it++){
        const {owner} = await owner_of(it.toString());
        if (!owners.includes({owner})){
            owners.push({owner})
        }
    }
    await csvWriter.writeRecords(owners)
});
