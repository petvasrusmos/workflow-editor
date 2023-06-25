<script setup>
// import { Panel, PanelPosition, VueFlow, isNode, useVueFlow } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { nextTick } from 'vue'
import { ref } from 'vue'
import { initialElements } from './initial-elements.js'
import { distributeRectanglesTowardRight } from './distribution-functions.js' 

import ToolbarNode from './ToolbarNode.vue'
import ResizableNode from './ResizableNode.vue'
import NodeBar from './NodeBar.vue'
import SideBar from './SideBar'
import TransitionEdge from './edges/TransitionEdge.vue'

import { defineProps, computed } from 'vue';

const selectedNode = computed(() => {
  return getNodes.value.find(node => node.selected)
})

const elements = ref(initialElements)

let triggerSwitchNode = ref(false)


defineProps(['label'])
let id = 0
function getId() {
  return `dndnode_${id++}`
}
const { onPaneReady, findNode, onConnect, addEdges, onNodeDrag, onNodeDragStart, onNodeDragStop, getNodes, getEdges, addNodes, project, vueFlowRef, applyNodeChanges, applyEdgeChanges} = useVueFlow({
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
  const intersectionsWithoutTimeline = intersections.filter(el => (el.type !== 'timeline'))
  const intersectionIds = intersectionsWithoutTimeline.map((intersection) => intersection.id)
  getNodes.value.forEach((n) => {
    const isIntersecting = (intersectionIds.includes(n.id))
    n.class = isIntersecting ? 'intersecting' : ''
  })
})
onNodeDragStart((node) => {
  node.node.selected = false
})

const createNode = (type, targetNodeId, position) => {
  const nodeId = getId()
  const newNode = {
    id: nodeId,
    type,
    position,
    label: `${type} node`,
    parentNode: '7',
    extent: 'parent',
  }
  addNodes([
    newNode
  ])
  nextTick(() => {
    let node = findNode(newNode.id)
    // const stop = watch(
    //   () => node.dimensions,
    //   (dimensions) => {
    //     if (dimensions.width > 0 && dimensions.height > 0) {
    //       node.position = { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
    //       stop()
    //     }
    //   },
    //   { deep: true, flush: 'post' },
    // )
    if (targetNodeId && targetNodeId !== '7') {
      let alreadyConnected = []
      getEdges.value.forEach(edge => { 
       if (edge.source === targetNodeId) alreadyConnected.push(findNode(edge.target))
      })
      if(alreadyConnected.length) {
        setTimeout(() => {
          insertNodeBetween(findNode(targetNodeId), node)
        }, 1);
      }
      addEdges([
        {
          id: `e${targetNodeId}-${nodeId}`,
          type: 'custom',
          source: targetNodeId,
          target: newNode.id,
          animated: true,
          zIndex: 22,
        },
      ])
      findStartNode(node)
    }
    node.selected = true
  })
}
function onDrop(event) {
  const type = event.dataTransfer?.getData('application/vueflow')
  console.log(type, 'type')
  if (type) {
    const targetNodeId = (event.target)?.closest('.vue-flow__node')?.getAttribute('data-id')
    const { left, top } = vueFlowRef.value.getBoundingClientRect()
    const position = project({
        x: event.clientX - left,
        y: event.clientY - top,
      })
    createNode(type || 'custom', targetNodeId, position)
    // let parentNode = null
    // if (intersectingList.value) { 
    //   parentNode = intersectingList.value.find(el => el.type === 'timeline')
    // }
    // const position = project({
    //   x: event.clientX - left,
    //   y: event.clientY - top,
    // })
    // const newNode = {
    //   id: getId(),
    //   type,
    //   position,
    //   label: `${type} node`,
    //   parent: parentNode ? parentNode.id : '',
    //   extent: 'parent',
    // }
  
    // addNodes([newNode])
  
    // // align node position after drop, so it's centered to the mouse
    // nextTick(() => {
    //   const node = findNode(newNode.id)
    //   const stop = watch(
    //     () => node.dimensions,
    //     (dimensions) => {
    //       if (dimensions.width > 0 && dimensions.height > 0) {
    //         node.position = { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
    //         stop()
    //       }
    //     },
    //     { deep: true, flush: 'post' },
    //   )
    // })
  }
}

