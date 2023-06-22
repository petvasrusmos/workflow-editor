<template>
  
  <form class="node-bar__wrapper" :class="{'node-bar__hidden': !node}">
    {{ title }}
    
    <h2 class="mb-10">Настройка узла</h2>
    <v-text-field
    v-model="nodeCopy.title"
    :counter="10"
    label="Шаблон Команды"
    required
    hide-details
    outlined
    ></v-text-field>
    <v-btn label="следующий" @click="emit('nextNode', id)">следующий</v-btn>
    {{ id }}
    <v-btn label="предыдущий">предыдущий</v-btn>

    <v-text-field
      v-model="state.email"
      label="Примечания"
      required
      hide-details
      outlined
    ></v-text-field>
    <v-text-field
      v-model="state.email"
      label="Шаблон имени команды"
      required
      hide-details
      outlined
    ></v-text-field>
    <v-text-field
      v-model="state.email"
      label="Шаблон примечаний команды"
      required
      hide-details
      outlined
    ></v-text-field>
    <v-text-field
      v-model="state.email"
      label="Примечания"
      required
      hide-details
      outlined
    ></v-text-field>
    

    <v-select
      v-model="nodeCopy.linked_objects"
      :items="linkedObjects"
      label="Шаблоны объектов"
      required
      hide-details
      type="outlined"
    ></v-select>
    <v-select
      v-model="state.select"
      :items="items"
      label="Серии локомотивов"
      required
      hide-details
      outlined
    ></v-select>
    <v-select
      v-model="nodeCopy.linked_duties"
      :items="duties"
      label="Компетенции"
      required
      hide-details
      outlined
    ></v-select>
    <span class="mb-2 mt-2">Тип подтверждения</span>
    <v-checkbox
      v-model="state.checkbox"
      label="Видеофиксация"
      required
    ></v-checkbox>
    <v-time-picker v-model="nodeCopy.time"></v-time-picker>
    <v-btn
      class="mb-2 white--text"
      outlined
      color="#2828d2"
      @click="emit('saveNode', id)"

    >
      Сохранить
    </v-btn>
    <v-btn
      color="red"
      outlined
      @click="emit('deleteNode', id)"
    >
      Удалить
    </v-btn>
  </form>
</template>

<script setup>
import { reactive, defineProps, toRef, defineEmits } from 'vue'
const props = defineProps(['node', 'id'])
const emit = defineEmits(['deleteNode', 'saveNode'])
// let picker = reactive(null)
import { linkedObjects, duties } from './initial-elements'
// let title = reactive('')
// duration_minutes = reactive('')
// linked_objects = reactive('')
// linked_duties = reactive('') 
// confirmations = reactive('')
const nodeCopy = toRef(props, 'node')

const initialState = {
  name: '',
  email: '',
  select: null,
  checkbox: null,
}

const state = reactive({
  ...initialState,
})

const items = [
  { value: '12', title: 'разом' },
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
]

</script>
<style>

.node-bar__wrapper {
  display: flex;
  flex-flow: column;
  justify-content: center;
  position: absolute;
  right: 0;
  width: 25%;
  height: 100vh;
  padding: 15px;
  transform: translateX(0px);
  opacity: 1;
  visibility: visible;
  transition: .2s ease-in-out;
  background: white;
  -webkit-box-shadow: -30px 0px 41px -11px rgba(34, 60, 80, 0.15);
  -moz-box-shadow: -30px 0px 41px -11px rgba(34, 60, 80, 0.15);
  box-shadow: -30px 0px 41px -11px rgba(34, 60, 80, 0.15);
}
.node-bar__hidden {
  transform: translateX(300px);
  opacity: 0;
  visibility: hidden;
}

.white--text span {
  color: white;
}

.v-field__input {
  padding: 15px !important;
}
</style>