<template>
  <div v-if="name === 'submit'" class="icon-wrapper">
    <svg  class="task__icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 11V6.5H15.5V11C15.5 11.3978 15.342 11.7794 15.0607 12.0607C14.7794 12.342 14.3978 12.5 14 12.5H5C4.1675 12.5 3.5 11.825 3.5 11V2C3.5 1.1675 4.1675 0.5 5 0.5H11V2H5V11H14ZM7.1825 4.31L9.5 6.6275L14.4425 1.685L15.5 2.75L9.5 8.75L6.125 5.375L7.1825 4.31ZM11 14V15.5H2C1.60218 15.5 1.22064 15.342 0.93934 15.0607C0.658035 14.7794 0.5 14.3978 0.5 14V4.25H2V14H11Z" />
    </svg>
  </div>
  <div v-if="name === 'touch'" class="icon-wrapper">
    <svg width="16" class="task__icon" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 14.375C14 14.975 13.475 15.5 12.875 15.5H8.75C8.45 15.5 8.225 15.425 8 15.2L5 12.05L5.525 11.45C5.675 11.3 5.9 11.225 6.125 11.225H6.275L8 12.5V5.75C8 5.3 8.3 5 8.75 5C9.2 5 9.5 5.3 9.5 5.75V9.125L10.4 9.2L13.325 10.85C13.7 11 14 11.45 14 11.825V14.375ZM14 0.5H2C1.175 0.5 0.5 1.175 0.5 2V8C0.5 8.825 1.175 9.5 2 9.5H5V8H2V2H14V8H12.5V9.5H14C14.825 9.5 15.5 8.825 15.5 8V2C15.5 1.175 14.825 0.5 14 0.5Z"/>
    </svg>
  </div>
  <svg v-if="name === 'close'" width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.883644 17.8554L8.26215 10.4769L7.5243 9.73909L0.145794 17.1176L0.883644 17.8554Z" fill="#E10019"/>
    <path d="M10.4757 8.26339L17.8542 0.884883L17.1164 0.147033L9.73785 7.52554L10.4757 8.26339Z" fill="#E10019"/>
    <path d="M10.4757 9.73909L17.8542 17.1176L17.1164 17.8554L9.73785 10.4769L10.4757 9.73909Z" fill="#E10019"/>
    <path d="M8.26215 7.52554L0.883644 0.147033L0.145794 0.884883L7.5243 8.26339L8.26215 7.52554Z" fill="#E10019"/>
  </svg>
</template>
<script>
// import { defineProps } from 'vue'
// defineProps(['name'])
export default {
  props: ['name'],
}
</script>
<style>
.task__icon {
  fill: white;
}

.icon-wrapper {
  border: 1px solid white;
  margin-right: 12px;
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.icon-wrapper:hover {
  border: 1px solid black;
}
.icon-wrapper:hover > .task__icon {
  fill: black;
}
</style>