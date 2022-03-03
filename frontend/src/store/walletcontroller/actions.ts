import { ActionTree } from 'vuex';
import { RootState, WalletControllerState } from '../types';
import { getChainOptions, WalletController } from "@terra-money/wallet-controller";

const actions: ActionTree<WalletControllerState, RootState> = {
  initialize({ commit }) {
    return new Promise<void>((resolve) => {
      getChainOptions().then((chainOptions) => {
        const walletController = new WalletController({
          ...chainOptions,
        });
        commit("initialize", walletController)
      });
      resolve();
    });
  },
};

export default actions;
