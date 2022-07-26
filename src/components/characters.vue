<template>
  <Model
    name="npcs"
    ref="char1"
    :x="x1"
    :z="z1"
    :rotationY="rotationY1"
    :src="`models/characters/${src1}`"
    pbr
    :y="87.38"
    :width="73.41"
    :depth="84.57"
    :scale="1.75"
    :outline="interacting"
    :onMouseOver="say"
    :onMouseOut="shut"
    :onClick="interact"
  >
    <HTML>
      <div class="hanashi" v-show="state.kaiwa[kaiwa][count].c && saying">
        {{ state.kaiwa[kaiwa][count].kotoba }}
      </div>
    </HTML>
  </Model>
  <Model
    name="npcs"
    ref="char2"
    :x="x2"
    :z="z2"
    :rotationY="rotationY2"
    :src="`models/characters/${src2}`"
    pbr
    :y="87.38"
    :width="73.41"
    :depth="84.57"
    :scale="1.75"
    :outline="interacting"
    :onMouseOver="say"
    :onMouseOut="shut"
    :onClick="interact"
  >
    <HTML>
      <div class="hanashi" v-show="!state.kaiwa[kaiwa][count].c && saying">
        {{ state.kaiwa[kaiwa][count].kotoba }}
      </div>
    </HTML>
  </Model>

  <Transition name="i">
    <div class="ichizon" v-show="interacting">
      <div class="inter">
        <div class="continue" @click="tuzuki">continue</div>
        <div class="end" @click="end">end</div>
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
} from "@vue/runtime-core";
import { useZIndex } from "element-plus";
import { Model, HTML } from "lingo3d-vue";
import { useStore } from "vuex";
import emitter from "../eventBus";
import store from "../store";

const { state, commit } = useStore();
const { kaiwa, theThirdKey, theForthKey } = defineProps([
  "x1",
  "z1",
  "rotationY1",
  "src1",
  "x2",
  "z2",
  "rotationY2",
  "src2",
  "kaiwa",
  "theThirdKey",
  "theForthKey",
]);

const count = ref(0);
const done = ref(false);
watch(done, (newVlaue) => {
  console.log(newVlaue);
  console.log("theThirdKey:", theThirdKey);
  console.log("theForthKey:", theForthKey);
  if(theThirdKey) emitter.emit('gettreasure',3)
  if(theForthKey) emitter.emit('gettreasure',4)
});

const char1 = ref();
const char2 = ref();
const saying = ref(false);
const interacting = ref(false);
const say = () => {
  saying.value = true;
};
const shut = () => {
  saying.value = false;
};
const interact = (e) => {
  emitter.emit("lookat", { x: e.point.x, z: e.point.z });
  //display其他对话
  emitter.emit("disable", {
    kaiwa,
  });

  //开启outline
  interacting.value = true;
  //正在说话
  saying.value = true;
  //注销enter & out
  const character1 = char1.value;
  character1.onMouseOver = undefined;
  character1.onMouseOut = undefined;

  const character2 = char2.value;
  character2.onMouseOver = undefined;
  character2.onMouseOut = undefined;

  //emitter切换视角
  emitter.emit("interactionStarted");
};
const disinteract = () => {
  //enable所有
  emitter.emit("enable");

  //注册enter & out
  const character1 = char1.value;
  character1.onMouseOver = say;
  character1.onMouseOut = shut;
  const character2 = char2.value;
  character2.onMouseOver = say;
  character2.onMouseOut = shut;
  //不说了
  saying.value = false;
  //disinteract
  interacting.value = false;
  //重置count
  count.value = 0;

  //emitter切换视角
  emitter.emit("interactionEnded");
};
let reject = false;
const tuzuki = () => {
  if (reject) return;
  count.value++;
  console.log(count.value);
  if (count.value >= state.kaiwa[kaiwa].length) {
    reject = true;
    setTimeout(() => {
      reject = false;
    }, 1200);
    //没话了
    disinteract();
    //已经完成一轮对话
    done.value = true;
  }
};
const end = () => {
  disinteract();
};

