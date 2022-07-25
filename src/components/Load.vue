<script setup>
import { computed, ref, watch } from "@vue/runtime-core";
import { usePreload } from "lingo3d-vue";
import { useRouter } from "vue-router";
import { Transition } from "@vue/runtime-dom";
import Game from "./Game.vue";

// export default {
//   components: {
//     Game,
//     Transition,
//   },
// setup(props, context) {
const router = useRouter();
// console.log(router);

const progress = usePreload(
  [
    "/models/main/SCEEN-final.fbx",
    "/models/main/cat.fbx",
    "/models/main/trees.fbx",
    "/models/main/diamond4.fbx",
    "/models/main/diamond3.fbx",
    "/models/main/diamond2.fbx",
    "/models/main/diamond1.fbx",
    "/svg/arrow.svg",
    "/env/sunset_fairway_4k.hdr",
    "/env/env1.hdr",
    "/UI/icon1.webp",
    "/UI/icon2.webp",
    "/UI/icon3.webp",
    "/UI/icon4.webp",
    "/UI/book/bot.png",
    "/UI/book/fro.png",
    "/UI/book/claw.png",
    "/UI/book/close.png",
    "/UI/icon2.webp",
    "/UI/icon3.webp",
    "/UI/icon4.webp",
    "/UI/login/student.png",
    "/UI/login/password.png",
    "/UI/login/portrait0.png",
    "/UI/login/portrait1.png",
    "/UI/login/camera.png",
    "/fonts/hwhp.ttf",
  ],
  "35.42MB"
);

const loaded = computed(() => {
  return progress.value == 100;
});

// if (loaded) {

// }

const started = ref(false);
const getStart = () => {
  started.value = true;
};

// return {
//   progress,
//   loaded,
//   started,
//   getStart,
// };
// },
// };
</script>

<template>
  <Transition name="v1">
    <div class="bc" v-if="!started">
      <div class="moji" v-if="!loaded">{{ Math.round(progress) }}%</div>
      <div class="moji" v-else @click="getStart">Start</div>

      <div class="load-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 46 46"
          class="base"
        >
          <circle class="a" cx="23" cy="23" r="20" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 46 46"
          class="loader"
          :style="{
            strokeDashoffset: `calc(-2 * 3.1416 * 20 * (1 - ${
              progress / 100
            }))`,
          }"
        >
          <circle class="a" cx="23" cy="23" r="20" />
        </svg>
      </div>
    </div>
  </Transition>
  <div class="wrapper" :class="{ show: started }"><Game /></div>

  <div class="load-font">asdf</div>
</template>

<!-- transition: filter 0.8s ease;
    filter: brightness(0); -->

<style lang="less" scoped>
.v1-enter-active,
.v1-leave-active {
  transition: filter 0.8s ease;
}
.v1-leave-from,
.v1-enter-to {
  filter: brightness(1);
}
.v1-leave-to,
.v1-enter-from {
  filter: brightness(0);
}

.wrapper {
  height: 100vh;
  width: 100vw;
  opacity: 0;
  transition: opacity 1s ease 0.8s;
  position: absolute;
  z-index: 0;
}
.show {
  opacity: 1;
}
@font-face {
  font-family: hwhp;
  src: url("/fonts/hwhp.ttf");
}
.load-font {
  font-family: "hwhp";
  position: absolute;
  z-index: -1;
  top: -50px;
}
.bc {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(/stars/stars.webp);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  .moji {
    font-weight: bolder;
    position: relative;
    z-index: 7;
    cursor: pointer;
    color: #aaffee;
    font-size: 30px;
  }
  .load-box {
    height: 200px;
    width: 200px;
    transition: 0.8s ease;
    position: absolute;
    z-index: 5;
    right: 0;
    top: -0;
    left: 0;
    bottom: 0;
    margin: auto;
    svg {
      position: absolute;
      overflow: hidden;
      backface-visibility: hidden;
      circle {
        overflow: hidden;
        transition: all 0.2s ease;
        fill: none;
        stroke: #43bcc7b5;
        stroke-miterlimit: 10;
        stroke-width: 2px;
        backface-visibility: hidden;
        transition: stroke 1.1s ease;
      }
    }
    .base {
      opacity: 0.5;
    }
    .loader {
      opacity: 1;
      stroke-dasharray: calc(2 * 3.1416 * 20);
      transform: rotateY(180deg);
      animation-fill-mode: both;
      transition: stroke-dashoffset 1s ease;
    }
  }
  animation: enter 1s ease forwards;
}
@keyframes enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>