<script setup>
import { defineProps } from 'vue';
import SvgIcon from '@/assets/SvgIcon.vue';
defineProps(['label'])
function onDragStart(event, nodeType) {
  console.log('start')
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<template>
  <aside class="aside-wrapper">
    <v-time-picker></v-time-picker>

    <div class="aside">
      <h3 class="description">{{ label }}</h3>
      <div class="nodes">
        <!-- <div class="vue-flow__node-input node" :draggable="true" @dragstart="onDragStart($event, 'input')">Input Node</div> -->
        <div :draggable="true" @dragstart="onDragStart($event, 'toolbar')" class="command__main node" style=" max-width: 350px; width: 330px;">
          <div class="command">
            <div class="command__label">
              <!-- {{ label ? label : 'Проверка комплектности после СО' }} {{ id }} -->
            </div>
            <div class="command__footer">
              <div class="command__icons">
                <div>
                  <SvgIcon name="touch"/>
                </div>
                <SvgIcon class="command__icon" name="submit"/>
              </div>
              <span class="command__time">--:--</span>
            </div>
          </div>
        </div>
        <div :draggable="true" @dragstart="onDragStart($event, 'toolbar')" class="command__main node" style=" max-width: 350px; width: 330px;">
          <div class="command">
            <div class="command__label">
              <!-- {{ label ? label : 'Проверка комплектности после СО' }} {{ id }} -->
            </div>
            <div class="command__footer">
              <div class="command__icons">
                <div>
                  <SvgIcon name="touch"/>
                </div>
                <SvgIcon class="command__icon" name="submit"/>
              </div>
              <span class="command__time">--:--</span>
            </div>
          </div>
        </div>
      </div>
      </div>
  </aside>
</template>
<style>
.aside-wrapper {
  border-right: 1px solid rgba(42, 40, 40, 0.419);
  width: 25%;
  max-height: 80vh;
  overflow-y: scroll;
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