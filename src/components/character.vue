<template>
  <Model
    name="npc"
    ref="char"
    pbr
    :x="x"
    :z="z"
    :src="`models/characters/${src}`"
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
    <HTML>
      <div class="hanashi" v-show="saying">
        {{ state.hanashi[hanashi][count] }}
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
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { HTML, Model } from "lingo3d-vue";
import emitter from "../eventBus";
import { onBeforeUnmount, onMounted, Transition } from "@vue/runtime-dom";

const { hanashi } = defineProps(["x", "z", "rotationY", "src", "hanashi"]);
const { state,commit } = useStore();

const count = ref(0);
const done = ref(false);

const char = ref();
const saying = ref(false);
const interacting = ref(false);
const say = () => {
  // console.log("say");
  saying.value = true;
};
const shut = () => {
  // console.log("shut");
  saying.value = false;
};
const interact = (e) => {
  emitter.emit("lookat", { x: e.point.x, z: e.point.z });
  //disable其他对话
  emitter.emit("disable", {
    hanashi,
  });

  //开启outline
  interacting.value = true;
  //正在说话
  saying.value = true;
  //注销enter & out
  const character = char.value;
  character.onMouseOver = undefined;
  character.onMouseOut = undefined;

  //emitter切换视角
  emitter.emit("interactionStarted");
};
const disinteract = () => {
  //enable所有
  emitter.emit("enable");

  //注册enter & out
  const character = char.value;
  character.onMouseOver = say;
  character.onMouseOut = shut;
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
  if (count.value >= state.hanashi[hanashi].length) {
    reject = true;
    setTimeout(() => {
      reject = false;
    }, 1200);
    //没话了
    // console.log('disinteract');
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
    //有hanashi，需要判断是不是emitter
    if (params.hanashi != undefined) {
      console.log("hanashi:", params.hanashi);
      if (params.hanashi == hanashi) {
        //这个hanashi就是emit的hanashi
        return;
      } else {
        //这个hanashi不是emitter ban自己
        const character = char.value;
        character.onMouseOver = undefined;
        character.onMouseOut = undefined;
        character.onClick = undefined;
      }
    }
    //有kaiwa,直接ban自己
    if (params.kaiwa != undefined) {
      const character = char.value;
      character.onMouseOver = undefined;
      character.onMouseOut = undefined;
      character.onClick = undefined;
    }
  });
  emitter.on("enable", () => {
    //注册所有事件
    const character = char.value;
    character.onMouseOver = say;
    character.onMouseOut = shut;
    character.onClick = interact;
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
  // color: #000;
  // max-width: 400px;
  // font-size: 30px;
  // border: 2px solid #39c5bb;
  // border-top: 28px solid transparent;
  // border-right: 29px solid transparent;
  // border-bottom: 78px solid transparent;
  // border-left: 78px solid transparent;
  // border-image: url(br.png) 30 30 80 80 stretch;
  // border-image-width: 30px 30px 80px 80px;
  // transform: scale(1.01);
  // background-color: #fff;
  // background-clip:padding-box;
  // position: absolute;
  // bottom: 70px;
  // left: 0px;
  // border-radius: 15px;
  // border-bottom-left-radius: 18px;
  // background-color: #fff;
  // padding: -50px;
  // background-clip:padding-box;
  // padding: 8px;

  // position: absolute;
  // bottom: 70px;
  // left: 0px;
  // cursor: pointer;
  // background-image: url(br.png);
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // padding: 30px 30px 80px 80px;

  // &::after {
  //   content: " ";
  //   position: absolute;
  //   bottom: -19px;
  //   left: 8px;
  //   height: 0;
  //   width: 0;
  //   border: #39c5bb solid 20px;
  //   border-left-color: transparent;
  //   border-right-color: transparent;
  //   border-bottom: none;
  // }
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