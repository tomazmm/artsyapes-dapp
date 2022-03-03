<template>
  <div id="login-wrapper">
    <img alt="logo" id="logo" class="mb-5 mt-5 unselectable" src="@/assets/logo.png">
    <b-row class="mt-5 d-flex justify-content-center">
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Login extends Vue {}
</script>

<style lang="scss" scoped>
#login-wrapper{
  // cover-background
  height: 100vh;
}
</style>
