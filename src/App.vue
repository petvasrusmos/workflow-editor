<template>
  <FlowComponent label="Timeline 1" msg="Welcome to Your Vue.js App"/>
  <!-- <HelloWorld label="Timeline 2" style="margin-top: 10px;" /> -->
</template>

<script>
import FlowComponent from './components/FlowComponent.vue'

export default {
  name: 'App',
  components: {
    FlowComponent,
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
