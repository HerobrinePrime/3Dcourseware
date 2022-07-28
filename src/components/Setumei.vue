<template>
  <div class="setumei">
    <img :src="akashi">
    {{akashi}}
  </div>
</template>

<script setup>
const {akashi} = defineProps(['akashi'])


</script>

<style lang="less" scoped>
.setumei {
  // display: none;
  height: 600px;
  width: 600px;
  position: absolute;
  background-color: antiquewhite;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>