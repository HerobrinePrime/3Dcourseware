<script setup>
import {
  World,
  LingoEditor,
  Reflector,
  Model,
  Setup,
  OrbitCamera,
  ThirdPersonCamera,
  keyboard,
  useSpring,
  Trigger,
  Toolbar,
  Editor,
  AmbientLight,
  SvgMesh,
  Dummy,
  HTML,
  Find,
  Cube,
  useAnimation,
  Sprite,
  Cylinder,
} from "lingo3d-vue";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  registerRuntimeCompiler,
  toRaw,
  watch,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

//hooks
import { editorOn } from "../hooks/mazeHooks/basicController.js";
// import { savePoint } from "../hooks/mazeHooks/savePoint.js";
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
import { arrow } from "../hooks/arrow.js";
// import { treasureEnter,treasure1,treasure2, } from "../hooks/mazeHooks/treasure.js"//treasure hook

import emitter from "../eventBus.js";
//components
import Map from "./map.vue";
import Diamond from "../components/main/diamond.vue";
import News from "./main/news.vue";
import States from "./main/states.vue";
import Bag from "./main/bag.vue";
import Phone from "./main/phone.vue";
import Character from "./character.vue";
import Characters from "./characters.vue";
import Challenge from "./challenge/challenge.vue";

const store = useStore();
const router = useRouter();

//fov control
window.onmousewheel = (e)=>{
  if(e.wheelDelta > 0){
    if(orbitCamera.fov <= 40) return
    orbitCamera.fov -= 2
  }
  else{
    if(orbitCamera.fov >= 100) return
    orbitCamera.fov += 2
  }
}

//treasure
// #region
//y anime
const yAnime = useAnimation({
  from: 120,
  to: 160,
  repeat: Infinity,
  repeatType: "reverse",
  duration: 1500,
});
const treasureEnter = (num) => {
  if (num == 1) disappear(treasure1, num);
  else disappear(treasure2, num);
};
const disappear = (target, num) => {
  const treasure = target.value;
  treasure.onLoop = () => {
    treasure.opacity -= 0.05;
    if (treasure.opacity <= 0) {
      treasure.onLoop = undefined;
      treasure.visible = false;
      //收集到了
      getTreasure(num);
    }
  };
};
//決定事項
const getTreasure = (num) => {
  //收集回调
  console.log("got", num);
  setTimeout(() => {
    getKey(num);
  }, 1000);
};

const treasure1 = ref();
const treasure2 = ref();
// #endregion

//setup 立即验证token
store.dispatch("testToken", localStorage.getItem("token")).then(({ code }) => {
  console.log(code);
  if (code != 200) {
    console.log("需要跳转");
    router.replace({
      name: "main",
    });
  }
});

//msg triggers
const msg1 = ref()
const msg2 = ref()
const msg3 = ref()
const msg4 = ref()

//控件
const mapOn = ref(true);
const getKey = (key) => {
  store.commit("GETKEY", key);
};
const times = reactive(new Set());
const getMessage = (num) => {
  if(num == 1) msg1.value.onEnter = undefined
  if(num == 2) msg2.value.onEnter = undefined
  if(num == 3) msg3.value.onEnter = undefined
  if(num == 4) msg4.value.onEnter = undefined
  //清除times
  clearTimes();

  //手机收到消息 一共调用4次
  emitter.emit("getmessage");
  bagChange(false);
  let t1 = setTimeout(() => {
    emitter.emit("shake");
  }, 700); //等待背包打开
  let t2 = setTimeout(() => {
    emitter.emit("shake");
    console.log("t2");
  }, 2000); //等待一次shake 800
  let t3 = setTimeout(() => [bagChange(true)], 3000);

  times.add(t1);
  times.add(t2);
  times.add(t3);
};
const clearTimes = () => {
  times.forEach((t) => {
    // console.log(t);
    clearTimeout(t);
  });
  times.clear();
};

//svg arrow rotate
const svgRotate = useAnimation({
  from: 0,
  to: 360,
  duration: 800,
  repeat: Infinity,
  ease: (n) => n,
});

