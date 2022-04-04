use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr};
use cw_storage_plus::{Item, Map, IndexedMap, MultiIndex, IndexList, UniqueIndex, U32Key, Index, U8Key};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ContractInfo {
    pub owner: Addr,
    pub cw721: Addr
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Cw721PhysicalInfo {
    pub id: u32,
    pub token_id: String,
    pub owner: Addr,
    pub tier: u8,
    pub status: String
    // pub nfc_tag: Option<String>
}

pub struct PhysicalIndexes<'a> {
    pub id: UniqueIndex<'a, U32Key, Cw721PhysicalInfo>,
    pub token_id: MultiIndex<'a, (String, Vec<u8>), Cw721PhysicalInfo>,
}

impl<'a> IndexList<Cw721PhysicalInfo> for PhysicalIndexes<'a> {
    fn get_indexes(&'_ self) -> Box<dyn Iterator<Item = &'_ dyn Index<Cw721PhysicalInfo>> + '_> {
        let v: Vec<&dyn Index<Cw721PhysicalInfo>> = vec![&self.id, &self.token_id];
        Box::new(v.into_iter())
    }
}

pub fn physicals<'a>() -> IndexedMap<'a, &'a [u8], Cw721PhysicalInfo, PhysicalIndexes<'a>> {
    let indexes = PhysicalIndexes {
        id: UniqueIndex::new(
            |d| U32Key::new(d.id),
            "physical_id"),
        token_id: MultiIndex::new(
            |d, pk | (d.token_id.clone(), pk),
            "physicals",
            "physicals__token_id",
        )
    };
    IndexedMap::new("physicals", indexes)
}


pub const CONTRACT_INFO: Item<ContractInfo> = Item::new("contract_info");
pub const TIER_LIMIT: Map<U8Key, u8> = Map::new("tier_limit");
pub const ORDERS: Map<String, Cw721PhysicalInfo> = Map::new("orders");
pub const ORDER_COUNT: Item<u32> = Item::new("order_count");



