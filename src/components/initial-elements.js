import { Position } from '@vue-flow/core'

const defaultNodeStyle = {
  border: '1px solid #10b981',
  background: '#2828D2',
  color: 'white',
}
/**
 * You can pass elements together as a v-model value
 * or split them up into nodes and edges and pass them to the `nodes` and `edges` props of Vue Flow (or useVueFlow composable)
 */
export const initialElements = [
  // { id: '1', type: 'input', label: 'Вложенная',style: { backgroundColor: 'rgba(16, 185, 129, 0.5)', width: '200px', height: '150px' }, position: { x: 100, y: 10 }, class: 'light' },
  // { id: '2', type: 'output', targetHandle: Position.Right, sourseHandle: Position.Left,  label: 'Node 2', position: { x: 300, y: 200 }, extent: 'parent', parentNode: '7', class: 'light', zIndex: 1, },
  // { id: '3', label: 'Node 3', position: { x: 25, y: 50 }, parentNode: '7', class: 'light', zIndex: 1, extent: 'parent'},
  // { id: '4', label: 'Node 4', position: { x: 50, y: 250 }, parentNode: '7', class: 'light', zIndex: 1, extent: 'parent' },
  // { id: '5', type: 'output', label: 'Node 5', position: { x: 300, y: 300 }, parentNode: '7', zIndex: 1, class: 'light', extent: 'parent' },
  // { id: '7', type: 'timeline', label: 'Procces 1', position: { x: 0, y: 0 }, width: 2000, height: 500, zIndex: 0,  class: 'light', draggable: false },
  // { id: '8', type: 'timeline', label: 'Procces 2', position: { x: 0, y: 500 }, width: 2000, height: 500, zIndex: 0,  class: 'light', draggable: false },
  // { id: '9', type: 'timeline', label: 'Procces 3', position: { x: 0, y: 1000 }, width: 2000, height: 500, zIndex: 0,  class: 'light', draggable: false },
  // { id: '6', type: 'output', label: 'Node 6', position: { x: 300, y: 400 }, extent: 'parent', parentNode: '7', class: 'light', zIndex: 1, width: 400, height: 35 },
  // {
  //   id: '10',
  //   type: 'resizable',
  //   label: 'NodeResizer',
  //   position: { x: 0, y: 0 },
  //   style: { background: '#fff', border: '2px solid black' },
  //   zIndex: 1,
  //   parentNode: '7',
  //   extent: 'parent'
  // },
  // { id: '11', type: 'nested', label: 'Node parent', position: { x: 700, y: 230 }, parentNode: '7', width: 170, height: 300, class: 'light', zIndex: 1, extent: 'parent' },
  // { id: '12', type: 'child', label: 'Node child', position: { x: 680, y: 230 }, parentNode: '11', class: 'light', zIndex: 2, extent: 'parent' },
  {
    id: '1',
    type: 'toolbar',
    label: 'toolbar bottom',
    data: { toolbarPosition: Position.Bottom },
    position: { x: 0, y: 0 },
    style: defaultNodeStyle,
    zIndex: 2,
  },
  {
    id: '2',
    type: 'toolbar',
    label: 'toolbar bottom',
    data: { toolbarPosition: Position.Bottom },
    position: { x: 200, y: 300 },
    style: defaultNodeStyle,
    zIndex: 2,
  },
  {
    id: '3',
    type: 'toolbar',
    label: 'toolbar bottom',
    data: { toolbarPosition: Position.Bottom },
    position: { x: 500, y: 500 },
    style: defaultNodeStyle,
    zIndex: 2,
  },
  {
    id: '4',
    type: 'toolbar',
    label: 'toolbar bottom',
    data: { toolbarPosition: Position.Bottom },
    position: { x: 600, y: 0 },
    style: defaultNodeStyle,
    zIndex: 2,
  },
  
  {
    id: '13',
    type: 'toolbar',
    label: 'toolbar bottom',
    data: { toolbarPosition: Position.Bottom },
    position: { x: 200, y: 0 },
    style: defaultNodeStyle,
    zIndex: 2,
  },

  // { id: 'e1-2', source: '1', target: '2', animated: true },
  // { id: 'e1-3', label: 'edge with arrowhead', source: '1', target: '4', markerEnd: MarkerType.ArrowClosed },
  // {
  //   id: 'e4-5',
  //   type: 'step',
  //   label: 'step-edge',
  //   source: '4',
  //   target: '5',
  //   style: { stroke: 'orange' },
  //   labelBgStyle: { fill: 'orange' },
  // },
]
