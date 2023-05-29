<script setup>
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import { defineProps } from 'vue';

defineProps(['label'])
</script>

<template>
  <NodeResizer min-width="100" min-height="30" />

  <Handle type="target" :position="Position.Left" />
  <div style="padding: 10px">{{ label }}</div>
  <Handle type="source" :position="Position.Right" />
  <div style="padding: 10px"></div>

  <Handle type="source" :position="Position.Right" />

</template>
<style>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.20.1/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.20.1/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';

html,
body,
#app {
  margin: 0;
  height: 100%;
}

#app {
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}
</style>