const gap = 100

function insertNodeBetween (leftNode, newNode) {
  let rightNode = null
  getEdges.value.forEach((el) => {
    if (leftNode.id === el.source) {
      rightNode = findNode(el.target)
      applyEdgeChanges([{ type: 'remove', id: `e${leftNode.id}-${rightNode.id}` }])
      console.log(newNode)
      addEdges([{id: `e${newNode.id}-${rightNode.id}`, source: newNode.id, target: rightNode.id, type: 'smoothstep', zIndex: 5, }])
      addEdges([{id: `e${leftNode.id}-${newNode.id}`, source: leftNode.id, target: newNode.id, type: 'smoothstep', zIndex: 5 }])
      findStartNode(leftNode, 'insert')
    }
  })
  console.log(getEdges.value, 'edges')
}
function updateNodesRow(node) {
  count = 0
  let nodesRow = findNodesRow(node, [])
  // let y = node.position.y
  const connectedRects = []
  nodesRow.forEach(el => {
    connectedRects.push({ height: el.dimensions.height, width: el.dimensions.width, x: el.position.x, y: el.position.x, id: el.id })
  })
  const distributedRects = distributeRectanglesTowardRight(connectedRects, gap)
  distributedRects.forEach((el) => {
    let node = findNode(el.id)
    node.position.x = el.x
    let timiline = findNode(node.parentNode)
    node.position.y = timiline.position.y + timiline.dimensions.height / 2 - 200
  })
}
function findStartNode(node) {
  let edge = getEdges.value.find(edge => (edge.target === node.id))
  if (edge && (node.id !== edge.source)) {
    let source = findNode(edge.source)
    findStartNode(source)
  } else {
    updateNodesRow(node)
  }
}
let count = 0
function findNodesRow(node, nodesRow) {
  count++
  console.log(count)
  let oldArray = [...nodesRow]
  oldArray.push(node)
  let edge = getEdges.value.find(edge => (edge.source === node.id))
  let updatedNodesRow = []
  if (edge) {
    let target = findNode(edge.target)
    updatedNodesRow = [...findNodesRow(target, oldArray)]
  }
  return updatedNodesRow.length ? updatedNodesRow : oldArray
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
  getNodes.value.find((n) => {
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
      addEdges([{id: `e${n.id}-${e.node.id}`, source: n.id, target: e.node.id, type: 'custom', animated: true, style: { stroke: 'black' }, zIndex: 1 }])
      findStartNode(n)
      // SetChildrenPosition(n)
      n.class = ''
    }
  })
  e.node.selected = true

})


onConnect((params) => addEdges([params]))
onPaneReady((i) => {
  i.fitView({
    nodes: ['1'],
  })
})

const dark = ref(false)

const switchedNodeInfo = ref({
  direction: 'next',
  id: 0
})
function switchNode(info) {
  console.log('vue flow', triggerSwitchNode.value)
  triggerSwitchNode.value = !triggerSwitchNode.value
  console.log('vue flow', triggerSwitchNode.value)
  console.log('switchedInfo', info)
  switchedNodeInfo.value = {...info}
}

function saveNode (id) {
  let node = findNode(id) 
  node.selected = false
}
function deleteNode (id) {
  let node = findNode(id) 
  if (node.type === 'timeline') return
  let edgeId = null
  let newTarget = null
  let newSource = null
  getEdges.value.forEach((el) => { 
    if (id === el.target) {
      edgeId = el.id
      newSource = findNode(el.source)
    }
    if (id === el.source) newTarget = findNode(el.target) 
  })
  if (edgeId) {
    // SetChildrenPosition(parent)
    applyEdgeChanges([{ type: 'remove', id: edgeId }])
  } 
  applyNodeChanges([{ type: 'remove', id: id }])
  if(newSource && newTarget) {
    addEdges([{id: `e${newSource.id}-${newTarget.id}`, source: newSource.id, target: newTarget.id, type: 'smoothstep', zIndex: 1, }])
    findStartNode(newSource)
  }
  
}

