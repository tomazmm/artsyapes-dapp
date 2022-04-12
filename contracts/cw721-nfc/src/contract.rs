#[cfg(not(feature = "library"))]


use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, QueryRequest, WasmQuery, Storage, Order, Uint128, Coin, Addr, BankMsg, coin, BlockInfo};
use cosmwasm_std::CosmosMsg::Bank;
use cw0::{Expiration, maybe_addr};
use cw2::set_contract_version;
use cw721_base::msg::QueryMsg::{OwnerOf};
use cw721::{OwnerOfResponse};
use cw_storage_plus::{Bound, PrimaryKey, U32Key, U8Key};

use crate::error::ContractError;
use crate::msg::{AllPhysicalsResponse, Cw721AddressResponse, ExecuteMsg, InstantiateMsg, Cw721PhysicalInfoResponse, Cw721PhysicalsResponse, QueryMsg, TierInfoResponse, BidsResponse};
use crate::msg::QueryMsg::Bids;
use crate::state::{ContractInfo, CONTRACT_INFO, Cw721PhysicalInfo, PHYSICALS_COUNT, physicals, TIERS, TierInfo, BID_LIMIT, BIDS, BidInfo, BIDING_DURATION, BIDING_EXPIRATION, load_tier_info};

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

    // Starting/opening bid for the auction of masterpiece/tier-1
    TIERS.save(deps.storage, U8Key::from(1), &TierInfo {
        max_physical_limit: 1,
        cost: 2500 * 1_000_000
    })?;
    // Fixed prices for the tier-2/-3
    TIERS.save(deps.storage, U8Key::from(2), &TierInfo {
        max_physical_limit: 10,
        cost: 120 * 1_000_000
    })?;
    TIERS.save(deps.storage, U8Key::from(3), &TierInfo {
        max_physical_limit: 3,
        cost: 0
    })?;

    BID_LIMIT.save(deps.storage, &1)?;
    BIDING_DURATION.save(deps.storage, &90720)?;
    BIDING_EXPIRATION.save(deps.storage, &Expiration::AtHeight(_env.block.height + 90720))?;

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
        ExecuteMsg::OrderCw721Print { token_id, tier} => {
            assert_ust(info.funds.clone())?;
            order_cw721_print(deps, info, token_id, tier)
        },
        ExecuteMsg::Bid721Masterpiece { token_id} => {
            assert_ust(info.funds.clone())?;
            process_auction(deps.storage, _env.block)?;
            place_bid(deps, info, token_id)
        },
        ExecuteMsg::UpdateTierInfo { tier, max_physical_limit, cost} => {
            update_tier_info(deps, info, tier, max_physical_limit, cost)
        }
    }
}
fn order_cw721_print(deps: DepsMut, info: MessageInfo, token_id: String, tier: String) -> Result<Response, ContractError> {
    // validate tier
    let tier : u8= tier.parse().unwrap();
    if tier != 2 && tier != 3 {
        return Err(ContractError::InvalidTier {})
    }
    // check token ownership
    let owner: OwnerOfResponse = query_cw721_owner(deps.as_ref(), token_id.clone()).unwrap();
    if owner.owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }
    // Only exact amount of UST accepted
    let tier_info = load_tier_info(deps.storage, tier)?;
    let ust_amount = info.funds.first().unwrap().amount;
    if ust_amount != Uint128::from(tier_info.costs_sum()) {
        return Err(ContractError::InvalidUSTAmount {
            required: tier_info.costs_sum() as u128,
            sent: ust_amount.u128()});
    }

    validate_order(deps.storage, &info.sender, &token_id, tier)?;
    // Save Cw721Physical item and increment counter
    let cw721_physical_id = order_count(deps.storage).unwrap() + 1;
    physicals().save(deps.storage, &U32Key::from(cw721_physical_id).joined_key(), &Cw721PhysicalInfo {
        id: cw721_physical_id,
        token_id: token_id.clone(),
        owner: info.sender.clone(),
        tier,
        status: "PENDING".to_string()
    })?;
    increment_orders(deps.storage)?;

    Ok(Response::default())
}

