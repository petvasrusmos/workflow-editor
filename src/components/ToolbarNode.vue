<script setup>
import { Handle, Position } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { defineProps, defineEmits } from 'vue'
// import Touch from '@/assets/Vector.svg'

defineProps(['data', 'label', 'id'])
const emit = defineEmits(["deleteNode"])


</script>

<template>
  <NodeToolbar
    style="display: flex; gap: 0.5rem; align-items: center;"
    :is-visible="data.toolbarVisible"
    :position="data.toolbarPosition"
    >
    <button>Редактировать</button>
    <button @click="emit('deleteNode', id)">Удалить</button>
  </NodeToolbar>
  <div class="task__main" style=" max-width: 380px; max-height: 84px; width: 216px;">
    <div class="task">
      <div class="task__label">
        {{ label ? label : 'Проверка комплектности после СО' }}
      </div>
      <div class="task__info">
        <div class="task__icons">
          <!-- <Touch/> -->
        </div>
        <span class="task__time">00:00</span>
      </div>
    </div>
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

@import 'https://fonts.cdnfonts.com/css/manrope';


.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.task__main {
  display: flex;
  justify-content: flex-start;
  flex-flow: column;
  box-sizing: border-box;
}
.task__info {
  display: flex;
  justify-content: space-between;
  font-family: 'Manrope';
  font-style: normal;
  height: 100%;
  font-weight: 200;
  font-size: 20px;
  line-height: 22px;
  padding: 0 9px 11px 12px;
}

.task__time {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.task__label {
  display: flex;
  justify-content: flex-start;
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 500;
  font-size: 8px;
  line-height: 16px;
  padding: 12px;
  
}


</style>