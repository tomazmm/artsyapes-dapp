import { GetterTree } from 'vuex';
import { RootState, AuthState } from '../types';

const getters: GetterTree<AuthState, RootState> = {
  isLoggedIn: (state) => !!state.token,
  authStatus: (state) => state.status,
};
export default getters;
