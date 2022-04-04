#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, QueryRequest, WasmQuery, Storage, Order};
use cw0::maybe_addr;
use cw2::set_contract_version;
use cw721_base::msg::QueryMsg::{OwnerOf};
use cw721::{OwnerOfResponse};
use cw_storage_plus::{Bound, PrimaryKey, U32Key, U8Key};

use crate::error::ContractError;
use crate::msg::{AllPhysicalsResponse, Cw721AddressResponse, ExecuteMsg, InstantiateMsg, PhysicalResponse, PhysicalsResponse, QueryMsg};
use crate::state::{ContractInfo, CONTRACT_INFO, PhysicalInfo, ORDER_COUNT, physicals, TIER_LIMIT};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:cw721-nfc";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

const DEFAULT_LIMIT: u32 = 10;
const MAX_LIMIT: u32 = 30;

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
    TIER_LIMIT.save(deps.storage, U8Key::from(1),  &1);
    TIER_LIMIT.save(deps.storage, U8Key::from(2), &10);
    TIER_LIMIT.save(deps.storage, U8Key::from(3), &3);

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
        ExecuteMsg::CreateOrder { token_id, tier} => create_order(deps, info, token_id, tier)
    }
}
fn create_order(deps: DepsMut, info: MessageInfo, token_id: String, tier: String) -> Result<Response, ContractError> {
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

    // create and validate order
    let order = PhysicalInfo {
        id: order_count(deps.storage).unwrap() + 1,
        token_id: token_id.clone(),
        owner: info.sender.clone(),
        tier,
        status: "PENDING".to_string()
    };

    // Get physical items by 'token_id' and filter by 'tier'
    let physical_vec : Vec<PhysicalInfo> = physicals()
        .idx.token_id
        .prefix(order.token_id.to_string())
        .range(deps.storage, None, None, Order::Ascending)
        .map(|item| item.map(|(_, v)| v))
        .filter(|item| item.as_ref().unwrap().tier == order.tier)
        .collect::<StdResult<_>>().unwrap();


    let max_tier_limit = TIER_LIMIT.load(
        deps.storage,
        U8Key::from(U8Key::from(order.tier))).unwrap();


    let mut tier_count = 0;
    for i in physical_vec.iter(){
        // Sender can not order same physical item
        if i.owner == order.owner {
            return Err(ContractError::AlreadyOwned {});
        }
        tier_count += 1;
        if tier_count == max_tier_limit{
            return match order.tier {
                1 => Err(ContractError::MaxTier1Items {}),
                2 => Err(ContractError::MaxTier2Items {}),
                3 => Err(ContractError::MaxTier3Items {}),
                _ => panic!("Unexpected invalid tier"),
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
        QueryMsg::GetOrderInfo {token_id} => to_binary(&query_physical_info(deps, token_id)?),
        QueryMsg::AllOrders {start_after, limit} => to_binary(&query_all_orders(deps, start_after, limit)?),
        QueryMsg::Physicals {token_id, start_after, limit} => to_binary(&query_physicals(deps, token_id, start_after, limit)?),
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

fn query_physical_info(deps: Deps, physical_id: String) -> StdResult<PhysicalResponse> {
    let order_id_int: u32 = physical_id.parse().unwrap();
    let physical = physicals().load(deps.storage, &U32Key::from(order_id_int).joined_key())?;
    Ok(PhysicalResponse { physical })
}

fn query_physicals(
    deps: Deps,
    token_id: String,
    start_after: Option<String>,
    limit: Option<u32>
) -> StdResult<PhysicalsResponse> {
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

    Ok(PhysicalsResponse { physicals: physicals? })
}

fn query_all_orders(deps: Deps,
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

#[cfg(test)]
mod tests {

    use super::*;
    use cosmwasm_std::testing::{mock_env, mock_info};
    use super::super::testing::mock_dependencies;
    use cosmwasm_std::{Addr, coins, from_binary, StdError};
    use crate::msg::ExecuteMsg::CreateOrder;

    const CW721_ADDRESS: &str = "cw721-contract";

    fn setup_contract(deps: DepsMut<'_>){
        let msg = InstantiateMsg {
            cw721: Addr::unchecked(CW721_ADDRESS),
        };
        let info = mock_info("creator", &[]);
        let res = instantiate(deps, mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());
    }

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies();

        let cw721_address = Addr::unchecked(CW721_ADDRESS);

        let msg = InstantiateMsg { cw721:  cw721_address.clone()};
        let info = mock_info("creator", &coins(1000, "earth"));

        // we can just call .unwrap() to assert this was a success
        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());

        // it worked, let's query the state
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCw721Address {}).unwrap();
        let value: Cw721AddressResponse = from_binary(&res).unwrap();
        assert_eq!(cw721_address, value.cw721);
    }

    #[test]
    fn creating_order() {
        // physical items data
        let physical = PhysicalInfo {
            id: 1,
            token_id: "1".to_string(),
            owner: Addr::unchecked("alice"),
            tier: 3,
            status: "PENDING".to_string()
        };

        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        deps.querier.set_cw721_token("alice", 1);

        // random cannot create order
        let info = mock_info("chuck", &[]);
        let msg = CreateOrder { token_id: "1".to_string(), tier: "3".to_string()};
        let err =
            execute(deps.as_mut(), mock_env(), info, msg.clone())
                .unwrap_err();
        assert_eq!(err, ContractError::Unauthorized {});

        // alice can create order
        let info = mock_info("alice", &[]);
        let msg = CreateOrder { token_id: 1.to_string(), tier: "3".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());

        // orders info is correct
        let query_order_msg = QueryMsg::GetOrderInfo {token_id: "1".to_string()};
        let res = query(deps.as_ref(),mock_env(), query_order_msg).unwrap();
        let pyhsical: PhysicalResponse = from_binary(&res).unwrap();
        assert_eq!(physical, pyhsical.physical);

        // alice cannot order physical item of same tier twice
        let info = mock_info("alice", &[]);
        let msg = CreateOrder { token_id: 1.to_string(), tier: "3".to_string()};
        let err = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap_err();
        assert_eq!(err, ContractError::AlreadyOwned {});

        // alice can still order physical item of tier 1 and 2
        let info = mock_info("alice", &[]);
        let msg = CreateOrder { token_id: 1.to_string(), tier: "1".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());
        let info = mock_info("alice", &[]);
        let msg = CreateOrder { token_id: 1.to_string(), tier: "2".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());

        // query all orders
        let query_order_msg = QueryMsg::AllOrders { start_after: None, limit: None };
        let res = query(deps.as_ref(),mock_env(), query_order_msg).unwrap();
        let physicals: AllPhysicalsResponse = from_binary(&res).unwrap();
        assert_eq!(3, physicals.physicals.len());
        assert_eq!(vec!["1", "2", "3"], physicals.physicals);
    }

    #[test]
    fn querying_token_ownership() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        deps.querier.set_cw721_token("alice", 1);
        deps.querier.set_cw721_token("bob", 2);

        let res = query(deps.as_ref(), mock_env(),
                        QueryMsg::GetCw721TokenOwner {
                            token_id: "1".to_string()
                        }).unwrap();
        let value: OwnerOfResponse = from_binary(&res).unwrap();
        assert_eq!("alice", value.owner);

        let res = query(deps.as_ref(), mock_env(),
                        QueryMsg::GetCw721TokenOwner {
                            token_id: "2".to_string()
                        }).unwrap();
        let value: OwnerOfResponse = from_binary(&res).unwrap();
        assert_eq!("bob", value.owner);
    }

    #[test]
    fn creating_order_with_wrong_tier() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        // cannot create order with wrong tier(=0)
        let info = mock_info("alice", &[]);
        let msg = CreateOrder { token_id: 1.to_string(), tier: 0.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::InvalidTier {});

        // tier = 4
        let msg = CreateOrder { token_id: 1.to_string(), tier: 4.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::InvalidTier {});
    }

    #[test]
    fn creating_max_possible_orders_per_token() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        deps.querier.set_cw721_token("alice", 1);
        let info = mock_info("alice", &[]);

        // alice orders tier 1, 2 and 3
        for x in 1..4 {
            // creates an order
            let msg = CreateOrder { token_id: 1.to_string(), tier: x.to_string()};
            let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
            assert_eq!(0, res.messages.len());
            // can't have a duplicate physical item
            let msg = CreateOrder { token_id: 1.to_string(), tier: x.to_string()};
            let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
            assert_eq!(err, ContractError::AlreadyOwned {});
        }

        // alice sells/transfers NFT to bob
        deps.querier.transfer_cw721_token("bob", 1);
        let info = mock_info("bob", &[]);

        // bob cannot order tier 1
        let msg = CreateOrder { token_id: 1.to_string(), tier: 1.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::MaxTier1Items {});
        // bob orders tier 2 and 3
        for x in 2..4 {
            // creates an order
            let msg = CreateOrder { token_id: 1.to_string(), tier: x.to_string()};
            let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
            assert_eq!(0, res.messages.len());
            // can't have a duplicate physical item
            let msg = CreateOrder { token_id: 1.to_string(), tier: x.to_string()};
            let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
            assert_eq!(err, ContractError::AlreadyOwned {});
        }

        // bob sells/transfers NFT to chuck
        deps.querier.transfer_cw721_token("chuck", 1);
        let info = mock_info("chuck", &[]);

        // chuck orders tier 2 and 3
        for x in 2..4 {
            let msg = CreateOrder { token_id: 1.to_string(), tier: x.to_string()};
            let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
            assert_eq!(0, res.messages.len());
            // can't have a duplicate physical item
            let msg = CreateOrder { token_id: 1.to_string(), tier: x.to_string()};
            let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
            assert_eq!(err, ContractError::AlreadyOwned {});
        }

        // chuck sells/transfers NFT to david
        deps.querier.transfer_cw721_token("david", 1);
        let info = mock_info("david", &[]);

        // david cannot order tier 3
        let msg = CreateOrder { token_id: 1.to_string(), tier: 3.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::MaxTier3Items {});


        // david orders tier 2
        let msg = CreateOrder { token_id: 1.to_string(), tier: 2.to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());

        // token transfers to other accounts and all of the physical items are ordered out
        let mut accounts= Vec::from(["Eve", "Faythe", "Grace", "Heidi", "Ivan", "Judy", "Mike"]);
        while let Some(account) = accounts.pop() {
            deps.querier.transfer_cw721_token(account, 1);
            let info = mock_info(account, &[]);
            let msg = CreateOrder { token_id: 1.to_string(), tier: 2.to_string()};
            let result = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone());
            match result {
                Ok(res)  => { assert_eq!(0, res.messages.len()); }
                Err(err) => {
                    assert_eq!(err, ContractError::MaxTier2Items {});
                    break;
                }
            }
        }
    }

    #[test]
    fn query_physicals_by_token_id() {
        // physical items data responses
        let physical1 = PhysicalInfo {
            id: 1,
            token_id: 1.to_string(),
            owner: Addr::unchecked("alice"),
            tier: 3,
            status: "PENDING".to_string()
        };
        let physical2 = PhysicalInfo {
            id: 2,
            token_id: 1.to_string(),
            owner: Addr::unchecked("alice"),
            tier: 3,
            status: "PENDING".to_string()
        };
        let physical3 = PhysicalInfo {
            id: 3,
            token_id: 2.to_string(),
            owner: Addr::unchecked("bob"),
            tier: 3,
            status: "PENDING".to_string()
        };

        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        deps.querier.set_cw721_token("alice", 1);
        deps.querier.set_cw721_token("bob", 2);

        // alice orders 2 physical items
        let info = mock_info("alice", &[]);
        let msg = CreateOrder { token_id: "1".to_string(), tier: "3".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());
        let msg = CreateOrder { token_id: "1".to_string(), tier: "2".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());

        // bob orders 1 physical items
        let info = mock_info("bob", &[]);
        let msg = CreateOrder { token_id: "2".to_string(), tier: "3".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());

        // query alice's physical orders by token ID
        let query_physicals_msg = QueryMsg::Physicals {token_id: "1".to_string(), start_after: None, limit: None };
        let res = query(deps.as_ref(),mock_env(), query_physicals_msg).unwrap();
        let physicals: PhysicalsResponse = from_binary(&res).unwrap();
        assert_eq!(2, physicals.physicals.len());
        assert_eq!(vec![physical1.id.to_string(), physical2.id.to_string()], physicals.physicals);

        // query bob's physical orders by token ID
        let query_physicals_msg = QueryMsg::Physicals {token_id: "2".to_string(), start_after: None, limit: None };
        let res = query(deps.as_ref(),mock_env(), query_physicals_msg).unwrap();
        let physicals: PhysicalsResponse = from_binary(&res).unwrap();
        assert_eq!(1, physicals.physicals.len());
        assert_eq!(vec![physical3.id.to_string()], physicals.physicals);
    }
}
