<script setup>
// import { Panel, PanelPosition, VueFlow, isNode, useVueFlow } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'

import { nextTick, watch } from 'vue'
// import { Background } from '@vue-flow/background'
// import { Controls } from '@vue-flow/controls'
// import { MiniMap } from '@vue-flow/minimap'
import { ref } from 'vue'
import { initialElements } from './initial-elements.js'
import SideBar from './SideBar'

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */
// const { onPaneReady, onNodeDragStop, onConnect, addEdges, setTransform, toObject } = useVueFlow()

/**
 * Our elements
 */
const elements = ref(initialElements)
let id = 0
function getId() {
  return `dndnode_${id++}`
}
const { findNode, onConnect, addEdges, onNodeDrag, onNodeDragStop, getNodes, addNodes, project, vueFlowRef } = useVueFlow({
  nodes: [
    {
      id: '1',
      type: 'input',
      label: 'input node',
      position: { x: 250, y: 25 },
    },
  ],
})

function onDragOver(event) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}
onConnect((params) => addEdges([params])),
onNodeDrag(({ intersections }) => {
  const intersectionIds = intersections.map((intersection) => intersection.id)
  // elements.value.findIndex(el => el.target === n.)
  
  getNodes.value.forEach((n) => {
    const isIntersecting = intersectionIds.includes(n.id)
    n.class = isIntersecting ? 'intersecting' : ''
  })
})

function onDrop(event) {
  console.log('onDrop')
  const type = event.dataTransfer?.getData('application/vueflow')

  const { left, top } = vueFlowRef.value.getBoundingClientRect()

  const position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  })
  const newNode = {
    id: getId(),
    type,
    position,
    label: `${type} node`,
  }

  addNodes([newNode])

  // align node position after drop, so it's centered to the mouse
  nextTick(() => {
    const node = findNode(newNode.id)
    const stop = watch(
      () => node.dimensions,
      (dimensions) => {
        if (dimensions.width > 0 && dimensions.height > 0) {
          node.position = { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
          stop()
        }
      },
      { deep: true, flush: 'post' },
    )
  })
}



/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 *
 * onPaneReady is called when viewpane & nodes have visible dimensions
 */
// onPaneReady(({ fitView }) => {
//   fitView()
// })

onNodeDragStop((e) => {
  let edges = elements.value.filter(el => el.source === e.node.id)
  console.log(edges, 'edges')
  getNodes.value.forEach((n) => {
    if (n.class === 'intersecting') {
      let connectedNodes = []
      elements.value.forEach((element) => {
        if (element.source === n.id) {
          connectedNodes.push(
            elements.value.find(node => node.id === element.target)
          )
        } 
      })
      console.log(connectedNodes)
      if (!connectedNodes.length) {
        e.node.position.x = n.position.x
        e.node.position.y = n.position.y + 50
      } else {
        let maxX = 0
        connectedNodes.forEach(el => {
          el.position.x = el.position.x - 80
          if (maxX < el.position.x) maxX = el.position.x
        })
        console.log(maxX, 'maxX')
        e.node.position.x = maxX + 170
        e.node.position.y = n.position.y + 50
      }

      n.class = ''
  // { id: 'e1-2', source: '1', target: '2', animated: true },
      elements.value.push({id: `e${n.id}-${e.node.id}`, source: n.id, target: e.node.id, animated: true })
      // let currentNode = elements.value.find((node) => node.id === e.node.id)
      
      // currentNode['extent'] = [[e.node.position.y - 1000, e.node.position.x], [e.node.position.x + 1000, e.node.position.y]]
    }
  })
})

/**
 * onConnect is called when a new connection is created.
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether
 */
onConnect((params) => addEdges([params]))

const dark = ref(false)

/**
 * To update node properties you can simply use your elements v-model and mutate the elements directly
 * Changes should always be reflected on the graph reactively, without the need to overwrite the elements
 */
// function updatePos() {
//   return elements.value.forEach((el) => {
//     if (isNode(el)) {
//       el.position = {
//         x: Math.random(),
//         y: Math.random(),
//       }
//     }
//   })
// }

/**
 * toObject transforms your current graph data to an easily persist-able object
 */
// function logToObject() {
//   return console.log(toObject())
// }

/**
 * Resets the current viewpane transformation (zoom & pan)
 */
// function resetTransform() {
//   return setTransform({ x: 0, y: 0, zoom: 1 })
// }

// function toggleClass() {
//   return (dark.value = !dark.value)
// }
</script>

<template>
  <div class="main" @drop="onDrop">
    <VueFlow @dragover="onDragOver" v-model="elements" :class="{ dark }" class="basicflow" :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">
    </VueFlow>
    <SideBar/>
  </div>
</template>
<style>
.main {
  display: flex;
  width: 50%;
  height: 100vh;
  border: 1px solid black;
}
vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.19.4/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.19.4/dist/theme-default.css';
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
.vue-flow__node.intersecting{background-color:#ff0}

.basicflow.dark{background:#57534e;color:#fffffb}.basicflow.dark .vue-flow__node{background:#292524;color:#fffffb}.basicflow.dark .vue-flow__controls .vue-flow__controls-button{background:#292524;fill:#fffffb;border-color:#fffffb}.basicflow.dark .vue-flow__edge-textbg{fill:#292524}.basicflow.dark .vue-flow__edge-text{fill:#fffffb}.basicflow .controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.basicflow .controls button{padding:4px;border-radius:5px;font-weight:600;-webkit-box-shadow:0px 5px 10px 0px rgba(0,0,0,.3);box-shadow:0 5px 10px #0000004d;cursor:pointer;display:flex;justify-content:center;align-items:center}.basicflow .controls button:hover{transform:scale(102%);transition:.25s all ease}

.basicflow.dark{background:#57534e;color:#fffffb}.basicflow.dark .vue-flow__node{background:#292524;color:#fffffb}.basicflow.dark .vue-flow__controls .vue-flow__controls-button{background:#292524;fill:#fffffb;border-color:#fffffb}.basicflow.dark .vue-flow__edge-textbg{fill:#292524}.basicflow.dark .vue-flow__edge-text{fill:#fffffb}.basicflow .controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.basicflow .controls button{padding:4px;border-radius:5px;font-weight:600;-webkit-box-shadow:0px 5px 10px 0px rgba(0,0,0,.3);box-shadow:0 5px 10px #0000004d;cursor:pointer;display:flex;justify-content:center;align-items:center}.basicflow .controls button:hover{transform:scale(102%);transition:.25s all ease}
</style>