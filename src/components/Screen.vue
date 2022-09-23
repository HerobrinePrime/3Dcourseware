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
            <img :src="screen" />
            <div class="end-con" v-if="ending">
              <div
                class="content"
                v-for="(end,index) in ends[count]"
                :key="end"
                :class="{ pos: start,intoEnd:!start }"
                :style="{'transition-delay':`${pubDelay}s`}"
              >
                {{ end }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition name="b">
        <div class="next" v-if="!end && screens.length != 1">
          <img src="/UI/screen/next.png" />
        </div>
        <div class="next end" v-else @click="close" >
          结束
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { nextTick, onMounted, Transition, watch, ref, reactive } from "vue";
import Swiper from "swiper";
import emitter from "../eventBus";

const pubDelay = ref(0.5);

const count = ref(0);
const ends = reactive([
  [
    "恭喜你通过了重重考验，",
    "把坏蛋打败啦！",
    "也拯救了这个小镇的居民",
    "让他们回到了正常的生活",
  ],
  [
    "不过在这之前",
    "这里一片黑暗，漫无天日",
    "居民们的生活在这个虚拟世界里",
    "不知何时才能从诈骗的阴影中走出来",
    "直至你的到来",
    "学习了很多关防诈骗的知识，",
    "加上一次次失败的经验",
    "能够在面临各种情况下都能解决危机",
  ],
  [
    "现实世界里有同样的难题在等着你",
    "身边也有很多人需要你的帮助",
    "带着你的知识和经验",
    "把防诈骗的意识带给他们",
    "一起努力，世界就会更好",
  ],
  [
    "网络一线牵，是非难分辨",
    "防诈反诈长存于心",
    "擦亮双眼明辨善恶",
  ],
]);

const props = defineProps(["screens", "screenOn", "ending"]);
const end = ref(false);
let countTimer = {}
let timer = {}
watch(props, async (n) => {
  if (!n.screenOn) return;
  await nextTick();
  const swiper = new Swiper(".screen", {
    spaceBetween: 300,
    effect: "fade",
    fadeEffect: {
      crossFade: false,
    },
    speed: 2000,
    allowTouchMove: false,
    navigation: {
      nextEl: ".next",
      // prevEl: ".swiper-button-prev",
    },
    on: {
      slideNextTransitionStart: function () {
        console.log(this.activeIndex);
        if (this.activeIndex == n.screens.length - 1) end.value = true;
        clearTimeout(countTimer)
        countTimer = setTimeout(()=>{
          count.value = this.activeIndex;
        },800)
        start.value = false
        clearTimeout(timer)
        timer = setTimeout(()=>{
          start.value = true
        },900)
      },
    },
    //   pagination: {
    //     el: ".next",
    //     clickable: true,
    //   },
  });

  start.value = true;
});

const start = ref(false);

const close = ()=>{
  emitter.emit('screenOff', props.ending)
  end.value = false
}

// await nextTick();
onMounted(() => {});
</script>

<style lang="less" scoped>
.screen-wrapper {
  position: absolute;
  z-index: 2000;
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
      background-color: #000;
      text-align: center;
      color: #fff;

      img {
        // height: 100%;
        // width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
      }
    }
  }
  .next {
    position: absolute;
    z-index: 126;
    bottom: 50px;
    right: 40px;
    color: white;
    font-size: 50px;
    transition: opacity 0.8s ease;
    cursor: pointer;
    img {
      height: 80px;
    }
  }
  .end {
    height: 50px;
    width: 130px;
    font-family: "xknlt";
    background-color: #e9b700;
    border-radius: 22px;
    font-size: 40px;
    line-height: 42.3px;
    text-align: center;
    box-shadow: 0px 8px #f96f01;
    bottom: 69px;
  }
  .b-enter-from,
  .b-leave-to {
    opacity: 0;
  }
  .b-enter-to,
  .b-leave-from {
    opacity: 1;
  }

  .end-con {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #716566;
    font-family: "xknlt";
    font-size: 40px;
    .pos {
      opacity: 1 !important;
      top: 0 !important;
    }
    .intoEnd{
      transition-delay: 0s!important;
    }
    .content {
      opacity: 0;
      position: relative;
      // top: -20px;
      transition: opacity 0.7s ease 1s,top 0.7s ease 1s;
    }
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