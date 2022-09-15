<template>
  <div class="main" @mousewheel.stop="" v-loading="loading">
    <div class="back-banner">
      <i class="iconfont icon-xiangzuo1" @click="back"></i>
    </div>
    <AboutView :list="rankList"/>
    <!-- <div class="wrapper">
      <div
        class="stu"
        v-for="(person, index) in rankList"
        :key="person.student_id"
        :class="{
          self: person.self,
          grand: index < 3,
        }"
      >
        {{ person.name }}: {{ person.grade }}
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "@vue/runtime-core";
import emitter from "../eventBus";
import { request } from "../request";

import AboutView from "./AboutView.vue"

const rankList = ref([]);

const loading = ref(true)

onMounted(async () => {
  const res = await request({
    url: "/student/getRankList",
    method: "POST",
  });
  if (res.data.code == 200) {
    // if (res.data.data.length > 10 ){
        rankList.value = res.data.data.slice(0,10)
        loading.value = false
    // }
    // else{
    //     rankList.value = [...res.data.data];
    // }
  }
});

const back = () => {
  emitter.emit("rankOff");
};
</script>

<style lang="less" scoped>
.main {
  color: #fff;
  // height: 90%;
  // width: 90%;
  height: 720px;
  width: 1400px;
  // background-color: rgba(240, 248, 255, 0.683);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  // border-radius: 15px;
  // padding: 20px;
  .wrapper {
    display: flex;
    flex-direction: column;
  }
  .back-banner {
    position: absolute;
    z-index: 1000;
    left: 30px;
    top: 47px;
    color: #000;
    cursor: pointer;
    margin-bottom: 10px;
    .iconfont {
      font-size: 25px;
    }
  }
  .stu {
    line-height: 7vh;
    height: 7vh;
    padding-left: 20px;
    font-family: "xknlt";
    font-size: 30px;
    margin: 0 40px 1vh;
  }
  .self {
    background-color: rgba(0, 255, 255, 0.493) !important;
  }
  .grand {
    background-color: rgba(242, 255, 0, 0.586);
  }
}
</style>