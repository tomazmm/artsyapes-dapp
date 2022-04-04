use cosmwasm_std::Addr;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use crate::state::Cw721PhysicalInfo;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub cw721: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    OrderCw721Physical {
        token_id: String,
        tier: String
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetCw721Address {},
    GetCw721TokenOwner {
        token_id: String
    },
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

