<template>
  <div class="states" :class="{ 'panel-off': active ,'hidden': hidden}"  @mousewheel.stop="" @mouseleave="setumeiOff">
    <teleport to='body'>
      <Transition name="el-fade-in-linear">
        <Setumei v-if="setumeiPanelOn" :akashi="akashi"  @mousewheel.stop="" @mouseleave="setumeiOff"/>
      </Transition>
    </teleport>
    <div class="button">
      <img src="/UI/bag/btn.png" @click="btnClicked" @mouseleave="setumeiOff">
    </div>
    <!-- <button @click="bag.thebook">book</button>
    <button @click="bag.thephone">phone</button>
    <div class="item" :class="{'has-item':keys.has(1)}"></div> -->
    <div class="items" @click="bag.thebook" @mouseleave="setumeiOff" @mouseenter="setumeiOff">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item has-item">
        <!-- <img src="/UI/bag/book.png" @mouseover="setumeiOn('/UI/bag/book.png')" @mouseleave="setumeiOff"/> -->
        <img src="/UI/bag/book.png"/>
      </div>
    </div>
    <div class="items" @click="bag.thephone" @mouseleave="setumeiOff" @mouseenter="setumeiOff">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item has-item" :class="{'shake':shaking}">
        <!-- <img src="/UI/bag/book.png" @mouseover="setumeiOn('/UI/bag/book.png')" @mouseleave="setumeiOff"/> -->
        <img src="/UI/bag/phone.png"/>
      </div>
    </div>

    <div class="items">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item " :class="{'has-item':keyItem > 0}" @mouseover="setumeiOn(treasureArray[0])" @mouseleave="setumeiOff">
        <img :src="treasureArray[0]" v-if="treasureArray[0]"/>
      </div>
    </div>
    <div class="items">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item " :class="{'has-item':keyItem > 1}" @mouseover="setumeiOn(treasureArray[1])" @mouseleave="setumeiOff">
        <img :src="treasureArray[1]" v-if="treasureArray[1]"/>
      </div>
    </div>
    <div class="items">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item " :class="{'has-item':keyItem > 2}" @mouseover="setumeiOn(treasureArray[2])" @mouseleave="setumeiOff">
        <img :src="treasureArray[2]" v-if="treasureArray[2]"/>
      </div>
    </div>
    <div class="items">
      <img class="item-bc" src="/UI/bag/item-bc.png" />
      <div class="item " :class="{'has-item':keyItem > 3}" @mouseover="setumeiOn(treasureArray[3])" @mouseleave="setumeiOff">
        <img :src="treasureArray[3]" v-if="treasureArray[3]"/>
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

    <div class="awa" :class="{'awa-on':true,'awa-off':awaOff}" @click="dialog">
      <img src="/UI/bag/awa.png">
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
  Transition,
  onBeforeUnmount,
} from "vue";
import Setumei from '../Setumei.vue'
import { useStore } from "vuex";
import emitter from "../../eventBus.js";

