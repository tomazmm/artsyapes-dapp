#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_env, mock_info};
    use super::super::testing::mock_dependencies;
    use cosmwasm_std::{Addr, coin, coins, DepsMut, from_binary};
    use crate::contract::{execute, instantiate, query};
    use crate::error::ContractError;
    use crate::msg::ExecuteMsg::{Bid721Masterpiece, OrderCw721Print, UpdateTierInfo};
    use crate::msg::{Cw721AddressResponse, InstantiateMsg, Cw721PhysicalInfoResponse, Cw721PhysicalsResponse, QueryMsg, TierInfoResponse};
    use crate::state::Cw721PhysicalInfo;

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
    fn updating_tier_info() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        // random cannot update tier info
        let info = mock_info("random", &[]);
        let msg = UpdateTierInfo { tier: 3, max_physical_limit: 100, cost: 10 * 1_000_000};
        let err =
            execute(deps.as_mut(), mock_env(), info, msg.clone())
                .unwrap_err();
        assert_eq!(err, ContractError::Unauthorized {});

        // owner can modify tier info
        let info = mock_info("creator", &[]);
        let msg = UpdateTierInfo { tier: 3, max_physical_limit: 100, cost: 10 * 1_000_000};
        let res =
            execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
        assert_eq!(0, res.messages.len());

        // query updated tier 3 info
        let msg = QueryMsg::TierInfo {tier: 3};
        let res = query(deps.as_ref(),mock_env(), msg).unwrap();
        let tier_info: TierInfoResponse = from_binary(&res).unwrap();
        assert_eq!(100, tier_info.max_physical_limit);
        assert_eq!(10 * 1_000_000, tier_info.cost);

        // passed tier number needs to be either 1,2 or 3
        let msg = UpdateTierInfo { tier: 0, max_physical_limit: 100, cost: 10 * 1_000_000};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap_err();
        assert_eq!(err, ContractError::InvalidTier {});
        // tier = 4
        let msg = UpdateTierInfo { tier: 4, max_physical_limit: 100, cost: 10 * 1_000_000};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap_err();
        assert_eq!(err, ContractError::InvalidTier {});

        // passed max physical limit per tier can't be 0
        let msg = UpdateTierInfo { tier: 3, max_physical_limit: 0, cost: 10 * 1_000_000};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap_err();
        assert_eq!(err, ContractError::TierMaxLimitIsZero {});
        let msg = UpdateTierInfo { tier: 3, max_physical_limit: 100, cost: 0};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap_err();
        assert_eq!(err, ContractError::TierCostsIsZero {});
    }

    #[test]
    fn ordering_prints() {
        // physical items data
        let physical = Cw721PhysicalInfo {
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
        let info = mock_info("chuck", &[coin(130 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: "1".to_string(), tier: "3".to_string()};
        let err =
            execute(deps.as_mut(), mock_env(), info, msg.clone())
                .unwrap_err();
        assert_eq!(err, ContractError::Unauthorized {});

        // alice can order tier 3
        let info = mock_info("alice", &[coin(10 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: "3".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());

        // order info is correct
        let query_order_msg = QueryMsg::GetCw721PhysicalInfo {token_id: "1".to_string()};
        let res = query(deps.as_ref(),mock_env(), query_order_msg).unwrap();
        let pyhsical: Cw721PhysicalInfoResponse = from_binary(&res).unwrap();
        assert_eq!(physical, pyhsical.physical);

        // alice cannot order physical item of same tier twice
        let info = mock_info("alice", &[coin(10 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: "3".to_string()};
        let err = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap_err();
        assert_eq!(err, ContractError::AlreadyOwned {});

        // alice can still order physical item of tier 1 and 2
        let info = mock_info("alice", &[coin(2510 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: "1".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());
        let info = mock_info("alice", &[coin(130 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: "2".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());

        // query all orders
        let query_order_msg = QueryMsg::AllCw721Physicals { start_after: None, limit: None };
        let res = query(deps.as_ref(),mock_env(), query_order_msg).unwrap();
        let physicals: Cw721PhysicalsResponse = from_binary(&res).unwrap();
        assert_eq!(3, physicals.physicals.len());
        assert_eq!(vec!["1", "2", "3"], physicals.physicals);
    }

    #[test]
    fn ordering_prints_with_wrong_tier() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        // cannot create order with wrong tier(=0)
        let info = mock_info("alice", &[coin(2510 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 0.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::InvalidTier {});

        // tier = 4
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 4.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::InvalidTier {});
    }

    #[test]
    fn ordering_prints_with_invalid_funds() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        deps.querier.set_cw721_token("alice", 1);

        // cannot create tier 3 order with non UST denom
        let info = mock_info("alice", &[coin(10 * 1_000_000, "snow")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 3.to_string() };
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::OnlyUSTAccepted {});

        // cannot create tier 3 order with sending multiple tokens
        let info = mock_info("alice", &[
            coin(10 * 1_000_000, "uusd"),
            coin(1 * 1_000_000, "uluna")
        ]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 3.to_string() };
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::OnlyUSTAccepted {});

        // cannot create tier 3 order with 1 UST
        let info = mock_info("alice", &[coin(1 * 1_000_000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 3.to_string() };
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::InvalidUSTAmount {
            required: 10 * 1_000_000,
            sent: 1 * 1_000_000
        });

        // cannot create tier 3 order with 200 UST
        let info = mock_info("alice", &[coin(200 * 1_000_000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 3.to_string() };
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::InvalidUSTAmount {
            required: 10 * 1_000_000,
            sent: 200 * 1_000_000
        });
    }

    #[test]
    fn ordering_max_possible_physical_items_per_token() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        deps.querier.set_cw721_token("alice", 1);

        // alice orders tier 1, 2 and 3
        for x in 1..4 {
            let ust = match x {
                1 => coin(2510 * 1000000, "uusd"),
                2 => coin(130 * 1000000, "uusd"),
                _ => coin(10 * 1000000, "uusd")
            };
            let info = mock_info("alice", &[ust]);
            // creates an order
            let msg = OrderCw721Print { token_id: 1.to_string(), tier: x.to_string()};
            let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
            assert_eq!(0, res.messages.len());
            // can't have a duplicate physical item
            let msg = OrderCw721Print { token_id: 1.to_string(), tier: x.to_string()};
            let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
            assert_eq!(err, ContractError::AlreadyOwned {});
        }

        // alice sells/transfers NFT to bob
        deps.querier.transfer_cw721_token("bob", 1);
        let info = mock_info("bob", &[coin(2510 * 1000000, "uusd")]);

        // bob cannot order tier 1
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 1.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::MaxTier1Items {});
        // bob orders tier 2 and 3
        for x in 2..4 {
            let ust = match x {
                2 => coin(130 * 1000000, "uusd"),
                _ => coin(10 * 1000000, "uusd")
            };
            let info = mock_info("bob", &[ust]);
            // creates an order
            let msg = OrderCw721Print { token_id: 1.to_string(), tier: x.to_string()};
            let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
            assert_eq!(0, res.messages.len());
            // can't have a duplicate physical item
            let msg = OrderCw721Print { token_id: 1.to_string(), tier: x.to_string()};
            let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
            assert_eq!(err, ContractError::AlreadyOwned {});
        }

        // bob sells/transfers NFT to chuck
        deps.querier.transfer_cw721_token("chuck", 1);
        // chuck orders tier 2 and 3
        for x in 2..4 {
            let ust = match x {
                2 => coin(130 * 1000000, "uusd"),
                _ => coin(10 * 1000000, "uusd")
            };
            let info = mock_info("chuck", &[ust]);
            let msg = OrderCw721Print { token_id: 1.to_string(), tier: x.to_string()};
            let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
            assert_eq!(0, res.messages.len());
            // can't have a duplicate physical item
            let msg = OrderCw721Print { token_id: 1.to_string(), tier: x.to_string()};
            let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
            assert_eq!(err, ContractError::AlreadyOwned {});
        }

        // chuck sells/transfers NFT to david
        deps.querier.transfer_cw721_token("david", 1);
        let info = mock_info("david", &[coin(10 * 1000000, "uusd")]);

        // david cannot order tier 3
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 3.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::MaxTier3Items {});

        // david orders tier 2
        let info = mock_info("david", &[coin(130 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 2.to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());

        // token transfers to other accounts and all of the physical items are ordered out
        let mut accounts= Vec::from(["Eve", "Faythe", "Grace", "Heidi", "Ivan", "Judy", "Mike"]);
        while let Some(account) = accounts.pop() {
            deps.querier.transfer_cw721_token(account, 1);

            let info = mock_info(account, &[coin(130 * 1000000, "uusd")]);
            let msg = OrderCw721Print { token_id: 1.to_string(), tier: 2.to_string()};
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
        let physical1 = Cw721PhysicalInfo {
            id: 1,
            token_id: 1.to_string(),
            owner: Addr::unchecked("alice"),
            tier: 3,
            status: "PENDING".to_string()
        };
        let physical2 = Cw721PhysicalInfo {
            id: 2,
            token_id: 1.to_string(),
            owner: Addr::unchecked("alice"),
            tier: 3,
            status: "PENDING".to_string()
        };
        let physical3 = Cw721PhysicalInfo {
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
        let info = mock_info("alice", &[coin(10 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: "1".to_string(), tier: "3".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());
        let info = mock_info("alice", &[coin(130 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: "1".to_string(), tier: "2".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());

        // bob orders 1 physical items
        let info = mock_info("bob", &[coin(10 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: "2".to_string(), tier: "3".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());

        // query alice's physical orders by token ID
        let query_physicals_msg = QueryMsg::Cw721Physicals {token_id: "1".to_string(), start_after: None, limit: None };
        let res = query(deps.as_ref(),mock_env(), query_physicals_msg).unwrap();
        let physicals: Cw721PhysicalsResponse = from_binary(&res).unwrap();
        assert_eq!(2, physicals.physicals.len());
        assert_eq!(vec![physical1.id.to_string(), physical2.id.to_string()], physicals.physicals);

        // query bob's physical orders by token ID
        let query_physicals_msg = QueryMsg::Cw721Physicals {token_id: "2".to_string(), start_after: None, limit: None };
        let res = query(deps.as_ref(),mock_env(), query_physicals_msg).unwrap();
        let physicals: Cw721PhysicalsResponse = from_binary(&res).unwrap();
        assert_eq!(1, physicals.physicals.len());
        assert_eq!(vec![physical3.id.to_string()], physicals.physicals);
    }

    #[test]
    fn placing_masterpiece_bid() {
        // // physical items data
        // let physical = Cw721PhysicalInfo {
        //     id: 1,
        //     token_id: "1".to_string(),
        //     owner: Addr::unchecked("alice"),
        //     tier: 3,
        //     status: "PENDING".to_string()
        // };

        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        deps.querier.set_cw721_token("alice", 1);
        deps.querier.set_cw721_token("bob", 2);

        // random cannot place bid
        let info = mock_info("chuck", &[coin(2510 * 1000000, "uusd")]);
        let msg = Bid721Masterpiece { token_id: "1".to_string()};
        let err =
            execute(deps.as_mut(), mock_env(), info, msg.clone())
                .unwrap_err();
        assert_eq!(err, ContractError::Unauthorized {});

        // alice can place bid
        let info = mock_info("alice", &[coin(2510 * 1000000, "uusd")]);
        let msg = Bid721Masterpiece { token_id: 1.to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());

        // bob cannot place bid with same UST amount
        let info = mock_info("bob", &[coin(2510 * 1000000, "uusd")]);
        let msg = Bid721Masterpiece { token_id: 2.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap_err();
        assert_eq!(err, ContractError::LowBidding {});

        // bob can overbid alice
        let info = mock_info("bob", &[coin(2600 * 1000000, "uusd")]);
        let msg = Bid721Masterpiece { token_id: 2.to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());
        //
        // // order info is correct
        // let query_order_msg = QueryMsg::GetCw721PhysicalInfo {token_id: "1".to_string()};
        // let res = query(deps.as_ref(),mock_env(), query_order_msg).unwrap();
        // let pyhsical: Cw721PhysicalInfoResponse = from_binary(&res).unwrap();
        // assert_eq!(physical, pyhsical.physical);
        //
        // // alice cannot order physical item of same tier twice
        // let info = mock_info("alice", &[coin(10 * 1000000, "uusd")]);
        // let msg = OrderCw721Print { token_id: 1.to_string(), tier: "3".to_string()};
        // let err = execute(deps.as_mut(), mock_env(), info, msg.clone())
        //     .unwrap_err();
        // assert_eq!(err, ContractError::AlreadyOwned {});
        //
        // // alice can still order physical item of tier 1 and 2
        // let info = mock_info("alice", &[coin(2510 * 1000000, "uusd")]);
        // let msg = OrderCw721Print { token_id: 1.to_string(), tier: "1".to_string()};
        // let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
        //     .unwrap();
        // assert_eq!(0, res.messages.len());
        // let info = mock_info("alice", &[coin(130 * 1000000, "uusd")]);
        // let msg = OrderCw721Print { token_id: 1.to_string(), tier: "2".to_string()};
        // let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
        //     .unwrap();
        // assert_eq!(0, res.messages.len());
        //
        // // query all orders
        // let query_order_msg = QueryMsg::AllCw721Physicals { start_after: None, limit: None };
        // let res = query(deps.as_ref(),mock_env(), query_order_msg).unwrap();
        // let physicals: Cw721PhysicalsResponse = from_binary(&res).unwrap();
        // assert_eq!(3, physicals.physicals.len());
        // assert_eq!(vec!["1", "2", "3"], physicals.physicals);
    }
}