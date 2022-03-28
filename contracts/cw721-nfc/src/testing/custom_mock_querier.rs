use cosmwasm_std::testing::MockQuerier;
use cosmwasm_std::{
    from_binary, from_slice,  Coin, Empty, Querier, QuerierResult, QueryRequest, StdResult,
    SystemError, WasmQuery,
};
use cw721::Cw721QueryMsg;

use super::cw721_querier::Cw721Querier;

pub struct CustomMockQuerier {
    base: MockQuerier<Empty>,
    cw721_querier: Cw721Querier
}

impl Default for CustomMockQuerier {
    fn default() -> Self {
        CustomMockQuerier {
            base: MockQuerier::<Empty>::new(&[]),
            cw721_querier: Cw721Querier::default()
        }
    }
}

impl Querier for CustomMockQuerier {
    fn raw_query(&self, bin_request: &[u8]) -> QuerierResult {
        let request: QueryRequest<Empty> = match from_slice(bin_request) {
            Ok(v) => v,
            Err(e) => {
                return Err(SystemError::InvalidRequest {
                    error: format!("[mock]: failed to parse query request {}",e),
                    request: bin_request.into(),
                })
                .into()
            }
        };
        self.handle_query(&request)
    }
}

impl CustomMockQuerier {
    pub fn handle_query(&self, request: &QueryRequest<Empty>) -> QuerierResult {
        match request {
            QueryRequest::Wasm(WasmQuery::Smart {
                contract_addr,
                msg,
            }) => {
                // let contract_addr = Addr::unchecked(contract_addr);
                let parse_cw721_query: StdResult<Cw721QueryMsg> = from_binary(msg);
                if let Ok(cw721_query) = parse_cw721_query {
                    return self.cw721_querier.handle_query(cw721_query);
                }

                panic!("[mock]: unsupported wasm query {:?}", msg);
            }

            _ => self.base.handle_query(request),
        }
    }

    // pub fn set_base_balances(&mut self, address: &str, balances: &[Coin]) {
    //     self.base.update_balance(address, balances.to_vec());
    // }

    pub fn set_cw721_token(&mut self, user: &str, token_id: u128) {
        self.cw721_querier.set_token_owner(user, token_id);
    }
}
