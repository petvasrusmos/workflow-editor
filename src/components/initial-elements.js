// import { MarkerType } from '@vue-flow/core'

/**
 * You can pass elements together as a v-model value
 * or split them up into nodes and edges and pass them to the `nodes` and `edges` props of Vue Flow (or useVueFlow composable)
 */
export const initialElements = [
  { id: '1', type: 'input', label: 'Вложенная',style: { backgroundColor: 'rgba(16, 185, 129, 0.5)', width: '200px', height: '150px' }, position: { x: 100, y: 10 }, class: 'light' },
  { id: '2', type: 'output', label: 'Node 2', position: { x: 300, y: 200 }, class: 'light' },
  { id: '3', label: 'Node 3', position: { x: 25, y: 50 }, class: 'light' },
  { id: '4', label: 'Node 4', position: { x: 50, y: 250 }, class: 'light' },
  { id: '5', type: 'output', label: 'Node 5', position: { x: 300, y: 300 }, class: 'light' },
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
