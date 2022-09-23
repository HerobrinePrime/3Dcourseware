<script setup>
//#region
import {
  Editor,
  World,
  Cube,
  Camera,
  Keyboard,
  ThirdPersonCamera,
  Model,
  useSpring,
  SvgMesh,
  Setup,
  Reflector,
  AmbientLight,
  PointLight,
  usePreload,
  Find,
  OrbitCamera,
  HTML,
  LingoEditor,
  keyboard,
  Trigger,
  SkyLight,
  Skybox,
  Sprite,
  useAnimation,
} from "lingo3d-vue";
import {
  computed,
  reactive,
  ref,
  watch,
  Transition,
  watchEffect,
  nextTick,
  toRaw,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useRouter } from "vue-router";
//#endregion

//components
import Diamond from "../components/main/diamond.vue";
import States from "./main/states.vue";
import Bag from "./main/bag.vue";
import News from "./main/news.vue";
import Phone from "./main/phone.vue";
import Screen from "./Screen.vue";
import SelectPanel from "./SelectPanel.vue";

import Characters from "./episode/characters.vue";

//element-plus
// import {} from "element-plus";

import { ElCollapseTransition } from "element-plus";

//hooks
//#region
import {
  cameraActive,
  thirdPersonCameraActive,
  mouseControl,
  bloom,
  lingoEditor,
} from "../hooks/basicController";
import { arrow } from "../hooks/arrow.js";

import {
  orbitCamera,
  orbitCameraInstance,
  changeView,
  changeView2,
  resetView,
  camera_springInnerX,
  camera_springInnerY,
  camera_springInnerZ,
  camera_springInnerRotationX,
  camera_springMinPolarAngle,
  camera_springMaxPolarAngle,
  fov,
} from "../hooks/camera.js";

import {
  characterOutline,
  characterOver,
  characterspringInnerRotationY,
  characterinnerRotationY,
  characterspringInnerY,
  characterinnerY,
  characterX,
  characterY,
  characterZ,
} from "../hooks/character.js";

import { changeScene } from "../hooks/sceneController.js";
import { useStore, mapState } from "vuex";
import emitter from "../eventBus.js";
//#endregion

//fov control
window.onmousewheel = (e) => {
  if (e.wheelDelta > 0) {
    if (orbitCamera.fov <= 40) return;
    orbitCamera.fov -= 2;
  } else {
    if (orbitCamera.fov >= 100) return;
    orbitCamera.fov += 2;
  }
};

console.log(mapState(["student"]));

console.log(Trigger);


//route
const router = useRouter();
const toMaze = () => {
  router.replace({
    name: "maze",
  });
};

//vuex
const store = useStore();
const bigHidden = ref(true);
const bagChange = (sss) => {
  store.commit("BAGCHANGE", sss);
};

//a top-banner按钮
const active = ref(true);
const phoneOn = ref(false);
const newsOn = ref(false);
const newsChange = (value) => {
  newsOn.value = value;
};

const svgRotate = useAnimation({
  from: 0,
  to: 360,
  duration: 800,
  repeat: Infinity,
  ease: (n) => n,
});

//地图逻辑
//#region
const person = ref();
const running = ref(false);

const interacting = ref(false)

const mapOnClick = (e) => {
    if(interacting.value) return
  console.log("mapOnClick");
  //person
  const hito = person.value;
  if (!hito) return;

  arrow.setArrow(e.point);

  hito.lookTo(e.point.x, undefined, e.point.z, 0.15);
  hito.moveTo(e.point.x, undefined, e.point.z, 10);

  running.value = true;
  hito.onMoveToEnd = () => {
    running.value = false;
  };
};

const newsActivate = () => {
  newsOn.value = true;
};

const spriteWidth = ref(0);
const springSpriteWidth = useSpring({
  to: spriteWidth,
  bounce: 0,
  duration: 1200,
});

const newsDisActivate = () => {
  setTimeout(() => {
    newsOn.value = false;
  }, 500);
};


const onTheTriggerEnter = () => {
  console.log("fallen");
  const hito = person.value;

  hito.moveTo(store.state.x, store.state.y, store.state.z, 10000);
};
//#endregion

//screens
const screens = [
  "/UI/screen/1.png",
  "/UI/screen/2.png",
  "/UI/screen/3.png",
];
const screenOn = ref(false);
const screenOnInStatus = () => {
  screenOn.value = true;
};

