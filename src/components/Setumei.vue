<template>
  <div class="setumei">
    <img :src="treasure">
  </div>
</template>

<script setup>
import { computed } from "@vue/runtime-core"

const {akashi} = defineProps(['akashi'])

const treasure = computed(()=>{
  const arr = akashi.split('/')
  return `/UI/bag/introduction/${arr[arr.length - 1]}`
})


</script>

<style lang="less" scoped>
.setumei {
  width: 900px;
  height: 506px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  img{
    display: block;
    width: 900px;
    height: 506px;
  }
}
</style>