<template>
  <v-app>
    <v-main>
      <FlowComponent/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FlowComponent from './components/FlowComponent.vue'

export default defineComponent({
  name: 'App',

  components: {
    FlowComponent
  },

  data () {
    return {
      //
    }
  },
})
</script>
