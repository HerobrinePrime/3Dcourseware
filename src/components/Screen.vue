<template>
  <!-- screen -->
  <Transition>
    <div class="screen-wrapper" v-if="screenOn">
      <div class="screen swiper">
        <div class="swiper-wrapper">
          <div
            class="screen-img swiper-slide"
            v-for="screen in screens"
            :key="screen"
          >
            <img :src="screen">
          </div>
        </div>
      </div>
      <Transition name="b">
        <div class="next" v-if="!end"><img src="/UI/screen/next.png" /></div>
        <div class="next" v-else @click="emitter.emit('screenOff')">end</div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup> 
import {  nextTick, onMounted, Transition, watch,ref } from "vue";
import Swiper from "swiper";
import emitter from "../eventBus";

const props = defineProps(["screens", "screenOn"]);
const end = ref(false);
watch(props, async (n) => {
  if (!n.screenOn) return;
  await nextTick();
  const swiper = new Swiper(".screen", {
    spaceBetween: 30,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    speed: 2000,
    allowTouchMove: false,
    navigation: {
      nextEl: ".next",
      // prevEl: ".swiper-button-prev",
    },
    on: {
      slideNextTransitionStart: function () {
        // console.log(this.activeIndex);
        if(this.activeIndex == n.screens.length - 1) end.value = true
      },
    },
    //   pagination: {
    //     el: ".next",
    //     clickable: true,
    //   },
  });
});

// await nextTick();
onMounted(() => {});
</script>

<style lang="less" scoped>
.screen-wrapper {
  position: absolute;
  z-index: 125;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  transition: opacity 1.2s ease;
  .screen {
    position: absolute;
    z-index: 125;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: #00000038;

    .screen-img {
      height: 100%;
      width: 100%;
      background-color: rgba(250, 235, 215, 0.095);
      text-align: center;
      color: #fff;


      img{
        // height: 100%;
        // width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }

  .next {
    position: absolute;
    z-index: 126;
    bottom: 25px;
    right: 25px;
    color: white;
    font-size: 50px;
    transition: opacity 0.8s ease;
    cursor: pointer;
    img{
      height: 70px;
    }
  }
  .b-enter-from,
  .b-leave-to {
    opacity: 0;
  }
  .b-enter-to,
  .b-leave-from {
    opacity: 1;
  }
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
v-leave-from {
  opacity: 1;
}
</style>