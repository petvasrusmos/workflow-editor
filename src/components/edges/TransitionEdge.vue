<script setup>
import { TransitionPresets, useDebounceFn, useTransition, watchDebounced } from '@vueuse/core'
import { getBezierPath, useVueFlow } from '@vue-flow/core'
import { computed, ref, defineProps, watch } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String,
    required: true,
  },
  targetPosition: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: false,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
  },
  selectedNode: {
    type: Object,
  },
  switchNodeInfo: {
    type: Object,
  },
  triggerSwitchNode: {
    type: Boolean,
  }
})

const curve = ref()

const dot = ref()

const transform = ref({ x: 0, y: 0 })

const showDot = ref(false)

const { onNodeDoubleClick, fitBounds, fitView, findNode } = useVueFlow()


watch(() => props.triggerSwitchNode, () => {
  let directionSource = null
  if (props.switchNodeInfo.direction === 'next') directionSource = props.source
  else directionSource = props.target
  if (props.selectedNode && (directionSource === props.selectedNode)) {

    let node = null
    let target = findNode(props.target)
    if (props.switchNodeInfo.direction === 'next') {
      node = findNode(props.selectedNode)
    } else {
      node = findNode(props.source)
    }
    // let edgeN = null
    // getEdges.value.find(edge => {
    //   if (edge.source === props.selectedNode) {
    //     target = findNode(edge.target)
    //     edgeN = edge
    //   }
    // })
    const isSource = props.switchNodeInfo.direction === 'next'
    console.log(props.source, props.target)
    const isTarget = props.switchNodeInfo.direction === 'previous'
    // if (isSource) {
    // node.selected = false
    if (!showDot.value && (isSource || isTarget)) {
      showDot.value = true
      let totalLength = curve.value.getTotalLength()
      const initialPos = ref(isSource ? 0 : totalLength)
      let stopHandle

      const output = useTransition(initialPos, {
        duration: (Math.floor(totalLength / 2 / 100) * 1000) / 2.3,
        transition: TransitionPresets.easeOutCubic,
        onFinished: () => {
          stopHandle?.()
          showDot.value = false
          fitView({
            nodes: [isSource ? props.target : props.source],
            duration: 300,
            maxZoom: 2.2,
            offset: { x: -220, y: 0}
          })
          if (isSource) {
            target.selected = true
          } else node.selected = true
        },
      })

      transform.value = curve.value.getPointAtLength(output.value)

      debouncedFitBounds(
        {
          width: 200,
          height: 200,
          x: transform.value.x - 100,
          y: transform.value.y - 100,
        },
        { duration: 200 },
      )

      setTimeout(() => {
        initialPos.value = isSource ? totalLength : 0

        stopHandle = watchDebounced(
          output,
          (next) => {
            if (!showDot.value) {
              return
            }

            const nextLength = curve.value.getTotalLength()

            if (totalLength !== nextLength) {
              totalLength = nextLength
              initialPos.value = isSource ? totalLength : 0
            }

            transform.value = curve.value.getPointAtLength(next)

            debouncedFitBounds({
              width: 100,
              height: 200,
              x: transform.value.x - 100,
              y: transform.value.y - 100,
            })
          },
          { debounce: 1 },
        )
        
      }, 200)
      if (isSource) {
      node.selected = false
      } else target.selected = false
    }
  }
})
// watch(props.triggerSwitchNode, (value) => {
//   if (value) {
//     console.log(value, 'value')
//   }
// })
// let edge = computed(() => {
//   let selectedEdge = null
//   getEdges.value.find(e => {
//     if (props.selectedNode === e.source) selectedEdge = e
//   })
//   console.log(selectedEdge, 'eeeeedge')
//   return selectedEdge
// })
const path = computed(() => 
    getBezierPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      sourcePosition: props.sourcePosition,
      targetX: props.targetX,
      targetY: props.targetY,
      targetPosition: props.targetPosition,
  }),
)
const debouncedFitBounds = useDebounceFn(fitBounds, 1, { maxWait: 1 })

onNodeDoubleClick(({ node }) => {
  // const isSource = props.source === node.id
  // const isTarget = props.target === node.id

  // if (!showDot.value && (isSource || isTarget)) {
  //   showDot.value = true
  //   let totalLength = curve.value.getTotalLength()
  //   const initialPos = ref(isSource ? 0 : totalLength)
  //   let stopHandle

  //   const output = useTransition(initialPos, {
  //     duration: Math.floor(totalLength / 2 / 100) * 1000,
  //     transition: TransitionPresets.easeOutCubic,
  //     onFinished: () => {
  //       stopHandle?.()
  //       showDot.value = false
  //       fitView({
  //         nodes: [isSource ? props.target : props.source],
  //         duration: 300,
  //         maxZoom: 2.2,
  //         offset: { x: -220, y: 0}
  //       })
  //     },
  //   })

  //   transform.value = curve.value.getPointAtLength(output.value)

  //   debouncedFitBounds(
  //     {
  //       width: 200,
  //       height: 200,
  //       x: transform.value.x - 100,
  //       y: transform.value.y - 100,
  //     },
  //     { duration: 200 },
  //   )

  //   setTimeout(() => {
  //     initialPos.value = isSource ? totalLength : 0

  //     stopHandle = watchDebounced(
  //       output,
  //       (next) => {
  //         if (!showDot.value) {
  //           return
  //         }

  //         const nextLength = curve.value.getTotalLength()

  //         if (totalLength !== nextLength) {
  //           totalLength = nextLength
  //           initialPos.value = isSource ? totalLength : 0
  //         }

  //         transform.value = curve.value.getPointAtLength(next)

  //         debouncedFitBounds({
  //           width: 100,
  //           height: 200,
  //           x: transform.value.x - 100,
  //           y: transform.value.y - 100,
  //         })
  //       },
  //       { debounce: 1 },
  //     )
  //   }, 200)
  //   node.selected = false
  // }
})
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <path :id="id" ref="curve" :style="style" class="vue-flow__edge-path" :d="path[0]" :marker-end="markerEnd" />

  <Transition name="fade">
    <circle
      v-if="showDot"
      ref="dot"
      r="5"
      cy="0"
      cx="0"
      :transform="`translate(${transform.x}, ${transform.y})`"
      style="fill: #ADFF2F"
    />
  </Transition>
</template>
<style>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.20.2/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.20.2/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';


.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.fade-enter-active,.fade-leave-active{transition:opacity .3s ease}.fade-enter-from,.fade-leave-to{opacity:0}

</style>