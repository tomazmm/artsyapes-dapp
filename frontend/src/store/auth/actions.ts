import { ActionTree } from 'vuex';
import axios from 'axios';
import { AuthState, RootState } from '../types';

const actions: ActionTree<AuthState, RootState> = {
  login({ commit }, credentials : Record<string, string>) {
    return new Promise((resolve, reject) => {
      commit('auth_request');
      axios.post('/api/auth/login', credentials)
        .then((res: any) => {
          const token = res.data;
          localStorage.setItem('token', token);
          axios.defaults.headers.common.Authorization = token;
          commit('auth_success', token);
          resolve(res);
        }).catch((err) => {
          commit('auth_error');
          localStorage.removeItem('token');
          reject(err);
        });
    });
  },
  logout({ commit }) {
    return new Promise<void>((resolve) => {
      commit('logout');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common.Authorization;
      resolve();
    });
  },
};

export default actions;
