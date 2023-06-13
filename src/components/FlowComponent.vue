<script setup>
// import { Panel, PanelPosition, VueFlow, isNode, useVueFlow } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
// import  distributeRectangles from './distribution-functions.js'
import { distributeRectanglesTowardRight } from './distribution-functions.js' 
import { nextTick, watch } from 'vue'
// import { Background } from '@vue-flow/background'
// import { Controls } from '@vue-flow/controls'
// import { MiniMap } from '@vue-flow/minimap'
import { ref } from 'vue'
import { initialElements } from './initial-elements.js'
import ToolbarNode from './ToolbarNode.vue'
import ResizableNode from './ResizableNode.vue'
import SideBar from './SideBar'
import { defineProps } from 'vue';


const elements = ref(initialElements)
defineProps(['label'])
let id = 0
function getId() {
  return `dndnode_${id++}`
}
const { findNode, onConnect, addEdges, onNodeDrag, onNodeDragStop, getNodes, getEdges, addNodes, project, vueFlowRef } = useVueFlow({
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

const nestedList = ref([])
function onDragOver(event) {
  console.log('start', event)
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}
onConnect((params) => addEdges([params])),
onNodeDrag(({ intersections }) => {
  intersectingList = [...intersections]
  const intersectionsWithoutTimeline = intersections.filter(el => (el.type !== 'timeline') && (el.type !== 'child'))
  const intersectionIds = intersectionsWithoutTimeline.map((intersection) => intersection.id)
  // elements.value.findIndex(el => el.target === n.)
  getNodes.value.forEach((n) => {
    const isIntersecting = (intersectionIds.includes(n.id))
    n.class = (isIntersecting && n.type !== 'child') ? 'intersecting' : ''
  })
})

function onDrop(event) {
  const type = event.dataTransfer?.getData('application/vueflow')
  if (type) {
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
}

function findParent(node) {
  const edge = elements.value.find((element) => (element.target === node.id) )
  return findNode(edge.source)
}
const gap = 50

function insertNodeBetween (leftNode, newNode) {
  let rightNode = null
  elements.value.push({id: `e${leftNode.id}-${newNode.id}`, source: leftNode.id, target: newNode.id, type: 'smoothstep', zIndex: 1, })
  elements.value.forEach((el, index) => {
    if (leftNode.id === el.source) {
      rightNode = findNode(el.target)
      elements.value.push({id: `e${newNode.id}-${rightNode.id}`, source: newNode.id, target: rightNode.id, type: 'smoothstep', zIndex: 1, })
      elements.value.splice(index, 1)
    }
  })
  findStartNode(leftNode, 'insert')
}
function updateNodesRow(node) {
  let nodesRow = findNodesRow(node, [])
  let y = node.position.y
  const connectedRects = []
  nodesRow.forEach(el => {
    connectedRects.push({ height: el.dimensions.height, width: el.dimensions.width, x: el.position.x, y: el.position.x, id: el.id })
  })
  const distributedRects = distributeRectanglesTowardRight(connectedRects, gap)
  distributedRects.forEach(el => {
    let node = findNode(el.id)
    node.position.x = el.x
    node.position.y = y
  })
}
function findStartNode(node, comment) {
  let edge = elements.value.find(edge => (edge.target === node.id))
  if (edge) {
    let source = findNode(edge.source)
    findStartNode(source, comment)
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
// function SetChildrenPosition(parent) {
//   const connectedNodes = []
//   const connectedRects = []
  
//   elements.value.forEach((element) => {
//     if (element.source === parent.id) {
//       const connectedNode = findNode(element.target)
//       connectedRects.push({ height: connectedNode.dimensions.height, width: connectedNode.dimensions.width, x: connectedNode.position.x, y: connectedNode.position.x, id: connectedNode.id })
//       connectedNodes.push(connectedNode)
//     } 
//   })
//   if (connectedNodes.length === 1) {
//     connectedNodes[0].position.x = parent.position.x + parent.dimensions.width + gap
//     connectedNodes[0].position.y = parent.position.y
//   } else {
//     const distibutedRects = distributeRectangles(connectedRects, parent.position.x, 10)
//     distibutedRects.forEach(el => {
//       let node = findNode(el.id)
//       node.position.x = el.x
//       node.position.y = parent.position.y + 100
//     })
//   }
// }
onNodeDragStop((e) => {
  getNodes.value.forEach((n) => {
    // const connectedNodes = []
    if (n.class === 'intersecting') {
      // looking for another edge with this node for define is this would be a parallel or serial positioning
      let alreadyConnected = []
      getEdges.value.forEach(edge => { 
        if (edge.source === n.id) alreadyConnected.push(findNode(edge.target))
      })
      if(alreadyConnected.length) {
        insertNodeBetween(n, e.node)
      }
      elements.value.push({id: `e${n.id}-${e.node.id}`, source: n.id, target: e.node.id, type: 'smoothstep', zIndex: 1, })
      findStartNode(n, 'standard')
      // SetChildrenPosition(n)
      n.class = ''
    }
  })
})


onConnect((params) => addEdges([params]))

const dark = ref(false)

function deleteNode (id) {
  let node = findNode(id) 
  if (node.type === 'timeline' | 'child') return
  let edgeIndex = -1
  let newTarget = null
  let newSource = null
  elements.value.forEach((el, index) => { 
    if (id === el.target) {
      edgeIndex = index
      newSource = findNode(el.source)
    }
    if (id === el.source) newTarget = findNode(el.target) 
  })
  if (edgeIndex !== -1) {
    const parent = findParent(node)
    console.log(parent)
    // SetChildrenPosition(parent)
    elements.value.splice(edgeIndex, 1)
  } 
  const nodeIndex = elements.value.findIndex(el => id === el.id)
  elements.value.splice(nodeIndex, 1)  
  if(newSource && newTarget) {
    elements.value.push({id: `e${newSource.id}-${newTarget.id}`, source: newSource.id, target: newTarget.id, type: 'smoothstep', zIndex: 1, })
    findStartNode(newSource)
  }
  
}

</script>

<template>
  <div class="main-wrapper">
    <div class="main" @drop="onDrop">
      <VueFlow @dragover="onDragOver" v-model="elements" :class="{ dark }" class="basicflow" :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">
        <template #node-resizable="resizableNodeProps">
          <ResizableNode :label="resizableNodeProps.label" :list="nestedList" />
        </template>
        <template #node-toolbar="nodeProps">
          <ToolbarNode @deleteNode="deleteNode" :data="nodeProps" :id="nodeProps.id"/>
        </template>
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

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}
.vue-flow__node.intersecting{background-color:#ff0}

.basicflow.dark{background:#57534e;color:#fffffb}.basicflow.dark .vue-flow__node{background:#292524;color:#fffffb}.basicflow.dark .vue-flow__controls .vue-flow__controls-button{background:#292524;fill:#fffffb;border-color:#fffffb}.basicflow.dark .vue-flow__edge-textbg{fill:#292524}.basicflow.dark .vue-flow__edge-text{fill:#fffffb}.basicflow .controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.basicflow .controls button{padding:4px;border-radius:5px;font-weight:600;-webkit-box-shadow:0px 5px 10px 0px rgba(0,0,0,.3);box-shadow:0 5px 10px #0000004d;cursor:pointer;display:flex;justify-content:center;align-items:center}.basicflow .controls button:hover{transform:scale(102%);transition:.25s all ease}

.basicflow.dark{background:#57534e;color:#fffffb}.basicflow.dark .vue-flow__node{background:#292524;color:#fffffb}.basicflow.dark .vue-flow__controls .vue-flow__controls-button{background:#292524;fill:#fffffb;border-color:#fffffb}.basicflow.dark .vue-flow__edge-textbg{fill:#292524}.basicflow.dark .vue-flow__edge-text{fill:#fffffb}.basicflow .controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.basicflow .controls button{padding:4px;border-radius:5px;font-weight:600;-webkit-box-shadow:0px 5px 10px 0px rgba(0,0,0,.3);box-shadow:0 5px 10px #0000004d;cursor:pointer;display:flex;justify-content:center;align-items:center}.basicflow .controls button:hover{transform:scale(102%);transition:.25s all ease}
</style>