store.commit("SAVE", {
  /*
    x:-4652.75,
    z:-2407.21,
  */
  x: -4652.75,
  y: 100.38 + 2000,
  z: -2407.21,
});

const active = ref(true);
const bagChange = (sss) => {
  store.commit("BAGCHANGE", sss);
};
const newsOn = ref(false);
const newsChange = (value) => {
  newsOn.value = value;
};
const phoneOn = ref(false);

//#region
const interacting = ref(false);

const person = ref();
const personInnerRotationY = ref(0);
const personSpringInnerRotationY = useSpring({
  to: personInnerRotationY,
  bounce: 0,
});
const running = ref(false);
const mapOnClick = (e) => {
  if (interacting.value) return;
  console.log("mapOnClick");
  //person
  const hito = person.value;
  if (!hito) return;

  arrow.setArrow(e.point);

  hito.lookTo(e.point.x, undefined, e.point.z, 0.15);
  hito.moveTo(e.point.x, undefined, e.point.z, 10);
  emitter.emit("target", e.point);

  running.value = true;
  hito.onMoveToEnd = () => {
    running.value = false;
  };
};

const position = reactive({
  x: 3316.17,
  z: 3828.49,
});
const pos = () => {
  if (!person.value) return;
  // console.log(person.value);
  position.x = person.value.x;
  position.z = person.value.z;
};

const theTrigger = () => {
  person.value.moveTo(store.state.x, store.state.y, store.state.z, 20000);
};
//#endregion

//bus
onMounted(() => {
  //视角问题
  resetView();

  emitter.on("thebook", () => {
    bagChange(true);
    phoneOn.value = false;
    if (newsOn.value) {
      newsChange(false);
    } else {
      newsChange(true);
    }
  });
  emitter.on("thephone", () => {
    bagChange(true);
    newsChange(false);
    phoneOn.value = !phoneOn.value;
  });

  //character interaction
  emitter.on("interactionStarted", () => {
    interacting.value = true; //无法点击地图
    changeView2();
  });
  emitter.on("interactionEnded", () => {
    interacting.value = false;
    resetView();
  });
  emitter.on("lookat", ({ x, z }) => {
    const hito = person.value;
    hito.lookTo(x, undefined, z, 0.15);
    hito.moveTo(hito.x, undefined, hito.z, 100);
    store.commit("SAVE", {
      x: hito.x,
      y: 100.38 + 2000,
      z: hito.z,
    });
    // orbitCameraInstance.value.lookTo(x,undefined,z,0.5)
  });

  emitter.on("gettreasure", (num) => {
    getTreasure(num);
  });

  //failure teleport to save point
  emitter.on("failure",()=>{
    phoneOn.value = false
    theTrigger()
  })
  //success
  emitter.on("success",()=>{
    phoneOn.value = false
  })
});
onBeforeUnmount(() => {
  emitter.off("thebook");
  emitter.off("thephone");

  emitter.off("interactionStarted");
  emitter.off("interactionEnded");
  emitter.off("lookat");

  emitter.off("gettreasure");

  emitter.off("failure")
  emitter.off("success ")
});
</script>

