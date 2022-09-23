<template>
    <div class="reward-main">
        <img :src="`/UI/rewards/${reward}.png`">
    </div>
</template>

<script setup>
import { ref,defineProps } from "vue"

const props =  defineProps(['reward'])
console.log(props);
</script>

<style lang="less" scoped>
.reward-main{
    position: absolute;
    z-index: 1020;
    height: 80vh;
    width: 155vh;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    /* background-color: antiquewhite; */
    justify-content: center;
    align-items: center;
    // transform: scale(1.2);
}
</style>