//spriteClick
const theSprite = ref();
const porterTrigger = ref();
const bright = ref(false);
const fade = ref(false);
const spriteClick = (e) => {
  const hito = person.value;
  hito.moveTo(e.point.x, undefined, e.point.z, 10);
  hito.lookTo(e.point.x, undefined, e.point.z, 0.15);

  // hito.onMoveToEnd = Maze
};

const Maze = () => {
  changeView();
  const sprite = theSprite.value;
  bright.value = true;
  sprite.onLoop = () => {
    sprite.scale += 0.3;
    sprite.width += 0.3;
    if (sprite.scale >= 30) {
      sprite.onLoop = undefined;
      fade.value = true;
      setTimeout(() => {
        // toMaze();
        endNotePanelOn.value = true
      }, 2500);
    }
  };
};

//characters
//#region 
const done = ref(0)

//#endregion

const endNotePanelOn = ref(false)

const doneNum = ref(2)
const doneOn = ref(false)
const donePanelOn = ()=>{
  if(done.value == 3) return
  doneNum.value = 2
  setTimeout(() => {
    doneOn.value = true
  }, 1000);
}

//bag事件总线
//#region
onMounted(() => {
  emitter.on("challengeDone",()=>{
    //挑战完成
    setTimeout(() => {
      toMaze()
    }, 800);
  })
  emitter.on("noteOFf",()=>{
    endNotePanelOn.value = false
    console.log("challenge");
    // endSS.value = true
    setTimeout(() => {
      emitter.emit("challenge");
    }, 800);
  })

  emitter.on('doneOff',()=>{
    doneOn.value = false
  })

  resetView()
  // loginEnd.value = true
  if (localStorage.getItem("token")) {
    store.dispatch("testToken");
  }

  emitter.on("*", () => {
    // console.log("******");
    bagChange(true);
  });
  emitter.on("thebook", () => {
    phoneOn.value = false;
    if (newsOn.value) {
      newsDisActivate();
    } else {
      newsActivate();
    }
  });
  emitter.on("thephone", () => {
    newsDisActivate();
    phoneOn.value = !phoneOn.value;
  });
  emitter.on("screenOff", () => {
    screenOn.value = false;
    setTimeout(() => {
      active.value = false;
    }, 1200);
  });

  emitter.on("interactionStarted", () => {
    interacting.value = true; //无法点击地图
    changeView2();
  });
  emitter.on("interactionEnded", () => {
    console.log("interactionEnded");
    interacting.value = false;
    resetView();
    donePanelOn()
  });
  emitter.on("lookat", ({ x, z }) => {
    const hito = person.value;
    hito.lookTo(x, undefined, z, 0.15);
    hito.moveTo(hito.x, undefined, hito.z, 100);
  });

  emitter.on("done",()=>{
    done.value++
    if(done.value === 3){

      rewardOn.value = true
      reward.value = 2
      store.commit('REWARD',2)
      setTimeout(() => {
        rewardOn.value = false
      }, 2500);

      const hito = person.value
      hito.onLoop = ()=>{
        hito.lookTo(0,undefined,0,0.15)
      }
      orbitCameraInstance.value.lookTo(-38.41,undefined,-166.32,0.5)
      orbitCamera.innerRotationX = -20
      setTimeout(()=>{
        spriteWidth.value = 40
      },400)

      const sprite = theSprite.value
      sprite.onClick = spriteClick

      const portertrigger = porterTrigger.value
      portertrigger.onEnter = Maze
    }
  })

  emitter.on("midStart", () => {
    setTimeout(() => {
      // screenOn.value = true;  
    }, 1500);
    setTimeout(() => {
      active.value = false
      processPanel.value = true
      setTimeout(() => {
        processPanel.value = false
        active.value = true 
      }, 4000);
    }, 2000);
  });

  emitter.on("screenOff", () => {
    
    screenOn.value = false;
    setTimeout(() => {
      active.value = false;
      
    }, 1200);
    // setTimeout(() => {
    //   router.replace({name:'main'})
    // }, 1000);
  });
});
onBeforeUnmount(() => {
  emitter.off("challengeDone")
  emitter.off("noteOFf")
  emitter.off('doneOff')
  emitter.off("*");
  emitter.off("thebook");
  emitter.off("thephone");
  emitter.off("screenOff");

  emitter.off("interactionStarted")
  emitter.off("interactionEnded")
  emitter.off("lookat")

  emitter.off("done")
  emitter.off('midStart')
});
//#endregion

