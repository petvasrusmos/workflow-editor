<template>
  <div class="main">
    <div>
      <div class="create-flowy">
        <Alert class="alertBox" color="primary">
          Block1
        </Alert>
      </div>
      <div class="create-flowy">
        <Alert class="alertBox" color="secondary">
          Block2
        </Alert>
      </div>
    </div>
      <div
        id="canvas"
        width="400"
        height="300"
      ></div>
    </div>
</template>
<script setup>
// import { flowy, onGrab, onRelease, onSnap }  from 'flowy'
console.log(window.flowy)

let spacing_x = 40
let spacing_y = 100
// Initialize Flowy
window.flowy(document.getElementById("canvas"), onGrab, onRelease, onSnap, spacing_x, spacing_y)
function onGrab(block) {
  console.log('onGrab', block)
  // When the user grabs a block
}
function onRelease() {
  console.log('onRelease')
  // When the user releases a block
}
function onSnap(block, first, parent) {
  console.log(block, first, parent, 'onSnap')
  // When a block snaps with another one
}
</script>