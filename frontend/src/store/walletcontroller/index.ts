import { Module } from 'vuex';
import {RootState, WalletControllerState} from '@/store/types';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export const state: WalletControllerState = {
  init: false,
  instance: undefined
};

export const walletController: Module<WalletControllerState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
