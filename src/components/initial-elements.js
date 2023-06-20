import { Position } from '@vue-flow/core'

const defaultNodeStyle = {
  border: 0,
  color: 'white',
}

const defaultData = {
  title: 'Проверка комплектности после СО',
	duration_minutes: null,
	linked_objects: 'Секция',
	linked_duties: 'Мастер приемки',
	confirmations: [],
  time: '',
}

export const linkedObjects = [
  'Локомотив',
  'Секция'
]

export const duties = [
  'Сварщик 1 разряда',
  'Мастер приемки'
]
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
  { id: '7', type: 'timeline', label: '',selectable: false, position: { x: 0, y: 0 }, width: 4000, height: 1000, zIndex: 0,  class: 'light', draggable: false, style: { background: '#C9C9C9' }, },
  // { id: '8', type: 'timeline', label: 'Procces 2', position: { x: 0, y: 500 }, width: 2000, height: 500, zIndex: 0,  class: 'light', draggable: false },
  // { id: '9', type: 'timeline', label: 'Procces 3', position: { x: 0, y: 1000 }, width: 2000, height: 500, zIndex: 0,  class: 'light', draggable: false },
  // { id: '6', type: 'output', label: 'Node 6', position: { x: 300, y: 400 }, extent: 'parent', parentNode: '7', class: 'light', zIndex: 1, width: 400, height: 35 },
  {
    id: '10',
    type: 'resizable',
    label: 'NodeResizer',
    fucusable: true,
    position: { x: 700, y: 1500 },
    style: { background: '#fff', border: '2px solid black' },
    zIndex: 3,
    parentNode: '7',
    extent: 'parent',
    width: 384,
  },
  // { id: '11', type: 'nested', label: 'Node parent', position: { x: 700, y: 230 }, parentNode: '7', width: 170, height: 300, class: 'light', zIndex: 1, extent: 'parent' },
  // { id: '12', type: 'child', label: 'Node child', position: { x: 680, y: 230 }, parentNode: '11', class: 'light', zIndex: 2, extent: 'parent' },
  {
    id: '1',
    type: 'toolbar',
    label: 'toolbar bottom',
    data: { toolbarPosition: Position.Bottom, ...defaultData },
    position: { x: 0, y: 0 },
    style: defaultNodeStyle,
    zIndex: 2,
    extent: 'parent',
    parentNode: '7',
  },
  {
    id: '2',
    type: 'toolbar',
    label: 'toolbar bottom',
    data: { toolbarPosition: Position.Bottom, ...defaultData },
    position: { x: 200, y: 300 },
    style: defaultNodeStyle,
    zIndex: 2,
    extent: 'parent',
    parentNode: '7',
  },
  {
    id: '3',
    type: 'toolbar',
    label: 'toolbar bottom',
    data: { toolbarPosition: Position.Bottom, ...defaultData },
    position: { x: 500, y: 500 },
    style: defaultNodeStyle,
    zIndex: 2,
    extent: 'parent',
    parentNode: '7',
  },
  {
    id: '4',
    type: 'toolbar',
    label: 'toolbar bottom',
    data: { toolbarPosition: Position.Bottom, ...defaultData },
    position: { x: 600, y: 0 },
    style: defaultNodeStyle,
    zIndex: 2,
    extent: 'parent',
    parentNode: '7',
  },
  
  {
    id: '13',
    type: 'toolbar',
    label: 'toolbar bottom',
    data: { toolbarPosition: Position.Bottom, ...defaultData },
    position: { x: 200, y: 0 },
    style: defaultNodeStyle,
    zIndex: 2,
    extent: 'parent',
    parentNode: '7',
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
