module.exports = ({ wallets, refs, config, client }) => ({
  // queries
  contract_info: () => client.query("cw721-metadata-onchain", { contract_info: {} }),
  num_tokens: () => client.query("cw721-metadata-onchain", { num_tokens: {} }),
  owner_of: (token_id) => client.query("cw721-metadata-onchain", {owner_of: { token_id }}),
  nft_info: (token_id) => client.query("cw721-metadata-onchain", {nft_info: { token_id}}),
  all_nft_info: (token_id) => client.query("cw721-metadata-onchain", {all_nft_info: { token_id }}),
  tokens: (owner) => client.query("cw721-metadata-onchain", {tokens: { owner }}),
  all_tokens: (owner) => client.query("cw721-metadata-onchain", {all_tokens: { owner }}),
  approved_for_all: (owner) => client.query("cw721-metadata-onchain", {owner}),

  //executes
  mint: (signer = wallets.validator, owner, token_id, token_uri) =>
      client.execute(signer, "cw721-metadata-onchain", { mint: { owner, token_id, token_uri} }),
  transfer_nft: (signer = wallets.validator, recipient, token_id) =>
      client.execute(signer, "cw721-metadata-onchain", { transfer_nft: { recipient, token_id} }),
  send_nft: (signer = wallets.validator, contract, msg, token_id) =>
      client.execute(signer, "cw721-metadata-onchain", { send_nft: { contract, msg, token_id} }),
  approve: (signer = wallets.validator, spender, token_id, expires) =>
      client.execute(signer, "cw721-metadata-onchain", { approve: { expires, spender, token_id} }),
  revoke: (signer = wallets.validator, spender, token_id) =>
      client.execute(signer, "cw721-metadata-onchain", { revoke: { spender, token_id} }),
  approve_all: (signer = wallets.validator, expires, operator) =>
      client.execute(signer, "cw721-metadata-onchain", { approve_all: { expires, operator} }),
  revoke_all: (signer = wallets.validator, operator) =>
      client.execute(signer, "cw721-metadata-onchain", { approve_all: { operator} }),
});
