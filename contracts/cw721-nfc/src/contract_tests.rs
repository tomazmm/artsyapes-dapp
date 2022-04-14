#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_env, mock_info};
    use cosmwasm_std::CosmosMsg::Bank;
    use super::super::testing::mock_dependencies;
    use cosmwasm_std::{Addr, BankMsg, coin, Coin, coins, DepsMut, from_binary};
    use cw0::Expiration;
    use crate::contract::{execute, instantiate, query};
    use crate::error::ContractError;
    use crate::msg::ExecuteMsg::{Bid721Masterpiece, OrderCw721Print, UpdateTierInfo};
    use crate::msg::{Cw721AddressResponse, InstantiateMsg, Cw721PhysicalInfoResponse, Cw721PhysicalsResponse, QueryMsg, TierInfoResponse, BidsResponse, BiddingInfoResponse};
    use crate::state::{BidInfo, Cw721PhysicalInfo, TierInfo};

    const CW721_ADDRESS: &str = "cw721-contract";

    fn setup_contract(deps: DepsMut<'_>){
        let msg = InstantiateMsg {
            cw721: Addr::unchecked(CW721_ADDRESS),
            tier_info: [
                TierInfo {
                max_physical_limit: 1,
                cost: 2500 * 1_000_000
                },
                TierInfo {
                    max_physical_limit: 10,
                    cost: 120 * 1_000_000
                },
                TierInfo {
                    max_physical_limit: 3,
                    cost: 0
                }
            ],
            bids_limit: 1,
            bidding_duration: 19440,
            bidding_pause: 71280
        };
        let info = mock_info("creator", &[]);
        let res = instantiate(deps, mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());
    }

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies();

        let cw721_address = Addr::unchecked(CW721_ADDRESS);

        let instantiate_msg = InstantiateMsg {
            cw721:  cw721_address.clone(),
            tier_info: [
                TierInfo {
                    max_physical_limit: 1,
                    cost: 2500 * 1_000_000
                },
                TierInfo {
                    max_physical_limit: 10,
                    cost: 120 * 1_000_000
                },
                TierInfo {
                    max_physical_limit: 3,
                    cost: 0
                }
            ],
            bids_limit: 1,
            bidding_duration: 19440,
            bidding_pause: 71280
        };
        let info = mock_info("creator", &coins(1000, "earth"));

        // we can just call .unwrap() to assert this was a success
        let res = instantiate(deps.as_mut(), mock_env(), info, instantiate_msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());

        // success, check state
        // query the cw721 address
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCw721Address {}).unwrap();
        let value: Cw721AddressResponse = from_binary(&res).unwrap();
        assert_eq!(cw721_address, value.cw721);

        // query tiers info
        for i in 0..3 {
            let msg = QueryMsg::TierInfo {tier: i + 1};
            let res = query(deps.as_ref(),mock_env(), msg).unwrap();
            let value: TierInfoResponse = from_binary(&res).unwrap();
            assert_eq!(instantiate_msg.tier_info[i as usize].cost, value.cost);
            assert_eq!(instantiate_msg.tier_info[i as usize].max_physical_limit, value.max_physical_limit);
        }

        // query bidding info
        let msg = QueryMsg::BiddingInfo {};
        let res = query(deps.as_ref(),mock_env(), msg).unwrap();
        let value: BiddingInfoResponse = from_binary(&res).unwrap();
        assert_eq!(1, value.bids_limit);
        assert_eq!(19440, value.duration);
        assert_eq!(Expiration::AtHeight(value.duration + 12_345), value.expiration);
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
    }

    #[test]
    fn ordering_prints() {
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

        // alice can order tier 3 physical-print
        let info = mock_info("alice", &[coin(10 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 3.to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());

        // order info is correct
        let query_order_msg = QueryMsg::GetCw721PhysicalInfo {token_id: 1.to_string()};
        let res = query(deps.as_ref(),mock_env(), query_order_msg).unwrap();
        let pyhsical: Cw721PhysicalInfoResponse = from_binary(&res).unwrap();
        assert_eq!( Cw721PhysicalInfo {
            id: 1,
            token_id: "1".to_string(),
            owner: Addr::unchecked("alice"),
            tier: 3,
            status: "PENDING".to_string()
        }, pyhsical.physical);

        // alice cannot order physical-print of same tier twice
        let info = mock_info("alice", &[coin(10 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 3.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap_err();
        assert_eq!(err, ContractError::AlreadyOwned {});

        // alice can still order tier 2 physical-print
        let info = mock_info("alice", &[coin(130 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 2.to_string()};
        let res = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());

        // query all orders
        let query_order_msg = QueryMsg::AllCw721Physicals { start_after: None, limit: None };
        let res = query(deps.as_ref(),mock_env(), query_order_msg).unwrap();
        let physicals: Cw721PhysicalsResponse = from_binary(&res).unwrap();
        assert_eq!(2, physicals.physicals.len());
        assert_eq!(vec!["1", "2"], physicals.physicals);
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

        // tier = 1
        let msg = OrderCw721Print { token_id: 1.to_string(), tier: 1.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone())
            .unwrap_err();
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

        // Tier 2 and 3 have only one possible physical item
        let info = mock_info("creator", &[]);
        let msg = UpdateTierInfo { tier: 3, max_physical_limit: 1, cost: 0};
        let res =
            execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
        assert_eq!(0, res.messages.len());
        let info = mock_info("creator", &[]);
        let msg = UpdateTierInfo { tier: 2, max_physical_limit: 1, cost: 120 * 1_000_000};
        let res =
            execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
        assert_eq!(0, res.messages.len());

        // alice orders tier 2 and 3
        for x in 2..4 {
            let ust = match x {
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

        // bob cannot order tier 2 and 3 anymore
        for x in 2..4 {
            let ust = match x {
                2 => coin(130 * 1000000, "uusd"),
                _ => coin(10 * 1000000, "uusd")
            };
            let info = mock_info("bob", &[ust]);
            let msg = OrderCw721Print { token_id: 1.to_string(), tier: x.to_string()};
            let err = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap_err();
            match x {
                2 => assert_eq!(err, ContractError::MaxTier2Items {}),
                _ => assert_eq!(err, ContractError::MaxTier3Items {})
            }
        }

        // Tier 2 and 3 get additional physical item
        let info = mock_info("creator", &[]);
        let msg = UpdateTierInfo { tier: 3, max_physical_limit: 2, cost: 0};
        let res =
            execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
        assert_eq!(0, res.messages.len());
        let info = mock_info("creator", &[]);
        let msg = UpdateTierInfo { tier: 2, max_physical_limit: 2, cost: 120 * 1_000_000};
        let res =
            execute(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();
        assert_eq!(0, res.messages.len());

        // Now bob can order tier 2 and tier 3 physical prints
        for x in 2..4 {
            let ust = match x {
                2 => coin(130 * 1000000, "uusd"),
                _ => coin(10 * 1000000, "uusd")
            };
            let info = mock_info("bob", &[ust]);
            let msg = OrderCw721Print { token_id: 1.to_string(), tier: x.to_string()};
            let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
            assert_eq!(0, res.messages.len());
        }
    }

    #[test]
    fn query_physicals_by_token_id() {
        let mut deps = mock_dependencies();
        setup_contract(deps.as_mut());

        deps.querier.set_cw721_token("alice", 1);
        deps.querier.set_cw721_token("bob", 2);

        // alice orders tier 3 and tier 2 physical items
        let info = mock_info("alice", &[coin(10 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: "1".to_string(), tier: "3".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());
        let info = mock_info("alice", &[coin(130 * 1000000, "uusd")]);
        let msg = OrderCw721Print { token_id: "1".to_string(), tier: "2".to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone()).unwrap();
        assert_eq!(0, res.messages.len());

        // query alice's physical orders by token ID
        let query_physicals_msg = QueryMsg::Cw721Physicals {token_id: "1".to_string(), start_after: None, limit: None };
        let res = query(deps.as_ref(),mock_env(), query_physicals_msg).unwrap();
        let physicals: Cw721PhysicalsResponse = from_binary(&res).unwrap();
        assert_eq!(2, physicals.physicals.len());
        assert_eq!(vec!["1", "2"], physicals.physicals);
    }

    #[test]
    fn placing_masterpiece_bid() {
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
        let alice_bid_funds = coin(2510 * 1000000, "uusd");
        let info = mock_info("alice", &[alice_bid_funds.clone()]);
        let msg = Bid721Masterpiece { token_id: 1.to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone())
            .unwrap();
        assert_eq!(0, res.messages.len());

        // check alice's bid
        let res = query(deps.as_ref(),mock_env(), QueryMsg::Bids {}).unwrap();
        let bids: BidsResponse = from_binary(&res).unwrap();
        assert_eq!(1, bids.bids.len());
        assert_eq!(vec![BidInfo{
            bid_amount: alice_bid_funds.amount,
            owner: info.sender,
            token_id: "1".to_string()
        }], bids.bids);

        // bob cannot place bid with same UST amount
        let bob_bid_funds = coin(2510 * 1000000, "uusd");
        let info = mock_info("bob", &[bob_bid_funds.clone()]);
        let msg = Bid721Masterpiece { token_id: 2.to_string()};
        let err = execute(deps.as_mut(), mock_env(), info, msg.clone())
            .unwrap_err();
        assert_eq!(err, ContractError::LowBidding {});

        // bob can overbid alice
        let bob_bid_funds = coin(2600 * 1000000, "uusd");
        let info = mock_info("bob", &[bob_bid_funds.clone()]);
        let msg = Bid721Masterpiece { token_id: 2.to_string()};
        let res = execute(deps.as_mut(), mock_env(), info.clone(), msg.clone())
            .unwrap();
        // Check if message sending UST back to alice
        assert_eq!(1, res.messages.len());
        assert_eq!(Bank(BankMsg::Send {
            to_address: "alice".to_string(),
            amount: vec![
                Coin {
                    denom: "uusd".to_string(),
                    amount: alice_bid_funds.amount,
                },
            ],
        }), res.messages[0].msg);

        // check bob's bid
        let res = query(deps.as_ref(),mock_env(), QueryMsg::Bids {}).unwrap();
        let bids: BidsResponse = from_binary(&res).unwrap();
        assert_eq!(1, bids.bids.len());
        assert_eq!(vec![BidInfo{
            bid_amount: bob_bid_funds.amount,
            owner: info.sender,
            token_id: "2".to_string()
        }], bids.bids);
    }
}