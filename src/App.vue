<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <!-- <NiceDag/> -->
  <!-- <x-6-component/> -->
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// import X6Component from './components/x6Component.vue';
// import NiceDag from './components/NiceDag.vue';


export default {
  name: 'App',
  components: {
    HelloWorld,
    // NiceDag,
    // X6Component,
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
