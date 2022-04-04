#[cfg(test)]
mod tests {

    use super::*;
    use cosmwasm_std::testing::{mock_env, mock_info};
    use super::super::testing::mock_dependencies;
    use cosmwasm_std::{Addr, coins, DepsMut, from_binary, StdError};
    use cw721::OwnerOfResponse;
    use crate::contract::{execute, instantiate, query};
    use crate::error::ContractError;
    use crate::msg::ExecuteMsg::CreateOrder;
    use crate::msg::{AllPhysicalsResponse, Cw721AddressResponse, InstantiateMsg, PhysicalResponse, PhysicalsResponse, QueryMsg};
    use crate::state::PhysicalInfo;

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