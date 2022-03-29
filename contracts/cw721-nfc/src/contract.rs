#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Addr, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, QueryRequest, WasmQuery, QuerierWrapper, Uint128};
use cosmwasm_std::OverflowOperation::Add;
use cw2::set_contract_version;
use cw721_base::msg::QueryMsg::{OwnerOf};
use cw721::{OwnerOfResponse};

use crate::error::ContractError;
use crate::msg::{Cw721AddressResponse, ExecuteMsg, InstantiateMsg, OrderResponse, QueryMsg};
use crate::state::{ContractInfo, CONTRACT_INFO, OrderInfo, ORDERS};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:cw721-nfc";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

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
pub fn create_order(deps: DepsMut, info: MessageInfo, token_id: String, tier: String) -> Result<Response, ContractError> {
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
        token_id: token_id.clone(),
        owner: info.sender,
        tier
    };

    ORDERS.save(deps.storage, token_id, &order);

    Ok(Response::default())
}


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetCw721Address {} => to_binary(&query_cw721_address(deps)?),
        QueryMsg::GetCw721TokenOwner {token_id} => to_binary(&query_cw721_token_owner(deps, token_id)?),
        QueryMsg::GetOrder {token_id} => to_binary(&query_order(deps, token_id)?),
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

fn query_order(deps: Deps, token_id: String) -> StdResult<OrderResponse> {
    let order = ORDERS.load(deps.storage, token_id)?;
    Ok(OrderResponse{order})
}

#[cfg(test)]
mod tests {

    use super::*;
    use cosmwasm_std::testing::{mock_env, mock_info};
    use super::super::testing::mock_dependencies;
    use cosmwasm_std::{Addr, coins, from_binary, StdError};
    use crate::msg::ExecuteMsg::CreateOrder;

    // use cw721::{Cw721Contract, Cw721ExecuteMsg};
    //
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
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::GetOrder {token_id: "1".to_string()}).unwrap();
        let order: OrderResponse = from_binary(&res).unwrap();
        assert_eq!(OrderInfo{
            token_id: "1".to_string(),
            owner: Addr::unchecked("alice"),
            tier: "3".to_string()
        }, order.order);
    }
}
