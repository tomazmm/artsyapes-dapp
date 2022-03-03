<template>
  <b-container fluid id="app" ref="app_container">
    <router-view></router-view>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import {Action, Getter} from 'vuex-class';

@Component({
})
export default class App extends Vue {
  @Action('initialize', { namespace: 'walletController' }) initWalletController : any

  @Getter('init', { namespace: 'walletController'}) isInit: any
  walletControllerInitialized = false;

  created() : void{
    this.initWalletController();
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');

html,body{
  margin: 0;
  #app {
    // default settings
    margin: 0;
    padding: 0;
    font-family: 'Roboto', Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    overflow: hidden;

    .unselectable {
      -webkit-user-drag: none;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }
  }
}
</style>
