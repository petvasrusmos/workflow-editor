<template>
  <div class="hello">
    <input />
    <div id="container"></div>
  </div>
</template>

<script>
import { Graph } from "@antv/x6";
import Data from "./data.json"
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    Graph.registerNode(
      'lane',
      {
        inherit: 'rect',
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'rect',
            selector: 'name-rect',
          },
          {
            tagName: 'text',
            selector: 'name-text',
          },
        ],
        attrs: {
          body: {
            fill: '#FFF',
            stroke: '#5F95FF',
            strokeWidth: 1,
          },
          'name-rect': {
            width: 200,
            height: 30,
            fill: '#5F95FF',
            stroke: '#fff',
            strokeWidth: 1,
            x: -1,
          },
          'name-text': {
            ref: 'name-rect',
            refY: 0.5,
            refX: 0.5,
            textAnchor: 'middle',
            fontWeight: 'bold',
            fill: '#fff',
            fontSize: 12,
          },
        },
      },
      true,
    )

  Graph.registerNode(
    'lane-rect',
    {
      inherit: 'rect',
      width: 100,
      height: 60,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
    },
    true,
  )
  
  Graph.registerNode(
    'lane-polygon',
    {
      inherit: 'polygon',
      width: 80,
      height: 80,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          refPoints: '0,10 10,0 20,10 10,20',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
    },
    true,
  )
  
  Graph.registerEdge(
    'lane-edge',
    {
      inherit: 'edge',
      attrs: {
        line: {
          stroke: '#A2B1C3',
          strokeWidth: 2,
        },
      },
      label: {
        attrs: {
          label: {
            fill: '#A2B1C3',
            fontSize: 12,
          },
        },
      },
    },
    true,
  )
    const graph = new Graph({
      container: document.getElementById("container"),
      grid: true,
      width: 1000,
      height: 1000,
      snapline: true,
      connecting: {
        router: 'orth',
      },
      selecting: {
        enabled: true,
        showNodeSelectionBox: true,
        multiple: false,
      },
      translating: {
        restrict(cellView) {
          const cell = cellView.cell
          const parentId = cell.prop('parent')
          if (parentId) {
            const parentNode = graph.getCellById(parentId)
            if (parentNode) {
              return parentNode.getBBox().moveAndExpand({
                x: 0,
                y: 30,
                width: 0,
                height: -30,
              })
            }
          }
          return cell.getBBox()
        },
      },
    });
    const child = graph.addNode({
      x: 120,
      y: 80,
      width: 80,
      height: 40,
      label: "Child",
      zIndex: 10,
      attrs: {
        body: {
          stroke: "none",
          fill: "#3199FF",
        },
        label: {
          fill: "#fff",
          fontSize: 12,
        },
      },
    });

    const parent = graph.addNode({
      x: 40,
      y: 40,
      width: 240,
      height: 160,
      zIndex: 1,
      label: "Parent\n(try to move me)",
      attrs: {
        label: {
          refY: 120,
          fontSize: 12,
        },
        body: {
          fill: "#fffbe6",
          stroke: "#ffe7ba",
        },
      },
    });
    parent.addChild(child);
    const data = Data;
    const cells = []
    data.forEach((item) => {
      if (item.shape === 'lane-edge') {
        cells.push(graph.createEdge(item))
      } else {
        cells.push(graph.createNode(item))
      }
    })
    graph.resetCells(cells)
    graph.zoomToFit({ padding: 10, maxScale: 1 })
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.x6-widget-selection-selected {
  pointer-events: none;
}
</style>
