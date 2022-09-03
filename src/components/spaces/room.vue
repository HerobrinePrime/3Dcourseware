<template>
  Room asdfasd
  <div class="test">
    <button @click="toMaze">toMaze</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const toMaze = () => {
    router.push({
        name:'maze'
    })
};
</script>

<style lang="less" scoped>
.test {
    color: #fff;
}
</style>