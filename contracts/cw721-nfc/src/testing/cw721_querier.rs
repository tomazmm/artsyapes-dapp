use cosmwasm_std::{to_binary, Addr, QuerierResult, SystemError};
use cw721::{Cw721QueryMsg, OwnerOfResponse};
use std::collections::HashMap;

#[derive(Default)]
pub struct Cw721Querier {
    token_owner: HashMap<String, Addr>,
}

impl Cw721Querier {
    pub fn handle_query(&self, query: Cw721QueryMsg) -> QuerierResult {
        match query {
            Cw721QueryMsg::OwnerOf {
                token_id,
                include_expired
            } => {
                let owner = match self.token_owner.get(&token_id) {
                    Some(balance) => balance,
                    None => {
                        return Err(SystemError::InvalidRequest {
                            error: format!("[mock]: cw721 token ownership not set for user {:?}", token_id),
                            request: Default::default(),
                        })
                            .into()
                    }
                };

                Ok(to_binary(&OwnerOfResponse {
                    owner: Addr::to_string(owner),
                    approvals: vec![]
                })
                    .into())
                    .into()
            }

            query => Err(SystemError::InvalidRequest {
                error: format!("[mock]: unsupported cw721 query {:?}", query),
                request: Default::default(),
            })
                .into(),
        }
    }

    pub fn set_token_owner(&mut self, user: &str, token_id: u128) {
        let user_addr = Addr::unchecked(user);
        self.token_owner.insert(token_id.to_string(), user_addr);
    }
}