const editor = ref(false);

const processPanel = ref(false)

const rewardOn = ref(false)
const reward = ref(-1)
</script>
    
    <template>
  <div class="world" :class="{ fade: fade }">
    <World
      color="transparent"
      ref="world"
      :logarithmicDepth="true"
      :ambientOcclusion="true"
      default-orbit-controls="false"
    >

    <Characters
      :x1="-662.39"
      :z1="-350.98"
      :rotationY1="503.20"
      src1="rabbit-with-wise-eyes.glb"
      :x2="-506.81"
      :z2="-661.52"
      :rotationY2="-20.56"
      src2="dog-with-black-tail.glb"
      :context="0"
      :mapClick="mapOnClick"
    />

    <Characters
      :x1="430.07"
      :z1="714.37"
      :rotationY1="603.20"
      src1="dog-with-brown-fur.glb"
      :x2="135.34"
      :z2="722.15"
      :rotationY2="109.44"
      src2="cat-with-orange-skin.glb"
      :context="1"
      :mapClick="mapOnClick"
    />

    <Characters
      :x1="702.55"
      :z1="-322.56"
      :rotationY1="328.80"
      src1="rabbit-with-sunglass.glb"
      :x2="685.21"
      :z2="-12.50"
      :rotationY2="208.56"
      src2="black-dog.glb"
      :context="2"
      :mapClick="mapOnClick"
    />

      <!-- orbitcamera -->
      <OrbitCamera
        :fov="fov"
        active
        ref="orbitCameraInstance"
        :x="orbitCamera.x"
        :y="orbitCamera.y"
        :z="orbitCamera.z"
        :rotationX="orbitCamera.rotationX"
        :rotationY="orbitCamera.rotationY"
        :rotationZ="orbitCamera.rotationZ"
        :innerX="camera_springInnerX"
        :innerY="camera_springInnerY"
        :innerZ="camera_springInnerZ"
        :innerRotationX="camera_springInnerRotationX"
        :autoRotate="false"
        :enableDamping="orbitCamera.enableDamping"
        :enableZoom="orbitCamera.enableZoom"
        :minPolarAngle="camera_springMinPolarAngle"
        :maxPolarAngle="camera_springMaxPolarAngle"
        :bokeh="orbitCamera.bokeh"
      >
        <!-- :autoRotate="orbitCamera.autoRotate && !running" -->
        <!-- character -->
        <!--           @mouse-over="characterOver(true)"
          @mouse-out="characterOver(false)" -->
        <Model
          src="/models/main/cat.fbx"
          :outline="characterOutline"
          :y="-578.22"
          :scale="1.9"
          :innerY="characterspringInnerY"
          :innerRotationY="characterspringInnerRotationY"

          ref="person"
          physics="character"
          :metalnessFactor="0"
          :roughnessFactor="1"
          :environmentFactor="0"
          toon
          id="character"
        >
          <HTML>
            <!-- <transition name="el-fade-in-linear">
                  <div class="news" v-show="newsOn"></div>
                </transition> -->
          </HTML>
        </Model>
      </OrbitCamera>

      <!-- map -->
      <!-- src="/models/main/SCEEN-final.fbx" -->
      <Model
        src="/models/mid/screen.glb"
        :scale="10"
        physics="map"
        toon
        :y="-827.09"
        id="map"
        name="map"
        :metalnessFactor="0"
      >
        <Find name="ground" @click="mapOnClick"></Find>
      </Model>

      <!-- the - trigger -->
      <Trigger
        targetIds="character"
        pad
        :radius="2500"
        :interval="0"
        :y="-2500"
        :onEnter="onTheTriggerEnter"
      />

      <!-- porter Trigger -->
      <Trigger
        ref="porterTrigger"
        targetIds="character"
        :radius="200.0"
        :interval="300"
        :y="-641.55"
        pad
        :onEnter="undefined"
      />
      <Sprite
        ref="theSprite"
        bloom
        :opacity="1"
        :x="-0"
        :y="-363.67"
        :z="0"
        :height="60.00"
        :scale="10.5"
        :onClick="undefined"
        :width="springSpriteWidth"
        :animationPaused="true"
        texture="/UI/porter2.png"
      />

      <!-- others -->
      <!-- <Keyboard @key-down="keyDown" /> -->
      <SvgMesh
        v-if="running"
        bloom
        toon
        :metalnessFactor="1"
        :roughnessFactor="0.4"
        :width="72.99"
        :height="100"
        :depth="100"
        :scaleX="-0.82"
        :scaleZ="0.19"
        src="/svg/arrow.svg"
        color="#ff4e4e"
        :x="arrow.x"
        :y="arrow.y + 150"
        :z="arrow.z"
        :rotationY="svgRotate"
      />
      <Reflector
        :y="-1325.1"
        :scale="2130.2"
        :rotationX="-90"
        :contrast="1"
        :resolution="512"
        :blur="0"
        :mirror="1"
      />
      <Setup
        outlineColor="#ffffff"
        outlineHiddenColor="#db827f"
        :outlinePulse="2000"
        defaultLight="default"
        :defaultLightScale="1"
        :exposure="0.7"
        skybox="/env/env1.hdr"
        defaultFog="#000000"
        :bloom="bloom"
        :bloomStrength="1.1"
        :bloomRadius="0.2"
      />
      <!-- <LingoEditor v-if="true" /> -->
      <LingoEditor v-if="editor" />
    </World>
  </div>

  <Screen :screens="screen" :screenOn="startScreenOn" />

  <a
    class="button"
    :class="{ '-off': !active }"
    href="javascript:void(0);"
    @click="active = !active"
    :style="{ top: true ? '1.5vh' : '5vh', opacity: true ? '1' : '0' }"
  >
    <span></span>
  </a>

  <!-- <button
    class="test"
    @click="editor = !editor"
    style="position: absolute; right: 0; top: 160px; color: #fff"
  >
    editorOn
  </button>
  <button
    class="test"
    @click="Maze"
    style="position: absolute; right: 0; top: 130px; color: #fff"
  >
  Maze
  </button> -->

  <!-- 学生信息 -->
  <States :active="active" :screenOnInStatus="screenOnInStatus" />
  <!-- bag -->
  <Bag :hidden="false" />

  <!-- news -->
  <News :newsOn="newsOn" :newsChange="newsChange" />
  <!-- phone -->
  <Phone :phoneOn="phoneOn" />

  <!-- Screen -->
  <Screen :screens="screens" :screenOn="screenOn" />

  <!-- Process -->
  <transition name="p">
    <Process v-if="processPanel" :process='2'/>
  </transition>

  <!-- Reward -->
  <transition name="r">
    <Reward v-if="rewardOn" :reward="reward"  key="1"/>
  </transition>

  <!-- Done -->
  <transition name="r">
    <Done v-if="doneOn" :doneNum="doneNum" :doneCount="done"/>
  </transition>

    <!-- endNotePanelOn NotePanel -->
    <transition name="p">
    <NotePanel v-if="endNotePanelOn" :endCount="2"/>
  </transition>

  <!-- Challenge -->
  <Challenge  :exe="true"/>

