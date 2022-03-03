import { GetterTree } from 'vuex';
import { RootState, WalletControllerState } from '../types';

const getters: GetterTree<WalletControllerState, RootState> = {
  init: (state) => state.init,
  instance: (state) => state.instance,
};
export default getters;
