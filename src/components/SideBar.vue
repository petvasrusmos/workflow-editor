<script setup>
import { defineProps } from 'vue';

defineProps(['label'])
function onDragStart(event, nodeType) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<template>
  <aside class="aside-wrapper">
    <div class="aside">
      <h3 class="description">{{ label }}</h3>

      <div class="nodes">
        <!-- <div class="vue-flow__node-input node" :draggable="true" @dragstart="onDragStart($event, 'input')">Input Node</div> -->

        <div class="vue-flow__node-default node" :draggable="true" @dragstart="onDragStart($event, 'default')">Default Node</div>

        <div class="vue-flow__node-output node" :draggable="true" @dragstart="onDragStart($event, 'output')">Output Node</div>
      </div>
    </div>
  </aside>
</template>
<style>
.aside-wrapper {
  border-left: 1px solid rgba(42, 40, 40, 0.419);
  width: 20%;
}

.aside {
}

.nodes {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.node {
  margin: 10px
}

.description {
  padding: 20px;
}
</style>