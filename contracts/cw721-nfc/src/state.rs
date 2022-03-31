use std::collections::HashMap;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint128, Uint64};
use cw_storage_plus::{Item, Map, IndexedMap, MultiIndex, IndexList, UniqueIndex, U32Key, U8Key, Index};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ContractInfo {
    pub owner: Addr,
    pub cw721: Addr
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PhysicalInfo {
    pub id: u32,
    pub token_id: String,
    pub owner: Addr,
    pub tier: String,
    pub status: String
    // pub nfc_tag: String
}

pub struct PhysicalIndexes<'a> {
    pub id: UniqueIndex<'a, U32Key, PhysicalInfo>,
    pub token_id: MultiIndex<'a, (String, Vec<u8>), PhysicalInfo>
}

impl<'a> IndexList<PhysicalInfo> for PhysicalIndexes<'a> {
    fn get_indexes(&'_ self) -> Box<dyn Iterator<Item = &'_ dyn Index<PhysicalInfo>> + '_> {
        let v: Vec<&dyn Index<PhysicalInfo>> = vec![&self.id, &self.token_id];
        Box::new(v.into_iter())
    }
}

pub fn physicals<'a>() -> IndexedMap<'a, &'a [u8], PhysicalInfo, PhysicalIndexes<'a>> {
    let indexes = PhysicalIndexes {
        id: UniqueIndex::new(
            |d| U32Key::new(d.id),
            "physical_id"),
        token_id: MultiIndex::new(
            |d, pk | (d.token_id.clone(), pk),
            "physicals",
            "physicals__token_id",
        ),
    };
    IndexedMap::new("physicals", indexes)
}


pub const CONTRACT_INFO: Item<ContractInfo> = Item::new("contract_info");
pub const ORDERS: Map<String, PhysicalInfo> = Map::new("orders");
pub const ORDER_COUNT: Item<u32> = Item::new("order_count");