fn place_bid(
    deps: DepsMut,
    info: MessageInfo,
    token_id: String
) -> Result<Response, ContractError> {
    // check token ownership
    let owner: OwnerOfResponse = query_cw721_owner(deps.as_ref(), token_id.clone()).unwrap();
    if owner.owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    validate_order(deps.storage, &info.sender, &token_id, 1)?;

    // fetch all on-going bids
    let bids : Vec<_> = BIDS
        .range(deps.storage, None, None, Order::Ascending)
        .collect::<StdResult<_>>().unwrap();

    let bids_length = bids.len() as u8;
    let ust_amount = info.funds.first().unwrap().amount;

    // Still a free spot available with minimum bid
    if bids_length < BID_LIMIT.load(deps.storage)? {
        // Amount of UST must be equal or greater than minimum bid
        let tier1_info = load_tier_info(deps.storage, 1)?;
        if ust_amount < Uint128::from(tier1_info.costs_sum()) {
            return Err(ContractError::InvalidUSTAmount {
                required: tier1_info.costs_sum() as u128,
                sent: ust_amount.u128()
            });
        }
        // Save bid into state
        BIDS.save(deps.storage, U8Key::from(bids_length + 1), &BidInfo{
            bid_amount: ust_amount,
            token_id,
            owner: info.sender.clone()
        })?;
        return Ok(Response::default());
    }
    else {
        // Check if overbids any of current bids
        let possible_over_bids = bids
            .iter()
            .find(|(_, bid)| ust_amount > bid.bid_amount);

        return match possible_over_bids {
            None => Err(ContractError::LowBidding {}),
            Some((id, old_bid)) => {
                // Craft message to return UST to bidder
                let return_ust_msg = Bank(BankMsg::Send {
                    to_address: old_bid.owner.to_string(),
                    amount: vec![
                        Coin {
                            denom: UUSD_DENOM.to_string(),
                            amount: old_bid.bid_amount,
                        },
                    ],
                });
                // Save the new bid
                BIDS.save(deps.storage, U8Key::from(id[0]), &BidInfo{
                    bid_amount:ust_amount,
                    token_id,
                    owner: info.sender.clone()
                })?;
                Ok(Response::new().add_message(return_ust_msg))
            }
        };
    }
}

fn update_tier_info(deps: DepsMut,
                    info: MessageInfo,
                    tier: u8,
                    max_physical_limit: u8,
                    cost: u64
) -> Result<Response, ContractError> {
    let state = CONTRACT_INFO.load(deps.storage)?;
    if state.owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }
    if tier < 1 || tier > 3{
        return Err(ContractError::InvalidTier {})
    }
    if max_physical_limit == 0 {
        return Err(ContractError::TierMaxLimitIsZero {})
    }

    let tier_info = TierInfo { max_physical_limit, cost };
    TIERS.save(deps.storage, U8Key::from(tier), &tier_info)?;

    Ok(Response::default())
}

fn order_count(storage: &dyn Storage) -> StdResult<u32> {
    Ok(PHYSICALS_COUNT.may_load(storage)?.unwrap_or_default())
}

fn increment_orders(storage: &mut dyn Storage) -> StdResult<u32> {
    let val = order_count(storage)? + 1;
    PHYSICALS_COUNT.save(storage, &val)?;
    Ok(val)
}

fn validate_order(
    storage: &dyn Storage,
    sender: &Addr,
    token_id: &String,
    tier: u8
) -> Result<(), ContractError> {
    let tier_info = load_tier_info(storage, tier)?;
    // Get physical items by 'token_id' and filter by 'tier'
    let physical_vec : Vec<Cw721PhysicalInfo> = physicals()
        .idx.token_id
        .prefix(token_id.to_string())
        .range(storage, None, None, Order::Ascending)
        .map(|item| item.map(|(_, v)| v))
        .filter(|item| item.as_ref().unwrap().tier == tier)
        .collect::<StdResult<_>>().unwrap();

    // validate  order
    let mut tier_count = 0;
    for i in physical_vec.iter(){
        // Sender can not order same physical item
        if i.owner == *sender {
            return Err(ContractError::AlreadyOwned {});
        }
        tier_count += 1;
        if tier_count == tier_info.max_physical_limit{
            return match tier {
                1 => Err(ContractError::MaxTier1Items {}),
                2 => Err(ContractError::MaxTier2Items {}),
                3 => Err(ContractError::MaxTier3Items {}),
                _ => panic!("Unexpected invalid tier")
            }
        }
    }
    Ok(())
}

