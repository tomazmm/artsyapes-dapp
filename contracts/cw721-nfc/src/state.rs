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
pub struct OrderInfo {
    pub id: u32,
    pub token_id: String,
    pub owner: Addr,
    pub tier: String,
    pub status: String
}

pub struct OrderIndexes<'a> {
    pub id: UniqueIndex<'a, U32Key, OrderInfo>,
    pub token_id: MultiIndex<'a, String, OrderInfo>
}

impl<'a> IndexList<OrderInfo> for OrderIndexes<'a> {
    fn get_indexes(&'_ self) -> Box<dyn Iterator<Item = &'_ dyn Index<OrderInfo>> + '_> {
        let v: Vec<&dyn Index<OrderInfo>> = vec![&self.id];
        Box::new(v.into_iter())
    }
}

pub fn orders<'a>() -> IndexedMap<'a, &'a [u8], OrderInfo, OrderIndexes<'a>> {
    let indexes = OrderIndexes {
        id: UniqueIndex::new(
            |d| U32Key::new(d.id),
            "order_id"),
        token_id: MultiIndex::new(
            |d, pk | d.token_id.clone(),
            "orders",
            "orders__token_id",
        ),
    };
    IndexedMap::new("orders", indexes)
}

pub const CONTRACT_INFO: Item<ContractInfo> = Item::new("contract_info");
pub const ORDERS: Map<String, OrderInfo> = Map::new("orders");
pub const ORDER_COUNT: Item<u32> = Item::new("order_count");
