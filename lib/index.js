module.exports = ({ wallets, refs, config, client }) => ({
  // queries
  contract_info: () => client.query("cw-nfts", { contract_info: {} }),
  num_tokens: () => client.query("cw-nfts", { num_tokens: {} }),
  owner_of: (token_id) => client.query("cw-nfts", {owner_of: { token_id }}),
  nft_info: (token_id) => client.query("cw-nfts", {nft_info: { token_id}}),
  all_nft_info: (token_id) => client.query("cw-nfts", {all_nft_info: { token_id }}),
  tokens: (owner) => client.query("cw-nfts", {tokens: { owner }}),
  all_tokens: (owner) => client.query("cw-nfts", {all_tokens: { }}),
  approved_for_all: (owner) => client.query("cw-nfts", {owner})
});
