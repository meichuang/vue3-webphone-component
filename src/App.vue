<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <WebPhone msg="Welcome to Your Vue.js App"/>
</template>

<script>
import WebPhone from './components/WebPhone.vue'

export default {
  name: 'App',
  components: {
    WebPhone
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
