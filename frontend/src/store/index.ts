import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '@/store/types';
import { walletController } from './walletcontroller/index';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    version: '0.0.1',
  },
  modules: {
    walletController,
  },
};

export default new Vuex.Store<RootState>(store);
