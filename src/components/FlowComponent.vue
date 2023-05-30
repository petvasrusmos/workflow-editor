<script setup>
// import { Panel, PanelPosition, VueFlow, isNode, useVueFlow } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
// import  distributeRectangles from './distribution-functions.js'
import { distributeRectanglesTowardRight, distributeRectangles } from './distribution-functions.js' 
import { nextTick, watch } from 'vue'
// import { Background } from '@vue-flow/background'
// import { Controls } from '@vue-flow/controls'
// import { MiniMap } from '@vue-flow/minimap'
import { ref } from 'vue'
import { initialElements } from './initial-elements.js'
import ResizableNode from './ResizableNode'
// import ToolbarNode from './ToolbarNode.vue'
import SideBar from './SideBar'
import { defineProps } from 'vue';


const elements = ref(initialElements)
defineProps(['label'])
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

let intersectingList = ref([])
function onDragOver(event) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}
onConnect((params) => addEdges([params])),
onNodeDrag(({ intersections }) => {
  intersectingList = [...intersections]
  const intersectionIds = intersections.map((intersection) => intersection.id)
  // elements.value.findIndex(el => el.target === n.)
  getNodes.value.forEach((n) => {
    const isIntersecting = (intersectionIds.includes(n.id))
    n.class = (isIntersecting && n.type !== 'timeline') ? 'intersecting' : ''
  })
})

function onDrop(event) {
  const type = event.dataTransfer?.getData('application/vueflow')
  let parentNode = null
  const { left, top } = vueFlowRef.value.getBoundingClientRect()
  if (intersectingList.value) { 
    parentNode = intersectingList.value.find(el => el.type === 'timeline')
  }
  const position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  })
  const newNode = {
    id: getId(),
    type,
    position,
    label: `${type} node`,
    parentNode: parentNode ? parentNode.id : '',
    extent: 'parent',
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

function findParent(node) {
  const edge = elements.value.find((element) => (element.target === node.id) )
  return findNode(edge.source)
}
const gap = 10

function updateNodesRow(node) {
  let nodesRow = findNodesRow(node, [])
  const connectedRects = []
  nodesRow.forEach(el => {
    connectedRects.push({ height: el.dimensions.height, width: el.dimensions.width, x: el.position.x, y: el.position.x, id: el.id })
  })
  console.log(connectedRects, 'rects')

  const distributedRects = distributeRectanglesTowardRight(connectedRects)
  console.log(distributedRects, 'distr rects')
  distributedRects.forEach(el => {
    let node = findNode(el.id)
    node.position.x = el.x
    node.position.y = el.y
  })
}
function findStartNode(node) {
  let edge = elements.value.find(edge => (edge.target === node.id))
  if (edge) {
    let source = findNode(edge.source)
    findStartNode(source)
  } else {
    updateNodesRow(node)
  }
}
function findNodesRow(node, nodesRow) {
  let edge = elements.value.find(edge => (edge.source === node.id))
  nodesRow.push(node)
  if (edge) {
    let target = findNode(edge.target)
    nodesRow = findNodesRow(target, nodesRow)
  }
  return nodesRow
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
  if (!connectedNodes.length) {
    console.log(connectedRects, 'rects')
  } else if (connectedNodes.length === 1) {
    connectedNodes[0].position.x = parent.position.x + parent.dimensions.width + gap
    connectedNodes[0].position.y = parent.position.y
  } else {
    const distibutedRects = distributeRectangles(connectedRects, parent.position.x, 10)
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
      elements.value.push({id: `e${n.id}-${e.node.id}`, source: n.id, target: e.node.id, type: 'smoothstep', zIndex: 1, })
      // SetChildrenPosition(n)
      n.class = ''
      findStartNode(n)
    }
  })
})


onConnect((params) => addEdges([params]))

const dark = ref(false)

function deleteNode (e) {
  const edgeIndex = elements.value.findIndex(el => e.node.id === el.target)
  if (edgeIndex !== -1) {
    const parent = findParent(e.node)
    console.log(parent)
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
      <button @click="updateNodesRow(findNode('4'), [])"> найти связи </button>
      <VueFlow @dragover="onDragOver" @nodeDoubleClick="deleteNode" v-model="elements" :class="{ dark }" class="basicflow" :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">
        <template #node-resizable="resizableNodeProps">
          <ResizableNode :label="resizableNodeProps.label" />
        </template>
        <!-- <template #node-toolbar="nodeProps">
          <ToolbarNode @deleteNode="deleteNode" :data="nodeProps.data" :id="nodeProps.id" :label="nodeProps.label"/>
        </template> -->
      </VueFlow>
      <SideBar :label="label"/>
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