</template>


    
    <style lang="less" scoped>
@panel-back-color:rgba(65, 59, 117, 0.7);
@panel-box-shadow:rgba(137, 131, 193, 0.617);
@login-btn-color: rgba(32, 32, 32, 0.72);
@font-color:rgb(209, 209, 209);
@del: 0.2s;

// @font-face {
//   font-family: hwhp;
//   src: url('fonts/hwhp.ttf');
// }

.load-box {
  height: 160px;
  width: 160px;
  position: absolute;
  z-index: 5;
  right: 0;
  top: -127px;
  left: 0;
  bottom: 0;
  margin: auto;
  .msg {
    opacity: 0;
    height: 80px;
    width: 200px;
    position: absolute;
    bottom: -80px;
    left: -20px;
    font-size: 24px;
    text-align: center;
    line-height: 80px;
    color: #6b5099;
    transition: opacity 0.5s ease;
  }
  .icon {
    height: 130px;
    width: 130px;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    // background-color: aqua;
    border-radius: 50%;
    div {
      position: absolute;
      height: 100%;
      width: 100%;
      span {
        display: block;
        position: absolute;
      }
    }
    .success {
      opacity: 0;
      transition: opacity 1.2s ease;
      span {
        background-color: #5ec1ef;
      }
      .left {
        height: 7px;
        width: 50px;
        border-radius: 3.5px;
        transform: rotate(45deg) translate(65px, 44px);
      }
      .right {
        height: 7px;
        width: 84px;
        border-radius: 3.5px;
        transform: rotate(311deg) translate(-23px, 73px);
      }
    }
    .failure {
      opacity: 0;
      transition: opacity 1.2s ease;
      span {
        background-color: #b03333;
      }
      .left {
        height: 7px;
        width: 100px;
        border-radius: 3.5px;
        transform: rotate(45deg) translate(57px, 34px);
      }
      .right {
        height: 7px;
        width: 100px;
        border-radius: 3.5px;
        transform: rotate(315deg) translate(-33px, 57px);
      }
    }
  }
  svg {
    position: absolute;
    overflow: hidden;
    backface-visibility: hidden;
    circle {
      overflow: hidden;
      transition: all 0.2s ease;
      fill: none;
      stroke: #6b5099;
      stroke-miterlimit: 10;
      stroke-width: 2px;
      backface-visibility: hidden;
      transition: stroke 1.1s ease;
    }
  }
  .base {
    opacity: 0.5;
  }
  .loader {
    animation: load 1s linear 0s infinite;
    opacity: 1;
    stroke-dasharray: 140;
    stroke-dashoffset: 100;
    animation-fill-mode: both;
    transition: stroke-dasharray 0.8s ease;
  }
  @keyframes load {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}

.result-box {
  .loader {
    stroke-dasharray: 226;
  }
  .msg {
    opacity: 1;
  }
}

.success {
  svg {
    circle {
      stroke: #49a7d2;
    }
  }
  .msg {
    color: #5ec1ef;
  }
  .icon {
    .success {
      opacity: 1;
    }
    .failure {
      opacity: 0;
    }
  }
}

.failure {
  svg {
    circle {
      stroke: #b03333;
    }
  }
  .msg {
    color: #b03333;
  }
  .icon {
    .success {
      opacity: 0;
    }
    .failure {
      opacity: 1;
    }
  }
}

.world {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
}
.front {
  position: absolute;
  // background-color: rgba(0, 0, 0, 0.299);
  height: 0;
  width: 100vw;
  box-shadow: 2px 2px 18vh 9vh rgb(0 0 0);
  z-index: 30;
}
.top {
  top: 0;
}
.bright {
  transition: 0.3s ease-out;
  box-shadow: 2px 2px 18vh 9vh #fff;
}
.fade {
  transition: 1.2s ease 1s;
  filter: brightness(0);
}
.bottom {
  bottom: 0;
}
.button {
  display: block;
  position: absolute;
  right: 3vw;
  top: 1.5vh;
  background: #fff;
  width: 50px;
  height: 50px;
  // margin: 10px;
  border-radius: 50%;
  overflow: hidden;
  z-index: 1000;
  transition: 0.7s ease 0s;
  span {
    display: block;
    width: 41%;
    height: 3%;
    background: #000;
    right: 23%;
    top: 50%;
    transform: translate(0, -50%);
    position: absolute;
    transition: all 0.5s ease 0s;
  }
  &::before {
    content: "";
    display: block;
    height: 3%;
    width: 55%;
    background: #000;
    position: absolute;
    left: 50%;
    top: 36%;
    transform: translate(-50%, -50%);
    transition: all 0.5s ease 0s;
  }
  &::after {
    content: "";
    display: block;
    height: 3%;
    width: 55%;
    background: #000;
    position: absolute;
    left: 50%;
    bottom: 36%;
    transform: translate(-50%, 50%);
    transition: all 0.5s ease 0s;
  }
}
.-off {
  span {
    width: 0;
  }
  &::before {
    height: 3%;
    transform: rotate(-30deg) translate(-50%, -50%);
  }
  &::after {
    transform: rotate(30deg) translate(-50%, 50%);
  }
}

// news

.panel {
  position: absolute;
  height: 100vh;
  width: 100vw;
  // background-color: rgba(0, 0, 0, 0.202);
  z-index: 25;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  transition: 0.5s cubic-bezier(0.02, 0.59, 0.35, 0.96);
  overflow: hidden;
}

.login-panel {
  display: block;
  padding-top: 50vh;
  .login-wapper {
    height: 500px;
    width: 425px;
    transition: 0.6s ease;
    overflow: hidden;
    border-radius: 15px;
    position: relative;
    /* top: 180px; */
    /* bottom: 0; */
    top: 0;
    margin: 0 auto;
    opacity: 0.9;
    box-shadow: 0px 1px 1px 1px rgb(137 131 193 / 50%);
    transform: translate(0, -250px);
    .login {
      display: flex;
      flex-direction: column;
      height: 500px;
      width: 425px;
      position: relative;
      background-color: rgba(59, 53, 92, 1);
      box-shadow: 0px 5px 5px @panel-box-shadow;
      border-radius: 15px;
      color: @font-color;
      transition: 0.6s ease;
      overflow: hidden;
      .options-line {
        padding: 45px 0 0 43px;
        margin-bottom: 30px;
        display: flex;
        align-items: flex-end;
        // height: 20px;
        .options {
          color: @font-color;
          font-size: 17px;
          display: inline-block;
          height: 20px;
          line-height: 20px;
          margin-right: 35px;
          cursor: pointer;
        }
        .option-active {
          position: relative;
          font-size: 20px;
          span {
            &::after {
              content: "";
              position: absolute;
              height: 4px;
              width: 70px;
              border-radius: 2.5px;
              background-color: @font-color;
              bottom: -14px;
              right: 0;
              left: 0;
              margin: 0 auto;
            }
          }
        }
      }
      .line {
        position: relative;
        text-align: center;
        input {
          padding-left: 86px;
        }
        img {
          display: block;
          position: absolute;
          height: 29px;
          top: 0;
          bottom: 0;
          margin: auto 0 auto 95px;
        }
        .text {
          height: 41px;
          width: 300px;
          outline: none;
          border: 1px solid rgb(202, 198, 204);
          background-color: transparent;
          border-radius: 20.1px;
          font-size: 16px;
          color: @font-color;
        }
      }
      .other-line {
        position: relative;
        margin: 0 auto;
        width: 280px;
        display: flex;
        justify-content: space-between;
        .col {
          display: flex;
          align-items: center;
          height: 16px;
          font-size: 14px;
          color: rgb(108, 105, 121);
          cursor: pointer;
          span {
          }
          &:hover span {
            text-decoration: underline;
          }
        }
      }
    }
  }
  .panel-down1 {
    // opacity: 0;
    box-shadow: none;
    height: 0;
    .login {
      // transform: translateX(-212.5px);
    }
  }
  .login-btn {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    height: 57px;
    width: 300px;
    border-radius: 5vh;
    background-color: #52318b;
    color: #d1d1d1;
    font-size: 20px;
    line-height: 57px;
    top: 300px;
    transition: 0.1s ease;
    overflow: hidden;
    box-shadow: 0px 4px 5px 2px rgb(0 0 0 / 20%);
    span {
      display: inline-block;
      min-width: 300px;
      transition: 0.6s ease;
    }
  }
  .panel-down2 {
    // opacity: 0vw;
    height: 0;
    box-shadow: none;
    span {
      // transform: translateX(-150px);
    }
  }
}
.sign-on-1 {
  transform: translate(-100vw);
}

.sign-panel {
  transform: translate(100vw);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 620px;
  width: 425px;
  background-color: #3b355c;
  box-shadow: 5px 5px 5px rgb(137 131 193 / 50%);
  border-radius: 15px;
  color: #d1d1d1;
  transition: 0.6s ease;
  overflow: hidden;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  .sign {
    display: flex;
    height: 40px;
    width: 300px;

    /* 均匀排列每个元素，为每个元素分配相同空间 */
    justify-content: space-around;
    /* 让元素从竖着排列变为横着排列 */
    flex-direction: column;
    /* 让其居中 */
    align-items: center;
    margin-right: 150px;

    /* 当元素之间重叠的时候，z-index 较大的元素会覆盖较小的元素在上层进行显示。例如2会在1上面显示 */
    /* z-index: 1; */
    .options-line {
      padding: 45px 0 0 43px;
      margin-bottom: 30px;
      display: flex;
      align-items: flex-end;
      .options {
        color: #d1d1d1;
        font-size: 17px;
        display: inline-block;
        height: 20px;
        line-height: 20px;
        margin-right: 35px;
        cursor: pointer;
      }
      .option-active {
        position: relative;
        font-size: 20px;
        span {
          &::after {
            content: "";
            position: absolute;
            height: 4px;
            width: 70px;
            border-radius: 2.5px;
            background-color: #d1d1d1;
            bottom: -14px;
            right: 0;
            left: 0;
            margin: 0 auto;
          }
        }
      }
    }
  }

  form {
    width: 380px;
    height: 520px;
    display: flex;
    justify-content: space-around;
    /* 让元素从竖着排列变为横着排列 */
    flex-direction: column;
    /* 让其居中 */
    align-items: center;

    /* 图片 */
    .pic {
      .select-portrait {
        width: 380px;
        height: 100px;
        display: flex;
        /* 均匀排列每个元素，为每个元素分配相同空间 */
        justify-content: center;

        /* 让其居中 */
        align-items: center;

        a {
          position: absolute;
          z-index: 10;
          display: block;
          height: 70px;
          width: 70px;

          input {
            position: absolute;
            display: inline-block;
            height: 70px;
            width: 70px;
            opacity: 0;

            z-index: 2;
            cursor: pointer;
          }
          img {
            display: block;
            position: absolute;
            height: 70px;
            width: 70px;
            z-index: 1;
            border-radius: 50%;
            overflow: hidden;
          }
          .camera {
            position: absolute;
            z-index: 1;
            height: 20px;
            width: 20px;
            right: 0px;
            bottom: 0px;
            border-radius: 0;
          }
        }
      }
    }

    .inputBasic {
      height: 41px;
      width: 300px;
      display: flex;
      /* 均匀排列每个元素，为每个元素分配相同空间 */
      justify-content: center;
      /* 让元素从竖着排列变为横着排列 */
      flex-direction: clone;
      /* 让其居中 */
      align-items: center;
    }

    input {
      display: flex;
      /* 均匀排列每个元素，为每个元素分配相同空间 */
      justify-content: center;
      /* 让元素从竖着排列变为横着排列 */
      align-items: center;

      width: 144px;
      height: 41px;
      font-size: 10px;
      margin: 0px 6px;
      padding: 0 20px;

      color: #d1d1d1;
      background-color: #3b355c;

      border: solid;
      border-radius: 20px;
      border-color: #cac6cc;
      border-width: 1px;

      outline: none;

      text-align: center;
    }

    .inputBox {
      height: 41px;
      width: 300px;
      font-size: 10px;

      margin: 15px 0 0 0;
      border-radius: 20px;
      border: 1px solid #cac6cc;

      background-color: #3b355c;

      letter-spacing: 2px;
      padding: 0 20px;
      color: #d1d1d1;

      /* text-align: center; */
    }

    p {
      position: relative;
      z-index: 9;
      height: 41px;
      width: 300px;

      text-decoration: none;

      margin: 0 0 -10px;

      a {
        text-decoration: none;
        color: #6c6979;
        font-size: 5px;

        padding-left: 10px;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .registBox {
      position: relative;
      z-index: 8;
      width: 300px;
      height: 57px;
    }
  }
  .registBox {
    position: absolute;
    bottom: 30px;
    width: 300px;
    height: 57px;
    display: flex;
    /* 均匀排列每个元素，为每个元素分配相同空间 */
    justify-content: space-around;
    /* 让元素从竖着排列变为横着排列 */
    flex-direction: clone;
    /* 让其居中 */
    align-items: center;

    /* 设置位置 */
    margin: 0 0 0 0;

    /* 设置字体 */
    font-size: 20px;
    color: #d1d1d1;
    letter-spacing: 2px;

    /* 设置边框 */
    border-radius: 30px;
    border: none;
    background-color: #52318b;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  }
}
.sign-on-2 {
  transform: translate(0);
}
//大屏
@media (min-width: 1201px) {
}
//中屏
@media (min-width: 769px) and (max-width: 1200px) {
}
//小屏
@media (max-width: 768px) {
}

.p-enter-active,

.p-leave-active{
  transition: all 0.8s linear;
}
.p-enter-from,
.p-leave-to{
    opacity: 0;
}
.p-leave-from,
.p-enter-to{
    opacity: 1;
}

.r-enter-active,
.r-leave-active{
  transition: all 0.8s cubic-bezier(.87,-0.28,.13,1.27);
}
.r-enter-from,
.r-leave-to{
    // top: 100vh;
    transform: translate(0, 100vh);
}
.r-leave-from,
.r-enter-to{
    // top: 0;
    transform: translate(0, 0vh);
}
</style>