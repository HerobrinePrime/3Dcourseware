<template>
  <div class="states" :class="{ 'panel-off': active ,'hidden': hidden}" >
    <div class="button">
      <img src="/UI/bag/btn.png" @click="store.commit('BAGCHANGE',!active)">
    </div>
    <!-- <button @click="bag.thebook">book</button>
    <button @click="bag.thephone">phone</button>
    <div class="item" :class="{'has-item':keys.has(1)}"></div> -->
    <div class="items" @click="bag.thebook">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item has-item">
        <img src="/UI/bag/book.png" />
      </div>
    </div>
    <div class="items" @click="bag.thephone">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item has-item" :class="{'shake':shaking}">
        <img src="/UI/bag/phone.png" />
      </div>
    </div>
    <div class="items">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item " :class="{'has-item':keyItem > 0}">
        <img src="/UI/bag/book.png" />
      </div>
    </div>
    <div class="items">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item " :class="{'has-item':keyItem > 1}">
        <img src="/UI/bag/book.png" />
      </div>
    </div>
    <div class="items">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item " :class="{'has-item':keyItem > 2}">
        <img src="/UI/bag/book.png" />
      </div>
    </div>
    <div class="items">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item " :class="{'has-item':keyItem > 3}">
        <img src="/UI/bag/book.png" />
      </div>
    </div>
    <div class="items">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item ">
        <img src="/UI/bag/book.png" />
      </div>
    </div>
    <div class="items">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item ">
        <img src="/UI/bag/book.png" />
      </div>
    </div>
  </div>
</template>

<script >
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch,
  TransitionGroup,
  onBeforeUnmount,
} from "vue";
import { useStore } from "vuex";
import emitter from "../../eventBus.js";

export default {
  props:['hidden'],
  setup(props) {
    const store = useStore();
    const stuInfo = computed(() => {
      return store.state.student;
    });

    const active = computed(() => {
      return store.state.bag.bagOn;
    });
    watch(active, (newValue) => {
      console.log(newValue,"asdf");
    });
    
    const keys = store.state.bag.keys;
    const keyItem = ref(0)
    watch(keys, (newValue) => {
      console.log("keyDec");
      if (active.value) {
        console.log("unDisplaying");
        store.commit("BAGCHANGE", false);
        setTimeout(()=>{
          keyItem.value = newValue.size
        },1000)
        setTimeout(() => {
          store.commit("BAGCHANGE", true);
        }, 2400);
      } else {
        keyItem.value = newValue.size
      }
    });

    const bag = reactive({
      //bagOn ==> *
      thebook: () => {
        emitter.emit("thebook");
      },
      thephone: () => {
        emitter.emit("thephone");
      },
    });

    const shaking = ref(false)

    //事件总线
    onMounted(() => {
      emitter.on('shake',()=>{
        shaking.value = true
        setTimeout(()=>{shaking.value= false},800)
      })
    });
    onBeforeUnmount(()=>{
      emitter.off('shake')
    })

    return {
      store,
      stuInfo,
      active,
      bag,
      shaking,
      keys,
      keyItem,
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
  border-radius: 3vh;
  position: absolute;
  z-index: 101;
  background-color: @panel-back-color;
  box-shadow: 0px 5px 5px @panel-box-shadow;
  transition: all 0.7s ease 0s;
  height: 70vh;
  width: 25vh;
  right: 0vw;
  top: 0;
  bottom: 0;
  margin: auto 0;
  // overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  // align-items: center;
  justify-content: center;
  align-content: center;
  .items {
    margin: 2.5vh 1vh;
    position: relative;
    height: 10vh;
    width: 10vh;
    
    .item-bc {
      position: absolute;
      display: block;
      height: 100%;
      width: 100%;
      z-index: 0;
    }
    .item {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
      z-index: 1;
      opacity: 0;
      height: 100%;
      width: 100%;
      // background-color: antiquewhite;
      transition: opacity 0.4s ease;
      img {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        height: 70%;
        width: 70%;
      }
    }
    .has-item {
      opacity: 1;
      cursor: pointer;
    }
    .shake{
      animation: shake 0.8s ease;
    }
    @keyframes shake{
      0%,100%{
        transform: rotate(0deg);
      }
      10%,30%,50%,70%,90%{
        transform: rotate(-10deg);
      }
      20%,40%,60%,80%{
        transform: rotate(10deg);
      }
    }
  }
  .button{
    height: 20vh;
    width: 3vh;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: -2.4vh;
    img{
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 100%;
      cursor: pointer;
    }
  }
}
.panel-off {
  transform: translate(25vh);
  // width: 0 !important;
  // ul{
  //   transform: translateX(-35vw);
  // }
}
.hidden{
  transform: translate(28vh);
}
</style>