//事件总线
onMounted(() => {
  emitter.on("disable", (params) => {
    //有kaiwa 判断是不是自己发出的
    if (params.kaiwa != undefined) {
      console.log("kaiwa:", params.kaiwa);
      //kaiwa kaiwa以外所有kaiwa和hanashi全部失效
      if (params.kaiwa == kaiwa) {
        //是自己发出的，不用管
        return;
      } else {
        //不是自己发出的 ban自己
        const character1 = char1.value;
        const character2 = char2.value;
        character1.onMouseOver = undefined;
        character1.onMouseOut = undefined;
        character1.onClick = undefined;
        character2.onMouseOver = undefined;
        character2.onMouseOut = undefined;
        character2.onClick = undefined;
      }
    }
    //有hanashi 直接ban自己
    if (params.hanashi != undefined) {
      const character1 = char1.value;
      const character2 = char2.value;
      character1.onMouseOver = undefined;
      character1.onMouseOut = undefined;
      character1.onClick = undefined;
      character2.onMouseOver = undefined;
      character2.onMouseOut = undefined;
      character2.onClick = undefined;
    }
  });
  emitter.on("enable", () => {
    //注册所有事件
    const character1 = char1.value;
    character1.onMouseOver = say;
    character1.onMouseOut = shut;
    character1.onClick = interact;

    const character2 = char2.value;
    character2.onMouseOver = say;
    character2.onMouseOut = shut;
    character2.onClick = interact;
  });
});
onBeforeUnmount(() => {
  emitter.off("disable");
  emitter.off("enable");
});
</script>

<style lang="less" scoped>
// world中的html
.hanashi {
  // position: absolute;
  // font-size: 30px;
  // bottom: 70px;
  // left: 0px;
  // cursor: pointer;
  // background-image: url(br.png);
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // padding: 30px 30px 80px 80px;

  color: #000;
  max-width: 400px;
  font-size: 30px;
  border: 5px solid #766baa;
  border-radius: 15px;
  border-bottom-left-radius: 18px;
  background-color: rgb(255, 253, 255);
  padding: 20px;
  // box-shadow: 0px 0px 3px 3px #fff;
  position: absolute;
  bottom: 70px;
  left: 0px;
  cursor: pointer;
  &::after {
    // content: " ";
    // position: absolute;
    // bottom: -20px;
    // left: 8px;
    // height: 0;
    // width: 0;
    // border: #766baa solid 20px;
    // border-left-color: transparent;
    // border-right-color: transparent;
    // border-bottom: none;
    // // box-shadow: 0px 0px 3px 3px #fff;
    // text-shadow: 0px 0px 3px 3px #fff;

    position: absolute;
    content: " ";
    height: 30px;
    width: 30px;
    background-color: white;
    bottom: -1px;
    left: 0;
    transform: translate(15px, 15px) rotate(45deg);
    border: 5px solid #766baa;
    border-left-color: transparent;
    border-top-color: transparent;
    // box-shadow: 8px 8px 20px 1px #fff;
  }
}
//一存
.ichizon {
  position: absolute;
  z-index: 100;
  height: 200px;
  width: 400px;
  bottom: 0;
  margin-left: 50%;
  transform: translate(0, -50px);
  background-color: #fff;
  border-radius: 20px;
  transition: opacity 0.7s ease 0.3s;

  .inter {
    height: 100%;
    width: 400px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgb(255, 253, 255);
    border-radius: 20px;
    border: 5px solid #766baa;
    div {
      height: 30px;
      width: 80px;
      text-align: center;
      line-height: 30px;
      color: #000;
      font-size: 30px;
      cursor: pointer;
    }
    &::after {
      content: "";
      height: 50px;
      width: 50px;
      position: absolute;
      background-color: #fff;
      bottom: 75px;
      left: -20px;
      // transform-origin: 50% 50%;
      transform: rotate(45deg);
      border: 5px solid #766baa;
      border-top-color: transparent;
      border-right-color: transparent;
    }
  }
}
.i-enter-from,
.i-leave-to {
  opacity: 0;
}
.i-enter-to,
.i-leave-from {
  opacity: 1;
}
</style>