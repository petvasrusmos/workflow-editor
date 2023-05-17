<template>
  <div class="my-first-dag-node">
    <div @mousedown="startNodeDragging">
        <span>{{ node.data?.label || node.id }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "EditableNode",
  props: ["node", "niceDagReactive"],
  setup(props) {
    return {
      startNodeDragging(e) {
        props.niceDagReactive.use().startNodeDragging(props.node, e);
      },
    };
  },
};
</script>
<style>
.my-first-dag-node > span {
  display: block;
  height: 100%;
  width: 100%;
}
</style>