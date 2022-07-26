<template>
  <div class="phone" :class="{ off: !phoneOn }">
    <div class="body">
      <div class="contact">
        <div class="hito" @click="storeCount = 1" v-show="unlockContent > 0">
          <div class="icon"></div>
          <div class="name">上午1</div>
        </div>
        <div class="hito" @click="storeCount = 2" v-show="unlockContent > 1">
          <div class="icon"></div>
          <div class="name">上午2</div>
        </div>
        <div class="hito" @click="storeCount = 3" v-show="unlockContent > 2">
          <div class="icon"></div>
          <div class="name">上午3</div>
        </div>
        <div class="hito" @click="storeCount = 4" v-show="unlockContent > 3">
          <div class="icon"></div>
          <div class="name">上午4</div>
        </div>
      </div>
      <!-- content -->
      <Content :count="storeCount" v-show="storeCount == 1" :sign="1"/>
      <Content :count="storeCount" v-show="storeCount == 2" :sign="2"/>
      <Content :count="storeCount" v-show="storeCount == 3" :sign="3"/>
      <Content :count="storeCount" v-show="storeCount == 4" :sign="4"/>
      <!-- <keep-alive>
        <router-view></router-view>
      </keep-alive> -->
      
      <img class="back" src="/UI/phone/back.png" @click="storeCount = 0"/>
      
    </div>
    <button class="batu" @click="emitter.emit('thephone')">
      <img src="/UI/phone/batu.png">
    </button>
  </div>
</template>

<script setup>
import { useSpring } from "lingo3d-vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

import Content from '../content.vue'

import emitter from "../../eventBus";

defineProps(["phoneOn"]);
const storeCount = ref(0)
const unlockContent = ref(0)

onMounted(()=>{
  emitter.on('getmessage',()=>{
    unlockContent.value ++
  })
})
onBeforeUnmount(()=>{
  emitter.off('getmessage')
})
</script>

<style lang="less" scoped>
@font-face {
  font-family: "xknlt";
  src: url(fonts/xknlt.ttf);
}
.phone {
  transform: translate(0, 0);
  transition: transform 0.7s ease;
  z-index: 100;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 578px;
  width: 827px;
  background-image: url(/UI/phone/body.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  // background-color: rgba(240, 248, 255, 0.755);
  .body {
    position: absolute;
    top: 7.4%;
    left: 10.4%;
    height: 85.5%;
    width: 78.56%;
    background-image: url(/UI/phone/screen.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .contact {
      position: absolute;
      height: 71%;
      width: 32.2%;
      bottom: 12px;
      left: 3px;
      // background-color: antiquewhite;
      overflow: auto;
      &::-webkit-slider-runnable-track {
        -webkit-appearance: none;
      }
      &::-webkit-scrollbar-track {
        -webkit-appearance: none;
        background-color: transparent;
      }
      &::-webkit-scrollbar {
        // -webkit-appearance: none;
        width: 5px;
        // height: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 2.5px;
      }
      &::-webkit-scrollbar-thumb {
        -webkit-appearance: none;
        width: 2px;
        height: 8px;
        background-color: rgba(191, 191, 191, 0.485);
      }
      .hito {
        cursor: pointer;
        width: 100%;
        height: 27%;
        // background-color: aqua;
        border-top: 1.5px solid rgb(208, 211, 212);
        border-bottom: 1.5px solid rgb(208, 211, 212);
        &:nth-of-type(1) {
          border-top: 3px solid rgb(208, 211, 212);
        }
        &:nth-last-of-type(1) {
          border-bottom: 3px solid rgb(208, 211, 212);
        }
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .icon {
          height: 70px;
          width: 70px;
          background-color: antiquewhite;
          margin: 0 20px;
        }
        .name {
          font-family: "xknlt";
          color: rgb(213, 211, 211);
          font-size: 27px;
        }
      }
    }
    .back {
      position: absolute;
      top: 23px;
      left: 227px;
      display: block;
      height: 34px;
      // box-shadow: 0px 0px 3px 3px #fff;
      cursor: pointer;
    }

  }
  .batu{
    position: absolute;
    right: 5.4%;
    top: 44.6%;
    // background-color: aqua;
    img{
      height: 25px;
    }
  }
}
.off {
  transform: translate(0, 100vh);
}
</style>