export default {
  props:['hidden'],
  components:['Transition','Setumei'],
  setup(props) {
    const store = useStore();
    const stuInfo = computed(() => {
      return store.state.student;
    });

    const setumeiPanelOn = ref(false)
    let timer = undefined
    const akashi = ref('')
    const setumeiOn = (sign)=>{
      if(!sign) return
      timer = setTimeout(()=>{
        setumeiPanelOn.value = true
      },500)
      //sign
      akashi.value = sign
    }
    const setumeiOff = ()=>{
      setumeiPanelOn.value = false
      clearTimeout(timer)
    }

    const active = computed(() => {
      return store.state.bag.bagOn;
    });
    watch(active, (newValue) => {
      console.log(newValue,"asdf");
    });
    
    const treasureArray = reactive([])
    const keys = store.state.bag.keys;
    const keyItem = ref(0)
    watch(keys, (newValue,oldValue) => {
      console.log("keyDec");
      if (active.value) {
        console.log("unDisplaying");
        store.commit("BAGCHANGE", false);
        setTimeout(()=>{
          //计数，以数量控制has-item样式
          keyItem.value = newValue.size
          //遍历Set,为了找到新加的那一个key
          newValue.forEach((ele,index)=>{
            //数组中没它 == -1 要push
            if(treasureArray.indexOf(`/UI/defence/treasure${ele}.png`) == -1){
              treasureArray.push(`/UI/defence/treasure${ele}.png`)
            }
          })
          console.log(treasureArray);

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
    const awaOff = ref(true)
    const dialog = ()=>{
      awaOff.value = true
      setTimeout(()=>{
        emitter.emit('awa-bag')
      },500)
    }

    //事件总线
    onMounted(() => {
      emitter.on('shake',()=>{
        shaking.value = true
        setTimeout(()=>{shaking.value= false},800)
      })
      emitter.on('awaOff',(off)=>{
        awaOff.value = true
        setTimeout(()=>{
          awaOff.value = off
        },300)
      })

      emitter.on('setumeiOff',()=>{
        console.log("store -> emit setumeiOff");
        setumeiOff()
      })
    });
    onBeforeUnmount(()=>{
      emitter.off('shake')
      emitter.off('awaOff')
      emitter.off('setumeiOff')
    })

    let btnTimer = {}
    const btnClicked = ()=>{
        clearTimeout(btnTimer)
        // awaOff.value = true
        if(active.value){
          btnTimer = setTimeout(()=>{
            store.commit('BAGCHANGE',true)
          },4500)
        }
        store.commit('BAGCHANGE',!active.value)
      }

    return {
      store,
      stuInfo,
      active,
      bag,
      shaking,
      keys,
      keyItem,
      treasureArray,
      setumeiPanelOn,
      setumeiOn,
      setumeiOff,
      akashi,
      btnClicked,
      awaOff,
      dialog,
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
  .awa{
    // height: 10vh;
    width: 20vh;
    position: absolute;
    // background-color: aqua;
    left: -20vh;
    top: 5vh;
    cursor: pointer;
    img{
      transform: scaleX(-1);
    }
    transform: scale3d(1,0,1);
  }
  .awa-on{
    animation: rub1 0.5s ease forwards;
  }
  .awa-off{
    animation: rub2 0.5s ease forwards;
  }
  @keyframes rub1 {
    0% {
        -webkit-transform: scale3d(1,0,1);
        transform: scale3d(1,0,1);
    }

    30% {
        -webkit-transform: scale3d(1.25, 0.75, 1);
        transform: scale3d(1.25, 0.75, 1);
    }
    40% {
        -webkit-transform: scale3d(0.75, 1.25, 1);
        transform: scale3d(0.75, 1.25, 1);
    }
    50% {
        -webkit-transform: scale3d(1.15, 0.85, 1);
        transform: scale3d(1.15, 0.85, 1);
    }
    65% {
        -webkit-transform: scale3d(0.95, 1.05, 1);
        transform: scale3d(0.95, 1.05, 1);
    }
    75% {
        -webkit-transform: scale3d(1.05, 0.95, 1);
        transform: scale3d(1.05, 0.95, 1);
    }
    100% {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
  }
  @keyframes rub2 {
    0% {
      -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
    30% {
        -webkit-transform: scale3d(1.05, 0.95, 1);
        transform: scale3d(1.05, 0.95, 1);
    }
    40% {
      -webkit-transform: scale3d(0.95, 1.05, 1);
        transform: scale3d(0.95, 1.05, 1);
    }
    50% {
        -webkit-transform: scale3d(1.15, 0.85, 1);
        transform: scale3d(1.15, 0.85, 1);
    }
    65% {
        -webkit-transform: scale3d(0.75, 1.25, 1);
        transform: scale3d(0.75, 1.25, 1);
    }
    75% {
        -webkit-transform: scale3d(1.25, 0.75, 1);
        transform: scale3d(1.25, 0.75, 1);
    }
    100% {
        -webkit-transform: scale3d(1,0,1);
        transform: scale3d(1,0,1);
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