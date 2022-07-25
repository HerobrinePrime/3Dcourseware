<script setup>
import { ref } from "vue"

const challengeOn = ref(false)
const rank = ref(0)

</script>

<template>
  <div class="challenge" v-if="challengeOn">
        
  </div>
</template>

<style lang="less" scoped>
.challenge {
    position: absolute;
    height: 800px;
    width: 1100px;
    background-color: aqua;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>