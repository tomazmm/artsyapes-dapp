#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, QueryRequest, WasmQuery, QuerierWrapper, Uint128, Storage, Order};
use cosmwasm_std::OverflowOperation::Add;
use cw2::set_contract_version;
use cw721_base::msg::QueryMsg::{OwnerOf};
use cw721::{OwnerOfResponse};
use cw_storage_plus::{Bound, PrimaryKey, U32Key};

use crate::error::ContractError;
use crate::msg::{AllOrdersResponse, Cw721AddressResponse, ExecuteMsg, InstantiateMsg, OrderResponse, QueryMsg};
use crate::state::{ContractInfo, CONTRACT_INFO, OrderInfo, ORDERS, ORDER_COUNT, orders};

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
    let state = CONTRACT_INFO.load(deps.storage)?;
    let owner: OwnerOfResponse =
        deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: state.cw721.to_string(),
            msg: to_binary(&OwnerOf {
                token_id: token_id.clone(),
                include_expired: None
            })?,
        }))?;

    if owner.owner != info.sender {
        return Err(ContractError::Unauthorized {});
    }

    let order = OrderInfo{
        id: increment_orders(deps.storage).unwrap(),
        token_id: token_id.clone(),
        owner: info.sender.clone(),
        tier,
        status: "PENDING".to_string()
    };

    orders().save(deps.storage, &U32Key::from(order.id).joined_key(), &order).unwrap();

    Ok(Response::new().add_attribute("Order ID", order.id.to_string()))
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
        QueryMsg::GetOrderInfo {token_id} => to_binary(&query_order(deps, token_id)?),
        QueryMsg::AllOrders {start_after, limit} => to_binary(&query_all_orders(deps, start_after, limit)?),
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

fn query_order(deps: Deps, order_id: String) -> StdResult<OrderResponse> {
    let order_id_int: u32 = order_id.parse().unwrap();
    let order = orders().load(deps.storage, &U32Key::from(order_id_int).joined_key())?;
    Ok(OrderResponse{order})
}

fn query_all_orders(deps: Deps,
                    start_after: Option<String>,
                    limit: Option<u32>
) -> StdResult<AllOrdersResponse> {
    let limit = limit.unwrap_or(DEFAULT_LIMIT).min(MAX_LIMIT) as usize;
    let start_id = maybe_addr(deps.api, start_after)?;
    let start = start_id.map(|id| Bound::exclusive(id.as_ref()));

    let orders: StdResult<Vec<String>> =
        orders
        .range(deps.storage, start, None, Order::Ascending)
        .take(limit)
        .map(|item| item.map(|(k, _)| String::from_utf8_lossy(&k).to_string()))
        .collect();
    Ok(AllOrdersResponse{orders: orders?})
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
    fn creating_order() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        deps.querier.set_cw721_token("alice", 1);
        deps.querier.set_cw721_token("bob", 2);

        // query not created order
        let err = query(deps.as_ref(), mock_env(),
                        QueryMsg::GetOrder {token_id: "3".to_string()}).unwrap_err();
        assert_eq!(err, StdError::not_found("cw721_nfc::state::OrderInfo"));

        // random cannot create order
        let info = mock_info("chuck", &[]);
        let msg = CreateOrder { token_id: "1".to_string(), tier: "3".to_string()};
        let err =
            execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap_err();
        // assert_eq!(err, ContractError::Unauthorized {});

        // owner can create order
        let info = mock_info("alice", &[]);
        let msg = CreateOrder { token_id: "1".to_string(), tier: "3".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());

        // order info is correct
        let query_order_msg = QueryMsg::GetOrder {token_id: "1".to_string()};
        let res = query(deps.as_ref(),mock_env(), query_order_msg).unwrap();
        let order: OrderResponse = from_binary(&res).unwrap();
        assert_eq!(OrderInfo{
            id: 1,
            token_id: "1".to_string(),
            owner: Addr::unchecked("alice"),
            tier: "3".to_string(),
            status: "PENDING".to_string()
        }, order.order);

        // query all orders
        let query_order_msg = QueryMsg::AllOrders {};

        // create a duplicate order
        // let info = mock_info("alice", &[]);
        // let msg = CreateOrder { token_id: "1".to_string(), tier: "3".to_string()};
        // let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
        //     .unwrap();
        // assert_eq!(0, res.messages.len());
    }
}
