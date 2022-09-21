<template>
  <Model
  physics="map"
    name="npcs"
    ref="char1"
    :x="x1"
    :z="z1"
    :rotationY="rotationY1"
    :src="`/models/characters/${src1}`"
    pbr
    :y="-578.22"
    :width="73.41"
    :depth="84.57"
    :scale="1.75"
    :outline="interacting"
    :onMouseOver="say"
    :onMouseOut="shut"
    :onClick="interact"
  >
  </Model>
  <Model
  physics="map"
    name="npcs"
    ref="char2"
    :x="x2"
    :z="z2"
    :rotationY="rotationY2"
    :src="`/models/characters/${src2}`"
    pbr
    :y="-578.22"
    :width="73.41"
    :depth="84.57"
    :scale="1.75"
    :outline="interacting"
    :onMouseOver="say"
    :onMouseOut="shut"
    :onClick="interact"
  >
  </Model>
  <!-- <Trigger targetIds="character" pad :interval="100"/> -->
  <Transition name="int">
    <div class="context-wrapper" v-show="interacting">
      <img class="dialog-bak" src="/UI/dialog/dialog.png">
      <div class="charcter" v-if="!theContext[count].aside" :style="{
        right:theContext[count].left?'auto':'2vw',
        left:theContext[count].left?'2vw':'auto'
      }">
        <img :src="`/UI/dialog/${theContext[count].c}.png`" />
      </div>
      <div class="context">
        {{ theContext[count].kotoba }}
      </div>
      <div class="next" @click="next">
        <img src="/UI/dialog/next.png">
      </div>
    </div>
  </Transition>
</template>

<script setup>
import {
  onMounted,
  onBeforeUnmount,
  watch,
  watchPostEffect,
  ref,
  computed,
} from "@vue/runtime-core";
import { Transition } from "@vue/runtime-dom";
import { useZIndex } from "element-plus";
import { Model, HTML, Trigger, } from "lingo3d-vue";
import { useStore } from "vuex";
import emitter from "../../eventBus";

const { state, commit, dispatch } = useStore();
const { context } = defineProps([
  "x1",
  "z1",
  "rotationY1",
  "src1",
  "x2",
  "z2",
  "rotationY2",
  "src2",

  "context",
  "mapClick",
]);

const theContext = computed(() => {
  return state.context[context];
});

const count = ref(0);
const done = ref(false)
const next = () => {
  console.log(count, theContext.value.length);
  if (count.value === theContext.value.length - 1) {
    if(!done.value){
      done.value = true
      //emit done
      emitter.emit("done")
    }
    //结束对话
    emitter.emit("interactionEnded");
    interacting.value = false;
    setTimeout(() => {
      count.value = 0;
    }, 500);
  } else {
    count.value++;
  }
};

const interacting = ref(false);
const interact = (e) => {
  emitter.emit("lookat", { x: e.point.x, z: e.point.z });
  interacting.value = true;
  emitter.emit("interactionStarted");
};

onMounted(() => {
  // console.log(theContext);
});
</script>

<style lang="less" scoped>
.context-wrapper {
  width: 90vw;
    height: 25vh;
    position: absolute;
    z-index: 10;
    // background-color: aliceblue;
    bottom: 0;
    margin: 0vw auto;
    left: 0;
    right: 0;
    padding: 20px;
    display: flex;
    justify-content: center;
    font-family: 'xknlt';
    transition: opacity 0.5s ease;
    color: aliceblue;
    font-size: 25px;
  .dialog-bak{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    height: 100%;
    width: 100%;
  }
  .context {
    position: relative;
    height: 100%;
    width: 70%;
    // background-color: aqua;
    z-index: 11;
  }
  .next {
    position: absolute;
    height: 50px;
    width: 50px;
    z-index: 12;
    bottom: 15px;
    right: 15vw;
    cursor: pointer;
  }
  .charcter {
    height: 40vh;
    width: 15vw;
    position: absolute;
    z-index: 10;
    // background-color: aquamarine;
    left: 2vw;
    bottom: 0vh;
    & > img {
      display: block;
      width: 100%;
      max-width: none;
    }
  }
}
.int-enter-from,
.int-leave-to {
  opacity: 0;
}
.int-enter-to,
.int-leave-from {
  opacity: 1;
}
</style>