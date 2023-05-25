<script setup>
// import { Panel, PanelPosition, VueFlow, isNode, useVueFlow } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import distributeSegments from './intersections'
import { nextTick, watch } from 'vue'
// import { Background } from '@vue-flow/background'
// import { Controls } from '@vue-flow/controls'
// import { MiniMap } from '@vue-flow/minimap'
import { ref } from 'vue'
import { initialElements } from './initial-elements.js'
// import ToolbarNode from './ToolbarNode.vue'
import SideBar from './SideBar'

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */
// const { onPaneReady, onNodeDragStop, onConnect, addEdges, setTransform, toObject } = useVueFlow()

/**
 * Our elements
 */
// const rectangels = computed(() => {
//   return getNodes.value.map(node => {
//     return { width: node.dimensions.width, height: node.dimensions.height, x: node.position.x, y: node.position.y, id: node.id }
//   })
// })
const elements = ref(initialElements)
// const defaultNodeStyle = {
//   border: '1px solid #10b981',
//   background: '#ef467e',
//   color: 'white',
//   borderRadius: '99px',
// }

// const elements = ref([
//   {
//     id: '1',
//     type: 'toolbar',
//     label: 'toolbar top',
//     data: { toolbarPosition: Position.Top },
//     position: { x: 200, y: 0 },
//     style: defaultNodeStyle,
//   },
//   {
//     id: '2',
//     type: 'toolbar',
//     label: 'toolbar right',
//     data: { toolbarPosition: Position.Right },
//     position: { x: -50, y: 100 },
//     style: defaultNodeStyle,
//   },
//   {
//     id: '3',
//     type: 'toolbar',
//     label: 'toolbar bottom',
//     data: { toolbarPosition: Position.Bottom },
//     position: { x: 0, y: 200 },
//     style: defaultNodeStyle,
//   },
//   {
//     id: '4',
//     type: 'toolbar',
//     label: 'toolbar left',
//     data: { toolbarPosition: Position.Left },
//     position: { x: 200, y: 300 },
//     style: defaultNodeStyle,
//   },
//   {
//     id: '5',
//     type: 'toolbar',
//     label: 'toolbar always open',
//     data: { toolbarPosition: Position.Top, toolbarVisible: true },
//     position: { x: 0, y: -100 },
//     style: defaultNodeStyle,
//   },
// ])
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

function findParent(node) {
  const edge = elements.value.find((element) => (element.target === node.id) )
  return findNode(edge.source)
}

function SetChildrenPosition(parent) {
  const connectedNodes = []
  const connectedRects = []
  
  elements.value.forEach((element) => {
    if (element.source === parent.id) {
      const connectedNode = findNode(element.target)
      connectedRects.push({ height: connectedNode.dimensions.height, width: connectedNode.dimensions.width, x: connectedNode.position.x, y: connectedNode.position.x, id: connectedNode.id })
      connectedNodes.push(connectedNode)
    } 
  })
  console.log(connectedRects, 'rects')
  if (!connectedNodes.length) {
   return
  } else if (connectedNodes.length === 1) {
    connectedNodes[0].position.x = parent.position.x
    connectedNodes[0].position.y = parent.position.y + 100
  } else {
    const distibutedRects = distributeSegments(connectedRects, parent.position.x, 10)
    distibutedRects.forEach(el => {
      let node = findNode(el.id)
      node.position.x = el.x
      node.position.y = parent.position.y + 100
    })
  }
}
onNodeDragStop((e) => {
  getNodes.value.forEach((n) => {
    // const connectedNodes = []
    if (n.class === 'intersecting') {
      elements.value.push({id: `e${n.id}-${e.node.id}`, source: n.id, target: e.node.id, type: 'smoothstep' })
      SetChildrenPosition(n)
      n.class = ''
    }
  })
})


onConnect((params) => addEdges([params]))

const dark = ref(false)

function deleteNode (e) {
  const edgeIndex = elements.value.findIndex(el => e.node.id === el.target)
  if (edgeIndex !== -1) {
    const parent = findParent(e.node)
    elements.value.splice(edgeIndex, 1)
    SetChildrenPosition(parent)
  } 
  const nodeIndex = elements.value.findIndex(el => e.node.id === el.id)
  elements.value.splice(nodeIndex, 1)  
  
}

</script>

<template>
  <div class="main-wrapper">
    <div class="main" @drop="onDrop">
      <VueFlow @dragover="onDragOver" @nodeDoubleClick="deleteNode" v-model="elements" :class="{ dark }" class="basicflow" :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">
        <!-- <template #node-toolbar="nodeProps">
          <ToolbarNode @deleteNode="deleteNode" :data="nodeProps.data" :id="nodeProps.id" :label="nodeProps.label"/>
        </template> -->
      </VueFlow>
      <SideBar/>
    </div>
  </div>
</template>
<style>
.main-wrapper {
  display: flex;
  justify-content: center;
}
.main {
  display: flex;
  width: 75%;
  min-height: 80vh;
  border: 1px solid rgba(42, 40, 40, 0.419);
  border-radius: 12px;
  
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