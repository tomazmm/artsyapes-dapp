const { task } = require("@iboss/terrain");
const lib = require("../lib");
const fs = require('fs');

task(async (env ) => {
    const { num_tokens, all_nft_info} = lib(env);
    const {count} = await num_tokens();
    const list = [];
    let token;
    for(let it = 1; it <= count; it++){
        token = await all_nft_info(it.toString());
        list.push(token);
    }


    fs.open('tokens/tokens.json', 'a',  function( e, id ) {
        fs.write( id, JSON.stringify(list, null, 4), null, 'utf8', function(){
            fs.close(id, function(){
            });
        });
    });

    console.log("finished");
});