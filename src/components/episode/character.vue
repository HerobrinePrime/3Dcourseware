<template>
  <Model
    name="npc"
    ref="char"
    pbr
    :x="x"
    :z="z"
    :src="`/models/characters/${src}`"
    :y="87.38"
    :width="73.41"
    :depth="84.57"
    :scale="1.75"
    :rotationY="rotationY"
    :outline="interacting"
    :onMouseOver="say"
    :onMouseOut="shut"
    :onClick="interact"
  >
  </Model>
</template>

<script setup>
import { useStore } from "vuex";
import { HTML, Model, Sprite } from "lingo3d-vue";
import emitter from "../../eventBus";
import { onBeforeUnmount, onMounted, ref, watch } from "@vue/runtime-core";
import { Transition } from "@vue/runtime-dom";

const { } = defineProps([
  "x",
  "z",
  "rotationY",
  "src",
]);
const { state, commit,dispatch } = useStore();

</script>

<style lang="less" scoped>
</style>