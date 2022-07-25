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
            <img src="/UI/selectpanel/3.png" />
          </div>
          <div class="select-item" @click="select(4)" :class="{ lock: lock }">
            <img src="/UI/selectpanel/4.png" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { Transition, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import emitter from "../eventBus";

const router = useRouter();

const selectPanelOn = defineProps(["selectPanelOn"]);
const select = (num) => {
  if (lock.value) return;
  console.log(num);
  //2 3 4
  if (num === 2) return router.push({ name: "" });
  if (num === 3) return router.push({ name: "" });
  if (num === 4) return router.push({ name: "" });
};

const lock = ref(true);
onMounted(() => {
  emitter.on("unlock", () => {
    lock.value = false;
  });
});
onBeforeUnmount(() => {
  emitter.off("unlock");
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
        .select-item {
          width: 100%;
          height: 60.8%;
          &:nth-of-type(2) {
            height: 37.8%;
          }
        }
      }
    }
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