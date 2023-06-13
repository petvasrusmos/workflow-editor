<script setup>
import { Handle, Position } from '@vue-flow/core'
// import { NodeToolbar } from '@vue-flow/node-toolbar'
import { defineProps, ref } from 'vue'
import SvgIcon from '@/assets/SvgIcon.vue';

defineProps(['data', 'label', 'id'])
// const emit = defineEmits(["deleteNode"])

let isShowInfo = ref(false)
let isShowHint = ref(false)

let commandInfo = [ { name: 'Объекты', value: 'Секция' },  { name: 'Компетенции', value: 'Бригадир запуска - выдача, слесарь' } ]
</script>

<template>
  <div @mouseover="isShowInfo = true" @mouseleave="isShowInfo = false" class="command__main" style=" max-width: 380px; width: 360px;">
    <div @mouseover="isShowInfo = true" @mouseleave="isShowInfo = false" v-if="isShowInfo" class="close-wrapper">
      <SvgIcon name="close"/>
    </div>
    <div class="command">
      <div class="command__label">
        {{ label ? label : 'Проверка комплектности после СО' }} {{ id }}
      </div>
      <div v-if="isShowInfo" class="command__info-wrapper">
        <div class="command__info" v-for="(info, index) in commandInfo" :key="index + info.name">
          <div class="info__name">{{ info.name }}</div>
          <div class="info__value">{{ info.value }}</div>
        </div>
      </div>
      <div class="command__footer">
        <div class="command__icons">
          <div @mouseover="isShowHint = true" @mouseleave="isShowHint = false">
            <SvgIcon name="touch"/>
          </div>
          <SvgIcon class="command__icon" name="submit"/>
        </div>
        <span class="command__time">00:10</span>
      </div>
      <div v-if="isShowHint" class="hint">
        <span> Подтверждение кнопкой</span>
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

.hint {
  background: #191919;
  width: 192px;
  position: absolute;
  bottom: -46%;
  padding: 12px;

  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 18px;
  display: flex;
  align-items: center;
  color: #FFFFFF;
  z-index: 10000;
}

.hint::after {
  position: absolute;
  top: -30%;
  left: 9%;
  transform: rotate(180deg) scale(2);
  content: "";
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #191919;
}
.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.info__name {
  display: flex;
  margin-right: 12px;
  justify-content: flex-end;
  align-items: flex-end;
  min-width: 60px;
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 8px;
  line-height: 11px;
}

.info__value {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
}
.toolBar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.close-wrapper {
  position: absolute;
  right: -12.5%;
  border: 2px solid #E10019;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 7px;
  cursor: pointer;
  max-width: 48px;
  max-height: 48px;
}
.command__main {
  transition: all 1s ease-out;
  background: #2828D2;
  color: white;
  display: flex;
  justify-content: flex-start;
  flex-flow: column;
  box-sizing: border-box;
}
.command__info-wrapper {
  display: flex;
  flex-flow: column;
  margin-left: 18px;  
}
.command__info {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 8px;
  line-height: 11px;
  display: flex;
}
.command__footer {
  display: flex;
  justify-content: space-between;
  font-family: 'Manrope';
  font-style: normal;
  height: 100%;
  font-weight: 200;
  font-size: 20px;
  line-height: 22px;
  padding: 0 9px 0 12px;
  box-sizing: border-box;

}

.command__time {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 300;
  font-size: 32px;
  line-height: 44px;
  text-align: right;
}
.command__label {
  display: flex;
  justify-content: flex-start;
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  padding: 12px;
  margin-bottom: 2px;
  
}

.command__icons {
  display: flex;
  flex-flow: row;
  box-sizing: border-box;
  align-items: center;
}
.command__icon:hover {
  fill: black;
}


</style>