// vue-global.d.ts
import Vue from 'vue';
import { Axios } from 'axios';

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-shadow
  interface Vue {
    $http: Axios
  }
}