/// ## Description
/// If auction expired:
/// - process all the bids and creates the physicals items.
/// - updates the bidding_expiration state variable
/// Returns [`Ok`]
fn process_auction(storage: &mut dyn Storage, block: BlockInfo) -> Result<(), ContractError> {
    if BIDING_EXPIRATION.load(storage)?.is_expired(&block) {
        // fetch all on-going bids
        let bids : Vec<_> = BIDS
            .range(storage, None, None, Order::Ascending)
            .collect::<StdResult<_>>().unwrap();
        for (key, bid) in bids.iter() {
            // Remove bid
            BIDS.remove(storage, U8Key::from(key[0]));
            // Create and save Cw721Physical item and increment counter
            let cw721_physical_id = order_count(storage).unwrap() + 1;
            physicals().save(storage, &U32Key::from(cw721_physical_id).joined_key(), &Cw721PhysicalInfo {
                id: cw721_physical_id,
                token_id: bid.token_id.clone(),
                owner: bid.owner.clone(),
                tier: 1,
                status: "PENDING".to_string()
            })?;
            increment_orders(storage)?;
        }
        let bidding_duration = BIDING_DURATION.load(storage)? as u64;
        let bidding_expiration = &Expiration::AtHeight(block.height + bidding_duration);
        BIDING_EXPIRATION.save(storage, bidding_expiration)?;
    }
    Ok(())
}


/// ## Description
/// Verifies that funds sent to contract is UST only
/// Returns [`Ok`] if only 'UST' is sent to ContractError, otherwise returns [`ContractError`]
/// ## Params
/// * **funds** is an object of type [`Vec<Coin>`]
fn assert_ust(funds: Vec<Coin>) -> Result<(), ContractError> {
    // Check if funds empty or multiple native coins sent by the user
    if funds.len() != 1 {
        return Err(ContractError::OnlyUSTAccepted {});
    }
    // Only UST accepted
    let native_token = funds.first().unwrap();
    if native_token.denom != *UUSD_DENOM {
        return Err(ContractError::OnlyUSTAccepted {});
    }
    Ok(())
}


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetCw721Address {} =>
            to_binary(&query_cw721_address(deps)?),
        QueryMsg::GetCw721PhysicalInfo {token_id} =>
            to_binary(&query_physical_info(deps, token_id)?),
        QueryMsg::Cw721Physicals {token_id, start_after, limit} =>
            to_binary(&query_physicals(deps, token_id, start_after, limit)?),
        QueryMsg::AllCw721Physicals {start_after, limit} =>
            to_binary(&query_all_physicals(deps, start_after, limit)?),
        QueryMsg::Bids {} =>
            to_binary(&query_bids(deps.storage)?),
        QueryMsg::TierInfo {tier} =>
            to_binary(&query_tier_info(deps, tier)?)
    }
}

fn query_cw721_address(deps: Deps) -> StdResult<Cw721AddressResponse> {
    let state = CONTRACT_INFO.load(deps.storage)?;
    Ok(Cw721AddressResponse { cw721: state.cw721 })
}

fn query_cw721_owner(deps: Deps, token_id: String) -> StdResult<OwnerOfResponse> {
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

fn query_tier_info(deps: Deps, tier: u8) -> StdResult<TierInfoResponse> {
    let tier_info = load_tier_info(deps.storage, tier)?;
    Ok(TierInfoResponse {
        max_physical_limit: tier_info.max_physical_limit,
        cost: tier_info.cost
    })
}

fn query_bids(storage: &dyn Storage) -> StdResult<BidsResponse> {
    let bids : Vec<BidInfo> = BIDS
        .range(storage, None, None, Order::Ascending)
        .map(|pair|pair.map(|(_, bid)|bid))
        .collect::<StdResult<_>>().unwrap();
    Ok(BidsResponse{bids})
}