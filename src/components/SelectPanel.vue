<template>
  <Transition>
    <div class="panel-wrapper" v-if="selectPanelOn.selectPanelOn">
      <div class="panel">
        <div class="select">
          <div class="select-item" @click="emitter.emit('selectOff')">
            <img src="/UI/selectpanel/1.png" />
          </div>
          <div class="select-item" @click="select(2)" :class="{ lock: lock }">
            <img src="/UI/selectpanel/2.png" />
          </div>
        </div>
        <div class="select">
          <div class="select-item" @click="select(3)" :class="{ lock: lock }">
            <img class="cup" src="/UI/selectpanel/cup.png">
            <div class="text">排行榜</div>
            <img src="/UI/selectpanel/3.png" />
          </div>
          <div class="select-item" @click="select(4)" :class="{ lock: lock }">
            <img src="/UI/selectpanel/4.png" />
          </div>
        </div>
      </div>

      <!-- Challenge -->
      <Challenge :model="1" />

      <!-- Sudent -->
      <!-- <transition name="el-fade-in">
        <Student v-show="studentOn"/>
      </transition> -->

      <Transition name="ss">
        <!-- <div class="student" :class="{studentShow:studentOn}"> -->
        <div class="student" v-if="studentOn">
          <Student :id="store.state.student.student_id"/>
        </div>
      </Transition>

      <Transition name="rank">
        <div class="rank" v-if="rankOn">
          <Rank />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { Transition, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import emitter from "../eventBus";

import Challenge from "./challenge/challenge.vue";
import Student from "./Student.vue";
import Rank from "./Rank.vue";

const router = useRouter();

const store = useStore();

const studentOn = ref(false);

const rankOn = ref(false);

const selectPanelOn = defineProps(["selectPanelOn"]);
const select = (num) => {
  if (lock.value) return;
  console.log(num);
  //2 3 4
  if (num === 2) {
    emitter.emit("challenge");
    return;
  }
  if (num === 4) {
    studentOn.value = true;
  }
  if (num === 3) {
    rankOn.value = true;
  }
};

const lock = ref(false);
onMounted(() => {
  emitter.on("unlock", () => {
    lock.value = false;
  });

  emitter.on("studentOff", () => {
    studentOn.value = false;
  });
  emitter.on("rankOff", () => {
    rankOn.value = false;
  });
});
onBeforeUnmount(() => {
  emitter.off("unlock");
  emitter.off("studentOff");
  emitter.off("rankOff");
});
</script>

<style lang="less" scoped>
.panel-wrapper {
  position: absolute;
  z-index: 125;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.181);
  transition: opacity 1.2s ease;
  .panel {
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 400px;
    width: 900px;
    // background-color: aliceblue;
    display: flex;
    justify-content: space-between;
    .select {
      height: 100%;
      width: 71.4%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      //   background-color: antiquewhite;

      .select-item {
        position: relative;
        width: 48.5%;
        height: 95.7%;
        // background-color: rgba(65, 59, 117, 0.7);
        border-radius: 30px;
        // box-shadow: 0px 1px 3px 1px rgb(137 131 193 / 50%);
        transition: 0.2s ease;
        cursor: pointer;
        .cup{
          position: absolute;
          top: 0;
          z-index: 1;
          height: 40%;
          top: 28%;
          // bottom: 0;
          margin: auto;
          left: 27%;
        }
        .text{
          color:#fefefe;
          position: absolute;
          z-index: 3;
          font-family: 'xknlt';
          font-size: 30px;
          bottom: 15%;
          left: 28%;
        }
        &::after {
          content: " ";
          position: absolute;
          //   background-color: rgba(65, 59, 117, 0.7);
          //   border-radius: 50px;
          height: 100%;
          width: 100%;
          transition: 1.4s ease;
        }
        &:hover {
          //   background-color: rgba(134, 127, 195, 0.7);
        }
        img {
          display: block;
          position: absolute;
          height: 100%;
          z-index: 0;
        }
      }
      .lock {
        filter: brightness(0.6);
        cursor: default;
        &::after {
          //   background-color: rgba(0, 0, 0, 0.292);
        }
        &:hover {
          //   background-color: rgba(65, 59, 117, 0.7);
        }
      }
      &:nth-of-type(2) {
        width: 27%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // justify-content: center;

        .select-item {
          width: 100%;
          height: 60.8%;
          // height: 37.8%;
          &:nth-of-type(2) {
            height: 37.8%;
          }
        }
      }
    }
  }
  .student {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
    transition: all 0.5s ease;
    overflow: auto;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 100;
  }
  .studentShow {
    opacity: 1;
  }
  .ss-enter-from,
  .ss-leave-to {
    opacity: 0;
  }
  .ss-enter-to,
  .ss-leave-from {
    opacity: 1;
  }
  .rank {
    height: 100vh;
    width: 100vw;
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 1;
    transition: all 0.5s ease;
  }
  .rank-enter-from,
  .rank-leave-to {
    opacity: 0;
  }
  .rank-enter-to,
  .rank-leave-from {
    opacity: 1;
  }
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