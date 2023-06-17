<template>
  <FlowComponent label="Timeline 1" msg="Welcome to Your Vue.js App"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import FlowComponent from './components/FlowComponent.vue'

@Options({
  components: {
    FlowComponent
  },
})
export default class App extends Vue {}
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
