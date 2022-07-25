<template>
  <div class="states" :class="{ 'panel-off': active }">
    <ul>
      <li class="state">
        <img :src="stuInfo.portrait" style="border-radius: 50%" />
        <div class="content">{{ stuInfo.name }}</div>
      </li>
      <li class="state" style="">
        <img src="/UI/icon2.webp" />
        <div class="content">学习进度:&nbsp;&nbsp;{{ stuInfo.process }}%</div>
      </li>
      <li class="state" style="">
        <img src="/UI/icon3.webp" />
        <div class="content">学习天数:&nbsp;&nbsp;{{ stuInfo.days }}</div>
      </li>
      <li class="state" style="">
        <img src="/UI/icon4.webp" />
        <div class="content">班级:&nbsp;&nbsp;{{ stuInfo.class }}</div>
      </li>
    </ul>
  </div>
</template>

<script >
import { computed, watch } from "vue";
import { useStore } from "vuex";

export default {
  props: ["active"],
  setup(props) {
    const store = useStore();

    const stuInfo = computed(() => {
      return store.state.student;
    });
    
    

    return {
      stuInfo,
      
    };
  },
};
</script>

<style lang="less" scoped>
@panel-back-color:rgba(65, 59, 117, 0.7);
@panel-box-shadow:rgba(137, 131, 193, 0.617);
@login-btn-color: rgba(32, 32, 32, 0.72);
@font-color:rgb(209, 209, 209);
@del: 0.2s;
.states {
  position: absolute;
  z-index: 49;
  background-color: @panel-back-color;
  box-shadow: 0px 5px 5px @panel-box-shadow;
  transition: all 0.7s ease 0s;

  height: 5vw;
  width: 70vw;
  top: 7vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 2.5vw;
  // display: flex;
  overflow: hidden;
  // text-align: center;
  ul {
    height: 100%;
    width: 70vw;
    // transition: all 0.7s ease 0s;
    .state {
      // width: 25%;
      color: @font-color;
      height: 100%;
      line-height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.1vw;
      position: relative;
      float: left;
      // padding: 0 1.5vw;
      img {
        display: block;
        height: 45%;
        margin-right: 1vw;
      }
      // .content {
      // }
      &:nth-of-type(1) {
        width: 20%;
        font-size: 1.5vw;
        img {
          height: 3.25vw;
          width: 3.25vw;
          margin-right: 2.5vw;
          margin-left: 2.5vw;
        }
      }
      &:nth-of-type(2) {
        width: 30%;
      }
      &:nth-of-type(3) {
        width: 20%;
      }
      &:nth-of-type(4) {
        width: 30%;
      }
    }
  }
}
.panel-off {
  width: 0 !important;
  // ul{
  //   transform: translateX(-35vw);
  // }
}
//小屏
@media (max-width: 768px) {
  .states {
    height: 40vh;
    width: 50vw;
    ul {
      display: flex;
      flex-direction: column;
      height: 40vh;
      .state {
        font-size: 16px !important;
        height: 10vh;
        display: flex;
        justify-content: left;
        align-items: center;
        width: 100% !important;
        img {
          height: 4.5vh !important;
          width: 4.5vh !important;
          margin-left: 5% !important;
          margin-right: 6% !important;
        }
        .content {
          // display: none;
        }
      }
    }
  }
  .panel-off {
    height: 0 !important;
    width: 50vw !important;
  }
}
</style>