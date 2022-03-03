import { Module } from 'vuex';
import { AuthState, RootState } from '@/store/types';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export const state: AuthState = {
  user: undefined,
  token: localStorage.getItem('token') || '',
  status: '',
};

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
