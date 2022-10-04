use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, StdResult, Storage, Uint128};
use cw0::Expiration;
use cw_storage_plus::{Item, Map, IndexedMap, MultiIndex, IndexList, UniqueIndex, U32Key, Index, U8Key, U128Key};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ContractConfig {
    pub owner: Addr,
    pub cw721: Addr,
    pub paused: bool
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BiddingInfo {
    pub bids_limit: u8,
    pub duration: u64, // length of bidding window in blocks
    pub pause_duration: u64, // length of bidding pause between bidding windows
    pub start: u64, // starting block height
    pub expires: Expiration // end block height
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

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct TierInfo {
    pub max_physical_limit: u8,
    pub cost: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BidInfo {
    pub bid_amount: Uint128,
    pub token_id: String,
    pub owner: Addr,
}

impl TierInfo {
    pub fn costs_sum(&self) -> u64 {
        let shipping_cost = 10 * 1_000_000;
        return self.cost + shipping_cost;
    }
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


pub const CONTRACT_CONFIG: Item<ContractConfig> = Item::new("contract_info");

pub const TIERS: Map<U8Key, TierInfo> = Map::new("tiers");
pub fn load_tier_info(storage: &dyn Storage, tier: u8, ) -> StdResult<TierInfo> {
    TIERS.load(storage, U8Key::from(tier))
}

pub const BIDS: Map<U8Key, BidInfo> = Map::new("bids");
pub const BIDDING_INFO: Item<BiddingInfo> = Item::new("bidding_info");

pub const PHYSICALS: Map<U128Key, Cw721PhysicalInfo> = Map::new("physicals");
pub const PHYSICALS_COUNT: Item<u32> = Item::new("physicals_count");



