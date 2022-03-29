use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint128, Uint64};
use cw_storage_plus::{Item, Map, IndexedMap};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ContractInfo {
    pub owner: Addr,
    pub cw721: Addr
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct OrderInfo {
    pub token_id: String,
    pub owner: Addr,
    pub tier: String,
    pub status: String
}

// pub struct OrderInfo {
//     pub token_id: String,
//     pub owner: Addr,
//     pub tier: String,
//     pub status: String
// }

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PhysicalItem {
    nfc_tag: String,
    tier: String,
    owner: Addr
}
//
// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// pub struct NFTWrapper {
//     token_id: String,
//     tier: string,
//     owner: Addr,
//
// }






pub const CONTRACT_INFO: Item<ContractInfo> = Item::new("contract_info");
// mapping: (token_id, tier) --> OrderInfo
pub const ORDERS: Map<String, OrderInfo> = Map::new("orders");
pub const ORDERS_COUNT: Item<Uint128> = Item::new("orders_count");
//
// pub const PHYSICAL_ITEMS: Map<String, > = Map::new("physical_items");
// mapping: token_id --> PhysicalItem
pub const PHYSICAL_ITEMS: Map<Addr, Map<String, String>> = Map::new("physical_items");