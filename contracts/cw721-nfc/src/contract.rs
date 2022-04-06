#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, QueryRequest, WasmQuery, Storage, Order, Uint128};
use cw0::maybe_addr;
use cw2::set_contract_version;
use cw721_base::msg::QueryMsg::{OwnerOf};
use cw721::{OwnerOfResponse};
use cw_storage_plus::{Bound, PrimaryKey, U32Key, U8Key};

use crate::error::ContractError;
use crate::msg::{AllPhysicalsResponse, Cw721AddressResponse, ExecuteMsg, InstantiateMsg, Cw721PhysicalInfoResponse, Cw721PhysicalsResponse, QueryMsg};
use crate::state::{ContractInfo, CONTRACT_INFO, Cw721PhysicalInfo, ORDER_COUNT, physicals, TIERS, TierInfo};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:cw721-nfc";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

const DEFAULT_LIMIT: u32 = 10;
const MAX_LIMIT: u32 = 30;

const UUSD_DENOM: &str = "uusd";

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let contract_info = ContractInfo {
        owner: info.sender.clone(),
        cw721: msg.cw721
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    CONTRACT_INFO.save(deps.storage, &contract_info)?;

    // Pass this as init message
    TIERS.save(deps.storage, U8Key::from(1), &TierInfo { max_physical_limit: 1, cost: 2500 * 1_000_000 })?;
    TIERS.save(deps.storage, U8Key::from(2), &TierInfo { max_physical_limit: 10, cost: 120 * 1_000_000 })?;
    TIERS.save(deps.storage, U8Key::from(3), &TierInfo { max_physical_limit: 3, cost: 0 })?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("cw721", contract_info.cw721.as_str()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::OrderCw721Physical { token_id, tier} => order_cw721_physical(deps, info, token_id, tier)
    }
}
fn order_cw721_physical(deps: DepsMut, info: MessageInfo, token_id: String, tier: String) -> Result<Response, ContractError> {
    // check tier
    let tier : u8= tier.parse().unwrap();
    if tier < 1 || tier > 3{
        return Err(ContractError::InvalidTier {})
    }
    // check token ownership
    let owner: OwnerOfResponse =
        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: CONTRACT_INFO.load(deps.storage)?.cw721.to_string(),
            msg: to_binary(&OwnerOf {
                token_id: token_id.clone(),
                include_expired: None
            })?,
        }))?;
    if owner.owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    // create order and validate order
    let order = Cw721PhysicalInfo {
        id: order_count(deps.storage).unwrap() + 1,
        token_id: token_id.clone(),
        owner: info.sender.clone(),
        tier,
        status: "PENDING".to_string()
    };

    // Get physical items by 'token_id' and filter by 'tier'
    let physical_vec : Vec<Cw721PhysicalInfo> = physicals()
        .idx.token_id
        .prefix(order.token_id.to_string())
        .range(deps.storage, None, None, Order::Ascending)
        .map(|item| item.map(|(_, v)| v))
        .filter(|item| item.as_ref().unwrap().tier == order.tier)
        .collect::<StdResult<_>>().unwrap();


    let tier_info = TIERS.load(
        deps.storage,
        U8Key::from(U8Key::from(order.tier))).unwrap();


    // Check if funds empty or multiple native coins sent by the user
    if info.funds.len() != 1 {
        return Err(ContractError::OnlyUSTAccepted {});
    }
    // Only UST accepted
    let native_token = info.funds.first().unwrap();
    if native_token.denom != *UUSD_DENOM {
        return Err(ContractError::OnlyUSTAccepted {});
    }
    // Only exact amount of UST accepted
    if native_token.amount != Uint128::from(tier_info.costs_sum()) {
        return Err(ContractError::InvalidUSTAmount {
            required: tier_info.costs_sum() as u128,
            sent: native_token.amount.u128()});
    }

    // validate  order
    let mut tier_count = 0;
    for i in physical_vec.iter(){
        // Sender can not order same physical item
        if i.owner == order.owner {
            return Err(ContractError::AlreadyOwned {});
        }
        tier_count += 1;
        if tier_count == tier_info.max_physical_limit{
            return match order.tier {
                1 => Err(ContractError::MaxTier1Items {}),
                2 => Err(ContractError::MaxTier2Items {}),
                3 => Err(ContractError::MaxTier3Items {}),
                _ => panic!("Unexpected invalid tier")
            }
        }
    }

    // save order and increment counter
    physicals().save(deps.storage, &U32Key::from(order.id).joined_key(), &order).unwrap();
    increment_orders(deps.storage).unwrap();

    Ok(Response::default())
}


