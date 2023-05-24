<script setup>
import { Handle, Position } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { defineProps, defineEmits } from 'vue'

defineProps(['data', 'label', 'id'])
const emit = defineEmits(["deleteNode"])


</script>

<template>
  <NodeToolbar
    style="display: flex; gap: 0.5rem; align-items: center"
    :is-visible="data.toolbarVisible"
    :position="data.toolbarPosition"
  >
    <button>Редактировать</button>
    <button @click="emit('deleteNode', id)">Удалить</button>
  </NodeToolbar>

  <div :style="{ padding: '10px 20px' }">
    {{ label }}
  </div>

  <Handle type="target" :position="Position.Left" />
  <Handle type="source" :position="Position.Right" />
</template>
<style>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.20.0/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.20.0/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}
</style>