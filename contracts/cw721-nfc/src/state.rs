use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint128, Uint64};
use cw_storage_plus::{Item, Map};

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
}

pub const CONTRACT_INFO: Item<ContractInfo> = Item::new("contract_info");
pub const ORDERS: Map<String, OrderInfo> = Map::new("orders");