</script>

<template>
  <div class="main-wrapper">
    <div class="main" @drop="onDrop">
      <SideBar :label="label"/>
      <VueFlow
        @dragover="onDragOver"
        v-model="elements"
        :class="{ dark }"
        class="basicflow"
        :default-viewport="{ zoom: 1.5 }"
        :min-zoom="0.2"
        :max-zoom="4"
      >
        <template #node-resizable="resizableNodeProps">
          <ResizableNode
            :id="resizableNodeProps.id"
            :label="resizableNodeProps.label"
            :list="nestedList"
            :isSelected="resizableNodeProps.selected"
            @deleteNode="deleteNode"
          />
        </template>
        <template #node-toolbar="nodeProps">
          <ToolbarNode
            @deleteNode="deleteNode"
            :data="nodeProps.data"
            :isSelected="nodeProps.selected"
            :id="nodeProps.id"
          />
        </template>
        <template #edge-custom="props">
          <TransitionEdge
            :selectedNode="selectedNode ? selectedNode.id : null"
            :switchNodeInfo="switchedNodeInfo ? switchedNodeInfo : null"
            :triggerSwitchNode="triggerSwitchNode" 
            v-bind="props"
            />
          </template>
        </VueFlow>
        <NodeBar
          @switchNode="switchNode"
          :node="selectedNode ? selectedNode.data : ''"
          :id="selectedNode ? selectedNode.id : null"
          class="node-bar"
          @deleteNode="deleteNode"
          @saveNode="saveNode"
        />
    </div>
  </div>
</template>
<style>
.main-wrapper {
  display: flex;
  justify-content: center;
  overflow: hidden;
}
.main {
  display: flex;
  width: 85%;
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

.node-bar {
  transition: 300ms ease;
  overflow: hidden;
}
.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}
.vue-flow__node.intersecting{background-color:#ff0}

.basicflow.dark{background:#57534e;color:#fffffb}.basicflow.dark .vue-flow__node{background:#292524;color:#fffffb}.basicflow.dark .vue-flow__controls .vue-flow__controls-button{background:#292524;fill:#fffffb;border-color:#fffffb}.basicflow.dark .vue-flow__edge-textbg{fill:#292524}.basicflow.dark .vue-flow__edge-text{fill:#fffffb}.basicflow .controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.basicflow .controls button{padding:4px;border-radius:5px;font-weight:600;-webkit-box-shadow:0px 5px 10px 0px rgba(0,0,0,.3);box-shadow:0 5px 10px #0000004d;cursor:pointer;display:flex;justify-content:center;align-items:center}.basicflow .controls button:hover{transform:scale(102%);transition:.25s all ease}

.basicflow.dark{background:#57534e;color:#fffffb}.basicflow.dark .vue-flow__node{background:#292524;color:#fffffb}.basicflow.dark .vue-flow__controls .vue-flow__controls-button{background:#292524;fill:#fffffb;border-color:#fffffb}.basicflow.dark .vue-flow__edge-textbg{fill:#292524}.basicflow.dark .vue-flow__edge-text{fill:#fffffb}.basicflow .controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.basicflow .controls button{padding:4px;border-radius:5px;font-weight:600;-webkit-box-shadow:0px 5px 10px 0px rgba(0,0,0,.3);box-shadow:0 5px 10px #0000004d;cursor:pointer;display:flex;justify-content:center;align-items:center}.basicflow .controls button:hover{transform:scale(102%);transition:.25s all ease}

.slide-enter-from {
  transform: translateX(300px);
}

.slide-enter-active {
  transition: all .3s ease-in;
}

.slide-leave-active {
  transition: all .3s ease-in;
}
.slide-leave-to {
  transform: translateX(300px);
}


.slide-two-enter {
  transform: translateX(300px);
}

.slide-two-enter-active {
  transition: all .3s ease-in;
}

.slide-two-leave-active {
  transition: all .3s ease-in;
}
.slide-two-leave-to {
  transform: translateX(-300px);
}
</style>