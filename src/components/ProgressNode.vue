<template>
    <div class="progress-holder">
      <div class="progress">{{ percentage }}</div>
      <div>{{ ("message") }}</div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "ProgressNode",
    data() {
      return {
        percentage: 80,
      };
    },
    // mounted() {
    //   const node = (this as any).getNode();
    //   console.log(node);
    // },
  });
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .progress-holder {
    border-radius: 6px;
    border: 1px solid #8f8f8f;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .progress {
    font-size: 24px;
    font-weight: bold;
  }
  </style>
  