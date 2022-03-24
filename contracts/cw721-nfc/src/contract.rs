#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;
use cw721_base::msg::QueryMsg::{OwnerOf};
use cw721::{OwnerOfResponse};

use crate::error::ContractError;
use crate::msg::{Cw721AddressResponse, ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{State, STATE};

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
    let state = State {
        owner: info.sender.clone(),
        cw721: msg.cw721
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender)
        .add_attribute("cw721", state.cw721.as_str()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateOrder { token_id } => create_order(deps, info, token_id)
    }
}
pub fn create_order(deps: DepsMut, info: MessageInfo, token_id: String) -> Result<Response, ContractError> {
    let state = STATE.load(deps.storage)?;
    let owner: OwnerOfResponse = deps.querier.query_wasm_smart(
        state.cw721.to_string(),
        &OwnerOf {
            token_id,
            include_expired: None
        }).unwrap();

    if owner.owner != info.sender {
        return Err(ContractError::Unauthorized {})
    }

    Ok(Response::new().add_attribute("method", "try_increment"))
}


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetCw721Address {} => to_binary(&query_cw721_address(deps)?),
    }
}

fn query_cw721_address(deps: Deps) -> StdResult<Cw721AddressResponse> {
    let state = STATE.load(deps.storage)?;
    Ok(Cw721AddressResponse { cw721: state.cw721 })
}

// fn query_cw721_token_num(deps: Deps) -> StdResult<NumTokensResponse> {
//     let state = STATE.load(deps.storage)?;
//
//     // THIS WORKS
//     // let res: NumTokensResponse = deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
//     //     contract_addr: state.cw721.to_string(),
//     //     msg: to_binary(&NumTokens {})?,
//     // }))?;
//     // ----------------------
//
//     // let res: NumTokensResponse = deps.querier.query_wasm_smart(
//     //     state.cw721.to_string(),
//     //     &NumTokens {}).unwrap();
//     Ok(NumTokensResponse{count: 5})
// }

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{Addr, coins, from_binary};

    // use cw721::{Cw721Contract, Cw721ExecuteMsg};
    //
    const CW721_ADDRESS: &str = "cw721-contract";
    // const SYMBOL: &str = "ART";
    // const MINTER: &str = "minter";

    // fn setup_cw721_contract(deps: DepsMut<'_>){
    //     let contract = cw721_base::Cw721Contract::default();
    //     // let msg = cw721_base::msg::InstantiateMsg {
    //     //     name: CONTRACT_NAME.to_string(),
    //     //     symbol: SYMBOL.to_string(),
    //     //     minter: String::from(MINTER),
    //     // };
    //     // let info = mock_info("creator", &[]);
    //     // let res = contract.instantiate(deps, mock_env(), info, msg).unwrap();
    //     // assert_eq!(0, res.messages.len());
    // }

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
        let mut deps = mock_dependencies(&[]);

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
    fn create_order() {
        // let mut deps = mock_dependencies(&[]);
        // // setup_contract(deps.as_mut());
        //
        // let create_order_msg = CreateOrder {
        //     token_id: "1".to_string()
        // };
        // let cw712_contract = setup_cw721_contract(deps.as_mut());

        // let mut deps = mock_dependencies(&coins(2, "token"));

        // let msg = CreateOrder {};
        // let info = mock_info("creator", &coins(2, "token"));
        // let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        // beneficiary can release it
        // let info = mock_info("anyone", &coins(2, "token"));
        // let msg = ExecuteMsg::Increment {};
        // let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        //
        // // should increase counter by 1
        // let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
        // let value: CountResponse = from_binary(&res).unwrap();
        // assert_eq!(18, value.count);
    }

    // #[test]
    // fn reset() {
    //     let mut deps = mock_dependencies(&coins(2, "token"));
    //
    //     let msg = InstantiateMsg { count: 17 };
    //     let info = mock_info("creator", &coins(2, "token"));
    //     let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
    //
    //     // beneficiary can release it
    //     let unauth_info = mock_info("anyone", &coins(2, "token"));
    //     let msg = ExecuteMsg::Reset { count: 5 };
    //     let res = execute(deps.as_mut(), mock_env(), unauth_info, msg);
    //     match res {
    //         Err(ContractError::Unauthorized {}) => {}
    //         _ => panic!("Must return unauthorized error"),
    //     }
    //
    //     // only the original creator can reset the counter
    //     let auth_info = mock_info("creator", &coins(2, "token"));
    //     let msg = ExecuteMsg::Reset { count: 5 };
    //     let _res = execute(deps.as_mut(), mock_env(), auth_info, msg).unwrap();
    //
    //     // should now be 5
    //     let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
    //     let value: CountResponse = from_binary(&res).unwrap();
    //     assert_eq!(5, value.count);
    // }
}
