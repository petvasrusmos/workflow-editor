<template>
  <div className="my-first-dag-edge">{{ edge.source.id }} to {{ edge.target.id }}</div>
</template>
<script>
export default {
  name: 'EdgeComponent',
  props: ['source', 'target'],
  emits: ['update:source','update:target'],
}
</script>
<style>
.my-first-dag-edge {
  text-align: center;
  margin-top: -20px;
}
</style>