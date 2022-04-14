use cosmwasm_std::Addr;
use cw0::Expiration;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use crate::state::{BidInfo, Cw721PhysicalInfo, TierInfo};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub cw721: Addr,
    pub tier_info: [TierInfo; 3],
    pub bids_limit: u8,
    pub bidding_duration: u64
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    OrderCw721Print {
        token_id: String,
        tier: String
    },
    Bid721Masterpiece {
        token_id: String
    },
    UpdateTierInfo {
        tier: u8,
        max_physical_limit: u8,
        cost: u64
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetCw721Address {},
    GetCw721PhysicalInfo {
        token_id: String
    },
    Cw721Physicals {
        token_id: String,
        start_after: Option<String>,
        limit: Option<u32>,
    },
    AllCw721Physicals {
        start_after: Option<String>,
        limit: Option<u32>,
    },
    BiddingInfo {},
    Bids {},
    TierInfo {
        tier: u8
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Cw721AddressResponse {
    pub cw721: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Cw721PhysicalInfoResponse {
    pub physical: Cw721PhysicalInfo,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Cw721PhysicalsResponse {
    pub physicals: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AllPhysicalsResponse {
    pub physicals: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct TierInfoResponse {
    pub max_physical_limit: u8,
    pub cost: u64
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BidsResponse {
    pub bids: Vec<BidInfo>
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct BiddingInfoResponse {
    pub bids_limit: u8,
    pub duration: u64,
    pub expiration: Expiration
}



