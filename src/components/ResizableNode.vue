<script setup>
import { Handle, Position } from '@vue-flow/core'
import SvgIcon from '@/assets/SvgIcon.vue';

// import { NodeResizer } from '@vue-flow/node-resizer'
import { ref, defineProps, defineEmits } from 'vue'
import Draggable from 'vuedraggable'
import ToolbarNode from './ToolbarNode.vue'

defineProps(['label', 'list', 'isSelected', 'id'])
const emit = defineEmits(['deleteNode'])
let cards = ref([1, 2, 3, 4, 5])

function deleteNode(id) {
  let index = cards.value.findIndex(el => el === id)
  cards.value.splice(index, 1)
}
</script>

<template>
  <div :class="{ 'isSelected': isSelected }" class="task">
    <Transition name="close-fade">
      <div v-if="isSelected" @click="emit('deleteNode', id)" class="close-wrapper resizer-close">
        <SvgIcon name="close"/>
      </div>
    </Transition>
    <!-- <NodeResizer min-width="384" max-width="384" min-height="80" max-height="1500" /> -->
    <Handle type="target" :position="Position.Left" />
    <div class="task__label" style="padding: 12px"> Выдача локомотива </div>
    <draggable 
      v-model="cards" 
      group="cards" 
      item-key="id"
      class="task__list nodrag"
      drag-class="drag"
      ghost-class="ghost"
    >
      <template #item="{element} ">
        <div class="task__node">
          <ToolbarNode @deleteNode="deleteNode(element)" :isChild="true" :label="element"/>
        </div>
      </template>
    </draggable>
    <Handle type="source" :position="Position.Right" />
    <div style="padding: 10px"></div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>
<style>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.20.1/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.20.1/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';


.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.task__label {
  display: flex;
  justify-content: flex-start;
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 32px;
  color: white;
  margin-bottom: 120px;
}

.task {
  height: 100%;
  background: #39393A;
  z-index: 0;
}

.task__list {
  display: flex;
  flex-flow: column;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.task__node {
  margin-bottom: 12px;
}

.ghost {
  background: grey;
}

.ghost > div {
  visibility: hidden;
}
.resizer-close {
  position: absolute;
  right: -12.5%;
  top: -0.2%
}
</style>