<template>
  <div>
    <div className="my-first-dag" ref="niceDagEl"/>
    <NiceDagNodes v-slot="slotProps" :niceDagReactive="niceDagReactive">
      <EditableNode 
      :node="slotProps.node"
      :niceDagReactive="niceDagReactive.use()"
    />
    </NiceDagNodes>
  </div>
</template>

<script>
// NiceDagEdges
import { useNiceDag, NiceDagNodes, } from "@ebay/nice-dag-vue3";
import EditableNode from "./EditableNode";
// import SampleNode from './SampleNode';
import { onMounted } from "vue";
// import EdgeComponent from "./Edge";

const NodeData = [
  {
    id: "start",
  },
  {
    id: "task",
    dependencies: ["start"],
  },
  {
    id: "end",
    dependencies: ["task"],
  },
];

function getNodeSize({ node }) {
  console.log(node)
  return {
    width: 60,
    height: 60,
  };
}

  export default {
    name: 'MyFirstDag',
    components: {
      NiceDagNodes,
      // NiceDagEdges,
      // SampleNode,
      // EdgeComponent,
      EditableNode
    },
    setup() {
      const { niceDagEl, niceDagReactive } = useNiceDag(
        {
          initNodes: NodeData,
          getNodeSize
        },
        true
      );
      onMounted(() => {
        const niceDag = niceDagReactive.use();  //get niceDag object
        if (niceDag) {
          const bounds = niceDagEl.value.getBoundingClientRect();
          console.log(bounds)
          niceDag.startEditing();
        }
      });
      return {
        niceDagEl,
        niceDagReactive,
      };
    },
  }
  </script>
  <style scoped>
  .my-first-dag {
  height: 400px;
  width: 400px;
}
  </style>