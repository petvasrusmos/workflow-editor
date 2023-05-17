<template>
  <div className="my-first-dag-node">
    <span>{{ node.id }} </span>
  </div>
</template>
<script>
export default {
  name: 'SampleNode',
  props: ["node"],
  emits: ["update:node"],
};
</script>
<style>
.my-first-dag-node {
  width: 100%;
  height: 100%;
  border: 1px solid black;
}
</style>