<template>
  <World
    :logarithmicDepth="false"
    :ambientOcclusion="false"
    default-orbit-controls="false"
  >
    <Reflector
      :scale-x="1000"
      :scale-y="1000"
      :rotation-x="-90"
      :contrast="1"
      :resolution="512"
      :blur="3072"
      :mirror="1"
    />
    <Trigger
      :y="-2500"
      pad
      :radius="6000"
      targetIds="character"
      :onEnter="theTrigger"
      :interval="0"
    />
    <OrbitCamera
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
      :autoRotateSpeed="orbitCamera.autoRotateSpeed"
      :enableDamping="orbitCamera.enableDamping"
      :enableZoom="orbitCamera.enableZoom"
      :minPolarAngle="camera_springMinPolarAngle"
      :maxPolarAngle="camera_springMaxPolarAngle"
      :bokeh="orbitCamera.bokeh"
      :fov="fov"
    >
      <!-- :autoRotate="orbitCamera.autoRotate && !running" -->
      <Model
        outline
        ref="person"
        :onLoop="pos"
        name="character"
        id="character"
        physics="character"
        pbr
        :x="-4652.75"
        :y="100.38"
        :z="-2407.21"
        :width="73.41"
        :depth="84.57"
        :scale="1.75"
        :rotationY="90.0"
        :innerRotationY="personSpringInnerRotationY"
        src="/models/main/cat.fbx"
      />
    </OrbitCamera>
    <Model
      name="map"
      :x="-781.76"
      :y="472.0"
      :z="187.75"
      :width="218.2"
      :depth="218.19"
      :scale="11"
      src="/models/maze.glb"
      physics="map"
    >
      <Find name="road"  @click="mapOnClick"/>
    </Model>

    <!-- treasure -->
    <!-- 1 -->
    <Sprite
      ref="treasure1"
      :x="-2455.99"
      :y="yAnime"
      :z="1766.59"
      :width="60"
      :height="60"
      texture="/UI/defence/treasure1.png"
      @click="mapOnClick"
      bloom
      :opacityFactor="1.1"
      :opacity="1"
    />
    <Trigger
      pad
      :x="-2455.99"
      :y="20"
      :z="1766.59"
      :radius="120"
      targetIds="character"
      @enter="treasureEnter(1)"
    />
    <!-- 2 -->
    <Sprite
      ref="treasure2"
      :x="-127.66"
      :y="yAnime"
      :z="-119.60"
      :width="60"
      :height="60"
      texture="/UI/defence/treasure2.png"
      @click="mapOnClick"
      bloom
      :opacityFactor="1.1"
      :opacity="1"
    />
    <Trigger
      pad
      :x="-127.66"
      :y="20"
      :z="-119.60"
      :radius="120"
      targetIds="character"
      @enter="treasureEnter(2)"
    />

    <!-- hanashi -->
    <Character
      :x="2218.85"
      :z="3518.51"
      :rotationY="-54.00"
      :hanashi="2"
      src="pig-with-sunglass.fbx"
    />

    <Character
      :x="1932.59"
      :z="1130.64"
      :rotationY="40.44"
      :hanashi="0"
      src="rabbit-with-sunglass.glb"
    />

    <Character
      :x="-3406.15"
      :z="-3241.15"
      :rotationY="-18.99"
      :hanashi="1"
      src="rabbit-with-yellow-skin.glb"
    />

    <!-- kaiwa --><!-- theForthKey --><!-- theThirdKey -->
    <Characters
      :x1="-1371.83"
      :z1="-145.50"
      :rotationY1="183.20"
      src1="rabbit-with-wise-eyes.glb"
      :x2="-1345.66"
      :z2="-518.94"
      :rotationY2="-20.56"
      :kaiwa="0"
      src2="tigger-with-orange-skin.glb"
      :theForthKey="true"
    />

    <Characters
      :x1="624.85"
      :z1="-1167.97"
      :rotationY1="-194.74"
      src1="cat-with-orange-skin.glb"
      :x2="765.42"
      :z2="-1569.26"
      :rotationY2="-35.44"
      :kaiwa="1"
      src2="dog-with-brown-fur.glb"
    />

    <Characters
      :x1="-3382.70"
      :z1="1457.65"
      :rotationY1="-154.87"
      src1="pig-with-pink-skin.glb"
      :x2="-3597.46"
      :z2="1147.27"
      :rotationY2="42.57"
      :kaiwa="2"
      src2="dog-with-black-tail.glb"
    />

    <Characters
      :x1="180.76"
      :z1="2140.68"
      :rotationY1="-175.00"
      src1="rabbit-with-yellow-skin.glb"
      :x2="193.55"
      :z2="1778.36"
      :rotationY2="-15.59"
      :kaiwa="3"
      src2="rabbit-with-sunglass.glb"
      :theThirdKey="true"
    />

    <Characters
      :x1="-3219.04"
      :z1="-820.17"
      :rotationY1="116.32"
      src1="cat-with-orange-skin.glb"
      :x2="-2932.59"
      :z2="-940.67"
      :rotationY2="-68.86"
      :kaiwa="4"
      src2="dog-with-brown-fur.glb"
    />

    <!-- getMessage Trigger-->
    <!-- function getMessage -->
    <Trigger 
      ref="msg1"
      pad
      :x="-1729.04"
      :y="40"
      :z="-1531.72"
      targetIds="character"
      :radius="240"
      @enter="getMessage(1)"
    />

    <Trigger 
      ref="msg2"
      pad
      :x="-3909.75"
      :y="40"
      :z="669.71"
      targetIds="character"
      :radius="240"
      @enter="getMessage(2)"
    />

    <Trigger 
      ref="msg3"
      pad
      :x="-932.05"
      :y="40"
      :z="-1531.06"
      targetIds="character"
      :radius="240"
      @enter="getMessage(3)"
    />

    <Trigger 
      ref="msg4"
      pad
      :x="1719.95"
      :y="40"
      :z="1610.11"
      targetIds="character"
      :radius="240"
      @enter="getMessage(4)"
    />

    <AmbientLight />
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
    <Setup
      outlineColor="#ffffff"
      outlineHiddenColor="#db827f"
      :outlinePulse="2000"
      defaultLight="env/sunset_fairway_4k.hdr"
      :defaultLightScale="1"
      :exposure="0.5"
      skybox="env/env1.hdr"
      defaultFog="#000000"
      :bloom="bloom"
      :bloomStrength="1.1"
      :bloomRadius="0.2"
    />
    <LingoEditor v-if="editorOn" />
  </World>

  <Map :position="position" v-show="mapOn" />
  <!-- 阴影 -->
  <div class="front top"></div>
  <div class="front bottom"></div>

  <!-- news -->
  <News :newsOn="newsOn" :newsChange="newsChange" />
  <!-- 按钮 -->
  <a
    class="button"
    :class="{ '-off': !active }"
    href="javascript:void(0);"
    @click="active = !active"
  >
    <!-- <button @click.stop="exitIntersect">exit</button> -->
    <span></span>
  </a>
  <States :active="active" />
  <!-- bag -->
  <Bag />
  <Phone :phoneOn="phoneOn" />
  <!-- <button class="test" @click="bagChange(!store.state.bag.bagOn)" style="position:absolute;right:0;top:80px;color:#fff;">Bag</button> -->

  <!-- Challenge -->
  <Challenge />

  <button
    class="test"
    @click="mapOn = !mapOn"
    style="position: absolute; right: 0; top: 120px; color: #fff"
  >
    Map
  </button>
  <!-- <button
    class="test"
    @click="getKey(1)"
    style="position: absolute; right: 0; top: 160px; color: #fff"
  >
    GetKey1
  </button>
  <button
    class="test"
    @click="getKey(2)"
    style="position: absolute; right: 70px; top: 160px; color: #fff"
  >
    GetKey2
  </button>
  <button
    class="test"
    @click="getKey(3)"
    style="position: absolute; right: 0; top: 200px; color: #fff"
  >
    GetKey3
  </button>
  <button
    class="test"
    @click="getKey(4)"
    style="position: absolute; right: 70px; top: 200px; color: #fff"
  >
    GetKey4
  </button>
  <button
    class="test"
    @click="emitter.emit('shake')"
    style="position: absolute; right: 0; top: 240px; color: #fff"
  >
    shake
  </button> -->
  <button
    class="test"
    @click="editorOn = !editorOn"
    style="position: absolute; right: 0; top: 150px; color: #fff"
  >
    editorOn
  </button>
  <button
    class="test"
    @click="getMessage"
    style="position: absolute; right: 0; top: 180px; color: #fff"
  >
    getMessage
  </button>

  <div style="position: absolute; z-index: -1; left: -50px">
    <img src="/UI/defence/treasure1.png" />
    <img src="/UI/defence/treasure2.png" />
    <img src="/UI/defence/treasure3.png" />
    <img src="/UI/defence/treasure4.png" />
  </div>
</template>

<style lang="less" scoped>
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
  z-index: 50;
  transition: 0.7s ease 0s;
  span {
    display: block;
    width: 41%;
    height: 4%;
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
    height: 4%;
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
</style>