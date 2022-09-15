<template>
  <div class="report">
    <div class=" report1" :class="{one:start}">{{ student.name }}同学：</div>
    <div class=" report2" :class="{one:start}">你本次一共学习了{{ time }}分钟</div>
    <div class=" report3" :class="{one:start}">查看了{{ datas.news }}条新闻</div>
    <div class=" report4" :class="{one:start}">收集到了{{ datas.treasures }}个智慧锦囊</div>
    <div class=" report5" :class="{one:start}">成功防范诈骗{{ datas.phones }}次</div>
    <div class=" report6" :class="{one:start}">挑战了{{ datas.challenges }}次击败了全部坏蛋</div>
    <div class=" report7" :class="{one:start}">一共做了{{ datas.questions }}道反诈骗题目</div>
    <div class=" report8" :class="{one:start}">正确率为{{ Math.floor(datas.solved * 100 / datas.questions) }}%</div>
    <div class=" final" :class="{one:start}" @click="toMain">
      <span>完成</span>
      <img class="kansei" src="/UI/book/claw.png" />
    </div>
  </div>

  <Transition>
    <div class="to-main" v-show="showMain"></div>
  </Transition>
</template>

<script setup>
import { computed, onMounted, ref } from "@vue/runtime-core";
import { Transition } from "@vue/runtime-dom";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const {
  state: { student, datas },
} = useStore();

const router = useRouter();

const time = computed(() => {
  const now = new Date();
  return Math.ceil((now - datas.start) / 1000 / 60);
});

const start = ref(false)
onMounted(()=>{
    setTimeout(()=>{
        start.value = true
    },1500)
})

const showMain = ref(false);
const toMain = () => {
  showMain.value = true;
  setTimeout(() => {
    router.replace({
      name: "main",
    });
  }, 800);
};
</script>

<style lang="less" scoped>
@font-face {
  font-family: "xknlt";
  src: url(/fonts/xknlt.ttf);
}
.report {
  height: 70vh;
  width: 50vw;
  position: absolute;
  z-index: 2000;
  // background-color: #000;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  text-align: center;
  color: rgb(248, 248, 248);
  display: flex;
  flex-direction: column;
  div {
    font-size: 40px;
    font-family: "xknlt";
    opacity: 0;
    transition-duration: 0.5s!important;
    // height: 2vh;
    // display: inline;
  }
  .one{
    opacity: 1!important;
    padding:0 50px;
    text-align: center;
  }
  .report1 {
    text-align: left;
    margin-bottom: 10px;
    transition-delay: 0.2s;
    padding: 0;
  }
  .report2{
    transition-delay: 0.9s;
    // text-align: left;
    // padding-left: 20px;
  }
  .report3{
    transition-delay: 1.1s;
  }
  .report4{
    transition-delay: 1.3s;
  }
  .report5{
    transition-delay: 1.5s;
  }
  .report6{
    transition-delay: 1.7s;
  }
  .report7{
    transition-delay: 1.9s;
  }
  .report8{
    transition-delay: 2.1s;
    // text-align: left;
    // padding-left: 100px;
  }
  .final {
    transition-delay: 3.3s;
    cursor: pointer;
    font-size: 30px;
    text-align: right;
    margin-top: 20px;
    position: relative;
    span {
      position: absolute;
      width: 60px;
      text-align: center;
      right: 2px;
      top: 25px;
      z-index: 1;
      font-weight: bold;
      color: #eff9ff;
    }
    .kansei {
      height: 86px;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 0;
    }
  }
}

.to-main {
  height: 100vh;
  width: 100vw;
  background-color: #000;
  transition: all 0.8s ease;
  opacity: 1;
  position: absolute;
  z-index: 2001;
  top: 0;
  left: 0;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>