fn order_count(storage: &dyn Storage) -> StdResult<u32> {
    Ok(ORDER_COUNT.may_load(storage)?.unwrap_or_default())
}

fn increment_orders(storage: &mut dyn Storage) -> StdResult<u32> {
    let val = order_count(storage)? + 1;
    ORDER_COUNT.save(storage, &val)?;
    Ok(val)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetCw721Address {} => to_binary(&query_cw721_address(deps)?),
        QueryMsg::GetCw721TokenOwner {token_id} => to_binary(&query_cw721_token_owner(deps, token_id)?),
        QueryMsg::GetCw721PhysicalInfo {token_id} => to_binary(&query_physical_info(deps, token_id)?),
        QueryMsg::Cw721Physicals {token_id, start_after, limit} => to_binary(&query_physicals(deps, token_id, start_after, limit)?),
        QueryMsg::AllCw721Physicals {start_after, limit} => to_binary(&query_all_physicals(deps, start_after, limit)?),
    }
}

fn query_cw721_address(deps: Deps) -> StdResult<Cw721AddressResponse> {
    let state = CONTRACT_INFO.load(deps.storage)?;
    Ok(Cw721AddressResponse { cw721: state.cw721 })
}

fn query_cw721_token_owner(deps: Deps, token_id: String) -> StdResult<OwnerOfResponse> {
    let state = CONTRACT_INFO.load(deps.storage)?;
    let owner: OwnerOfResponse =
        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: state.cw721.to_string(),
            msg: to_binary(&OwnerOf {
                token_id,
                include_expired: None
            })?,
        }))?;
    Ok(owner)
}

fn query_physical_info(deps: Deps, physical_id: String) -> StdResult<Cw721PhysicalInfoResponse> {
    let order_id_int: u32 = physical_id.parse().unwrap();
    let physical = physicals().load(deps.storage, &U32Key::from(order_id_int).joined_key())?;
    Ok(Cw721PhysicalInfoResponse { physical })
}

fn query_physicals(
    deps: Deps,
    token_id: String,
    start_after: Option<String>,
    limit: Option<u32>
) -> StdResult<Cw721PhysicalsResponse> {
    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    let start_id = maybe_addr(deps.api, start_after)?;
    let start = start_id.map(|id| Bound::exclusive(id.as_ref()));

    let physicals:  StdResult<Vec<String>> = physicals()
        .idx.token_id
        .prefix(token_id)
        .range(deps.storage, start, None, Order::Ascending)
        .map(|item| item.map(|(_, v)| v.id.to_string()))
        .take(limit)
        .collect();

    Ok(Cw721PhysicalsResponse { physicals: physicals? })
}

fn query_all_physicals(deps: Deps,
                       start_after: Option<String>,
                       limit: Option<u32>
) -> StdResult<AllPhysicalsResponse> {
    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    let start_id = maybe_addr(deps.api, start_after)?;
    let start = start_id.map(|id| Bound::exclusive(id.as_ref()));

    let physicals: StdResult<Vec<String>> = physicals()
        .range(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .map(|item| item.map(|(_, v)| v.id.to_string()))
        .collect();
    Ok(AllPhysicalsResponse {physicals: physicals?})
}
