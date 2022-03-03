import { MutationTree } from 'vuex';
import { WalletControllerState} from '../types';

const mutations: MutationTree<WalletControllerState> = {
  initialize(state, walletController) {
    state.init = true;
    state.instance = walletController;
  }
};

export default mutations;
