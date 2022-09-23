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
  Transition,
  watch,
  watchEffect,
  defineProps,
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
  changeView3,
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
import Screen from "./Screen.vue";
import Report from "./Report.vue";

import { ElMessage } from "element-plus";

import { throttle } from "lodash";

//endingControl
const endScreen = [
  "/UI/screen/end/0.png",
  "/UI/screen/end/1.png",
  "/UI/screen/end/2.png",
  "/UI/screen/end/3.png",
];
const screenOn = ref(false);

//startControll
const startScreen = [
  "/UI/screen/start/0.png",
  "/UI/screen/start/1.png",
  "/UI/screen/start/2.png",
  "/UI/screen/start/3.png",
  "/UI/screen/start/4.png",
  "/UI/screen/start/5.png",
];
const startScreenOn = ref(false);
const screenOnInStatus = () => {
  startScreenOn.value = true;
};

const store = useStore();
const router = useRouter();

//fov control
window.onmousewheel = (e) => {
  if (wheelBan) return;

  if (e.wheelDelta > 0) {
    if (orbitCamera.fov <= 40) return;
    orbitCamera.fov -= 2;
  } else {
    if (orbitCamera.fov >= 100) return;
    orbitCamera.fov += 2;
  }
};

//treasure
// #region
//y anime
const yAnime = useAnimation({
  from: 120,
  to: 140,
  repeat: Infinity,
  repeatType: "reverse",
  duration: 1300,
});
const charYAnime = useAnimation({
  from: 220,
  to: 260,
  repeat: Infinity,
  repeatType: "reverse",
  duration: 1500,
});
const treasureEnter = (num) => {
  // store.dispatch("setProcess");
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
  donePanelOn(3)

  // ElMessage.success("获得锦囊");
  store.commit("treasures");
  store.dispatch("setProcess", 19 + store.state.datas.treasures);
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

//challenge triggers
// #region
const challenge1 = ref();
const challenge2 = ref();
const challenge3 = ref();

const dog1 = ref();
const dog2 = ref();
const dog3 = ref();

//challenge count
const challengeCount = ref(0);
// const useChallengeCount = ref(0);
watch(challengeCount, (newValue) => {
  store.dispatch("setProcess", 12 + challengeCount.value);
  if (newValue == 3) {
    challengeDone.value = true;
  }
});

const warningOn = ref(false);
//challenge trigger enter
const getChallenge = (num) => {
  interacting.value = true;

  //stop
  const hito = person.value;
  // hito.lookTo(e.point.x, undefined, e.point.z, 0.15);
  hito.moveTo(hito.x, undefined, hito.z, 100);

  // warning
  warningOn.value = true;

  setTimeout(() => {
    warningOn.value = false;
    emitter.emit("challenge");
  }, 3000);
  setTimeout(() => {
    interacting.value = false;
  }, 3100);
};
// #endregion

//msg triggers
const messageCount = ref(0);
watch(messageCount, (num) => {
  store.dispatch("setProcess", 15 + messageCount.value);
  if (num == 4) {
    messageDone.value = true;
  }
});

const msg1 = ref();
const msg2 = ref();
const msg3 = ref();
const msg4 = ref();

const messageSprite1 = ref();
const messageSprite2 = ref();
const messageSprite3 = ref();
const messageSprite4 = ref();

//控件
const mapOn = ref(true);
const getKey = (key) => {
  store.commit("GETKEY", key);
};
const times = reactive(new Set());
const getMessage = (num) => {
  let sprite = {};
  if (num == 1) {
    sprite = messageSprite1.value;
    msg1.value.onEnter = undefined;
  }
  if (num == 2) {
    sprite = messageSprite2.value;
    msg2.value.onEnter = undefined;
  }
  if (num == 3) {
    sprite = messageSprite3.value;
    msg3.value.onEnter = undefined;
  }
  if (num == 4) {
    sprite = messageSprite4.value;
    msg4.value.onEnter = undefined;
  }
  sprite.onLoop = () => {
    sprite.opacity -= 0.03;
    if (sprite.opacity <= 0) sprite.onLoop = undefined;
  };

  //清除times
  clearTimes();

  //手机收到消息 一共调用4次
  emitter.emit("getmessage");

  emitter.emit("awaOff", false);

  // //打开背包
  // bagChange(false);
  // //1shake
  // let t1 = setTimeout(() => {
  //   emitter.emit("shake");
  // }, 700); //等待背包打开
  // //2shake
  // let t2 = setTimeout(() => {
  //   emitter.emit("shake");
  //   console.log("t2");
  // }, 2000); //等待一次shake 800
  // //关闭背包
  // let t3 = setTimeout(() => bagChange(true), 3000);
  // times.add(t1);
  // times.add(t2);
  // times.add(t3);
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

const dream = ref(false);

//end controll
const challengeDone = ref(false);
const messageDone = ref(false);
watchEffect(() => {
  console.log("challengeDone", challengeDone.value);
  console.log("messageDone", messageDone.value);
  
  if (challengeDone.value && messageDone.value) {
    console.log("pass");
    setTimeout(() => {
      screenOn.value = true;
    }, 1000);
  }
});

watchEffect(()=>{
  if(store.state.datas.news == 4 && store.state.datas.npcs == 8 && store.state.datas.treasures == 4){
    // console.log("-----------------------------");
    // console.log("3");
    // console.log("-----------------------------");
    rewardOn.value = true
    reward.value = 3
    store.commit('REWARD',3)
    setTimeout(() => {
      rewardOn.value = false
    }, 2500);
  }
})

//propaganda
// #region
const onPanel = ref(0);
let last = 75;
let wheelBan = false;
let zoomIning = false;
const mouseEnterPanel = (num) => {
  if (wheelBan) return;
  wheelBan = true;
  setTimeout(() => {
    zoomIning = true;
  }, 0);
  // console.log(num);
  onPanel.value = num;
  // changeView2()
  // changeView()
  changeView3();
  last = orbitCamera.fov;
  orbitCamera.fov = 30;
};
const mouseLeavePanel = () => {
  wheelBan = false;
  setTimeout(() => {
    zoomIning = false;
  });

  onPanel.value = 0;
  resetView();
  orbitCamera.fov = last;
};
const oooo = (event) => {
  if (zoomIning) {
    mouseLeavePanel();
  } else {
    return;
  }
  // mouseLeavePanel()
};
// #endregion

const doneNum = ref(-1)
const doneOn = ref(false)
const donePanelOn = (num)=>{
  doneNum.value = num
 setTimeout(() => {
  // if(activatedNews.size == 4) return
  doneOn.value = true
 }, 1000);
}


//bus
onMounted(() => {
  //视角问题
  resetView();

  emitter.on('doneOff',()=>{
    doneOn.value = false
  })

  emitter.on("mazeStart", () => {
    setTimeout(() => {
      startScreenOn.value = true;
    }, 1500);
  });

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
  emitter.on("failure", () => {
    messageCount.value++;
    phoneOn.value = false;
    theTrigger();
    ElMessage.warning("防范失败");
  });
  //success
  emitter.on("success", () => {
    messageCount.value++;
    phoneOn.value = false;
    // ElMessage.success("防范成功");
    donePanelOn(4)
  });

  //challenge
  emitter.on("challengeDone", (pass) => {
    store.commit("challenges");

    if (pass) {
      // ElMessage.success("挑战成功");
      donePanelOn(5)
      challengeCount.value++;
      //移除狗
      //清除狗回调
      let dog = {};
      if (challengeCount.value == 1) {
        challenge1.value.onEnter = undefined;
        dog = dog1.value;
      }
      if (challengeCount.value == 2) {
        challenge2.value.onEnter = undefined;
        dog = dog2.value;
      }
      if (challengeCount.value == 3) {
        challenge3.value.onEnter = undefined;
        dog = dog3.value;

        // rewardOn.value = true
        // store.dispatch('REWARD',4)
        // reward.value = 4
        // setTimeout(() => {
        //   rewardOn.value = false
        // }, 2500);
      }
      dog.outline = false;
      dog.opacityFactor = 0;
    } else {
      //回到保存点
      theTrigger();
      ElMessage.warning("挑战失败");
    }
  });

  emitter.on("screenOff", (end) => {
    if (end) {
      screenOn.value = false;
      setTimeout(() => {
        //梦醒
        dream.value = true;
      }, 1000);
      return;
    }

    startScreenOn.value = false;
    setTimeout(() => {
      active.value = false;
      processPanel.value = true
      setTimeout(() => {
        processPanel.value = false
        active.value = true
      }, 4000);
    }, 1200);
    // setTimeout(() => {
    //   router.replace({name:'main'})
    // }, 1000);
  });

  emitter.on("awa-bag", () => {
    //打开背包
    bagChange(false);
    //1shake
    let t1 = setTimeout(() => {
      emitter.emit("shake");
    }, 700); //等待背包打开
    //2shake
    let t2 = setTimeout(() => {
      emitter.emit("shake");
      console.log("t2");
    }, 2000); //等待一次shake 800
    //关闭背包
    let t3 = setTimeout(() => bagChange(true), 3000);
    times.add(t1);
    times.add(t2);
    times.add(t3);
  });
});
onBeforeUnmount(() => {
  emitter.off("doneOff")

  emitter.off("mazeStart");
  emitter.off("thebook");
  emitter.off("thephone");

  emitter.off("interactionStarted");
  emitter.off("interactionEnded");
  emitter.off("lookat");

  emitter.off("gettreasure");

  emitter.off("failure");
  emitter.off("success ");

  emitter.off("challengeDone");

  emitter.off("screenOff");

  emitter.off("awa-bag");
});

const chect = ()=>{
  setTimeout(() => {
      screenOn.value = true;
    }, 1000);
}

const processPanel = ref(false)

const rewardOn = ref(false)
const reward = ref(-1)


</script>

<template>
  <World
    :logarithmicDepth="false"
    :ambientOcclusion="false"
    default-orbit-controls="false"
    @click="oooo"
  >
    <!-- <Reflector
      :scale-x="1000"
      :scale-y="1000"
      :rotation-x="-90"
      :contrast="1"
      :resolution="256"
      :blur="1024"
      :mirror="1.2"
    /> -->
    <Reflector
      :scale-x="1000"
      :scale-y="1000"
      :rotation-x="-90"
      :contrast="1"
      :resolution="256"
      :blur="1842.0"
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
      <Find name="road" @click="mapOnClick" />

      <!-- find panel for propaganda-->
      <Find name="panel2" outline @click="mouseEnterPanel(2)">
        <HTML>
          <div
            class="propaganda"
            v-if="onPanel == 2"
            style="
              transform: translateX(120px) translateY(-140px);
              -webkit-transform: translateX(120px) translateY(-140px);
              -ms-transform: translateX(120px) translateY(-140px);
              -moz-transform: translateX(120px) translateY(-140px);
            "
          >
            游戏里说有免费的皮肤可以领取,随后让你先扫码、再解冻的,统统都是骗局!
          </div>
        </HTML>
      </Find>
      <Find name="panel3" outline @click="mouseEnterPanel(3)">
        <HTML>
          <div
            class="propaganda"
            v-if="onPanel == 3"
            style="
              transform: translateX(120px) translateY(-100px);
              -ms-transform: translateX(120px) translateY(-100px);
              -moz-transform: translateX(120px) translateY(-100px);
              -webkit-transform: translateX(120px) translateY(-100px);
            "
          >
            警惕网络陌生人,不贪小便宜,不点来历不明的链接
          </div>
        </HTML>
      </Find>

      <Find name="panel4" outline @click="mouseEnterPanel(4)">
        <HTML>
          <div
            class="propaganda"
            v-if="onPanel == 4"
            style="
              transform: translateX(120px) translateY(-100px);
              -ms-transform: translateX(120px) translateY(-100px);
              -moz-transform: translateX(120px) translateY(-100px);
              -webkit-transform: translateX(120px) translateY(-100px);
            "
          >
            切记千万不要盲目追星,反而给了骗子可趁之机！
          </div>
        </HTML>
      </Find>

      <Find name="panel5" outline @click="mouseEnterPanel(5)">
        <HTML>
          <div
            class="propaganda"
            v-if="onPanel == 5"
            style="
              transform: translateX(120px) translateY(-170px);
              -ms-transform: translateX(120px) translateY(-170px);
              -moz-transform: translateX(120px) translateY(-170px);
              -webkit-transform: translateX(120px) translateY(-170px);
            "
          >
            不要轻信社交媒体上与钱财交易有关的信息,第一时间核实亲友身份,避免轻易转账。
          </div>
        </HTML>
      </Find>
    </Model>

    <!-- treasure -->
    <!-- #region -->
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
      :z="-119.6"
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
      :z="-119.6"
      :radius="120"
      targetIds="character"
      @enter="treasureEnter(2)"
    />
    <!-- #endregion -->

    <!-- hanashi -->
    <!-- #region -->
    <Sprite
      v-if="true"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :x="2218.85"
      :z="3518.51"
      :y="charYAnime"
      texture="/UI/hints/person_hint.png"
    />
    <Character
      :x="2218.85"
      :z="3518.51"
      :rotationY="-54.0"
      :hanashi="2"
      src="pig-with-sunglass.fbx"
    />

    <Sprite
      v-if="true"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="charYAnime"
      :x="1932.59"
      :z="1130.64"
      texture="/UI/hints/person_hint.png"
    />
    <Character
      :x="1932.59"
      :z="1130.64"
      :rotationY="40.44"
      :hanashi="0"
      src="rabbit-with-sunglass.glb"
    />

    <Sprite
      v-if="true"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="charYAnime"
      :x="-3406.15"
      :z="-3241.15"
      texture="/UI/hints/person_hint.png"
    />
    <Character
      :x="-3406.15"
      :z="-3241.15"
      :rotationY="-18.99"
      :hanashi="1"
      src="rabbit-with-yellow-skin.glb"
    />

    <!-- kaiwa --><!-- theForthKey --><!-- theThirdKey -->
    <Sprite
      v-if="true"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="charYAnime"
      :x="-1345.66"
      :z="-518.94"
      texture="/UI/hints/person_hint.png"
    />
    <Characters
      :x1="-1371.83"
      :z1="-145.5"
      :rotationY1="183.2"
      src1="rabbit-with-wise-eyes.glb"
      :x2="-1345.66"
      :z2="-518.94"
      :rotationY2="-20.56"
      :kaiwa="0"
      src2="tigger-with-orange-skin.glb"
      :theForthKey="true"
    />

    <Sprite
      v-if="true"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="charYAnime"
      :x="624.85"
      :z="-1167.97"
      texture="/UI/hints/person_hint.png"
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

    <Sprite
      v-if="true"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="charYAnime"
      :x="-3597.46"
      :z="1147.27"
      texture="/UI/hints/person_hint.png"
    />
    <Characters
      :x1="-3382.7"
      :z1="1457.65"
      :rotationY1="-154.87"
      src1="pig-with-pink-skin.glb"
      :x2="-3597.46"
      :z2="1147.27"
      :rotationY2="42.57"
      :kaiwa="2"
      src2="dog-with-black-tail.glb"
    />

    <Sprite
      v-if="true"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="charYAnime"
      :x="193.55"
      :z="1778.36"
      texture="/UI/hints/person_hint.png"
    />
    <Characters
      :x1="180.76"
      :z1="2140.68"
      :rotationY1="-175.0"
      src1="rabbit-with-yellow-skin.glb"
      :x2="193.55"
      :z2="1778.36"
      :rotationY2="-15.59"
      :kaiwa="3"
      src2="rabbit-with-sunglass.glb"
      :theThirdKey="true"
    />

    <Sprite
      v-if="true"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="charYAnime"
      :x="-2932.59"
      :z="-940.67"
      texture="/UI/hints/person_hint.png"
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
    <!-- #endregion -->

    <!-- getMessage Trigger-->
    <!-- #region -->
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
    <Sprite
      ref="messageSprite1"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="yAnime"
      :x="-1729.04"
      :z="-1531.72"
      texture="/UI/hints/hito_hint.png"
      :scale="0.5"
      @click="mapOnClick"
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
    <Sprite
      ref="messageSprite2"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="yAnime"
      :x="-3909.75"
      :z="669.71"
      texture="/UI/hints/hito_hint.png"
      :scale="0.5"
      @click="mapOnClick"
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
    <Sprite
      ref="messageSprite3"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="yAnime"
      :x="-932.05"
      :z="-1531.06"
      texture="/UI/hints/hito_hint.png"
      :scale="0.5"
      @click="mapOnClick"
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
    <Sprite
      ref="messageSprite4"
      bloom
      :opacity-factor="1.1"
      adjust-emissive-color="#000000"
      adjust-color="#ffffff"
      :y="yAnime"
      :x="1719.95"
      :z="1610.11"
      texture="/UI/hints/hito_hint.png"
      :scale="0.5"
      @click="mapOnClick"
    />
    <!-- #endregion -->

    <!-- challenge triggers -->
    <!-- #region -->
    <Trigger
      ref="challenge1"
      pad
      :x="-2594.53"
      :y="40"
      :z="2721.25"
      targetIds="character"
      :radius="240"
      @enter="getChallenge(1)"
    />
    <Model
      @click="mapOnClick"
      outline
      ref="dog1"
      pbr
      :x="-2322.18"
      :y="100.38"
      :z="2726.14"
      :width="73.41"
      :depth="84.57"
      :scale="1.75"
      :rotationY="-90.0"
      src="/models/characters/black-dog.glb"
    />

    <Trigger
      ref="challenge2"
      pad
      :x="-669.32"
      :y="40"
      :z="506.86"
      targetIds="character"
      :radius="240"
      @enter="getChallenge(2)"
    />
    <Model
      @click="mapOnClick"
      outline
      ref="dog2"
      pbr
      :x="-903.83"
      :y="100.38"
      :z="404.06"
      :width="73.41"
      :depth="84.57"
      :scale="1.75"
      :rotationY="57.0"
      src="/models/characters/black-dog.glb"
    />

    <Trigger
      ref="challenge3"
      pad
      :x="3319.48"
      :y="40"
      :z="3603.91"
      targetIds="character"
      :radius="240"
      @enter="getChallenge(3)"
    />
    <Model
      @click="mapOnClick"
      outline
      ref="dog3"
      pbr
      :x="3319.48"
      :y="100.38"
      :z="3753.28"
      :width="73.41"
      :depth="84.57"
      :scale="1.75"
      :rotationY="180"
      src="/models/characters/black-dog.glb"
    />
    <!-- #endregion -->

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
    <!-- skybox="env/env1.hdr" -->
    <!-- skybox="env/sunset_fairway_4k.hdr" -->
    <!-- circus_maximus_1_4k.hdr -->
    <!-- abandoned_tank_farm_04_4k.hdr -->

    <!-- !je_gray_park_4k.hdr -->

    <!-- alps_field_4k.hdr -->

    <!-- dreifaltigkeitsberg_4k.hdr -->
    <!-- kloppenheim_01_4k.hdr -->
    <!-- bluesky.hdr -->

    <!-- outlinePattern="models/pattern.jpeg" -->
    <Setup
      outlineColor="#ffffff"
      outlineHiddenColor="#db827f"
      :outlinePulse="2000"
      defaultLight="env/bluesky.hdr"
      :defaultLightScale="0.8"
      :exposure="0.65"
      skybox="env/bluesky.hdr"
      defaultFog="#000000"
      :bloom="bloom"
      :bloomStrength="1.1"
      :bloomRadius="0.2"
    />
    <!-- :defaultLightScale="0.80"
      :exposure="0.6" -->
    <LingoEditor v-if="editorOn" />
  </World>

  <Transition name="dream">
    <div class="dream" v-show="dream"></div>
  </Transition>

  <Map :position="position" v-show="mapOn" />
  <!-- 阴影 -->
  <!-- <div class="front top"></div>
  <div class="front bottom"></div> -->

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
  <States :active="active" :screenOnInStatus="screenOnInStatus" />
  <!-- bag -->
  <Bag />
  <Phone :phoneOn="phoneOn" />
  <!-- <button class="test" @click="bagChange(!store.state.bag.bagOn)" style="position:absolute;right:0;top:80px;color:#fff;">Bag</button> -->

  <!-- Challenge -->
  <Challenge />

  <!-- Screen -->
  <Screen :screens="endScreen" :screenOn="screenOn" :ending="true" />

  <!-- StartScreen -->
  <Screen :screens="startScreen" :screenOn="startScreenOn" />

  <!-- Warning -->
  <div class="warning" :class="{ warningOn: warningOn }" v-show="warningOn">
    <img src="/UI/hints/warning.jpg" />
  </div>

  <!-- Report -->

  <Report v-if="dream" />

  <!-- <button
    class="test"
    @click="resetView"
    style="position: absolute; right: 0; top: 60px; color: #fff"
  >
    resetView
  </button>
  <button
    class="test"
    @click="changeView2"
    style="position: absolute; right: 0; top: 90px; color: #fff"
  >
    changeView2
  </button>
  <button
    class="test"
    @click="mapOn = !mapOn"
    style="position: absolute; right: 0; top: 120px; color: #fff"
  >
    Map
  </button>
  <button
    class="test"
    @click="editorOn = !editorOn"
    style="position: absolute; right: 0; top: 150px; color: #fff"
  >
    editorOn
  </button>
  <button
    class="test"
    @click="emitter.emit('challenge')"
    style="position: absolute; right: 0; top: 180px; color: #fff; z-index: 201"
  >
    challengeOn
  </button> -->

  <!-- <button
    class="test"
    @click="screenOn = !screenOn"
    style="position: absolute; right: 0; top: 240px; color: #fff; z-index: 201"
  >
    screenOn
  </button>-->
  <!-- <button
    class="test"
    @click="dream = !dream"
    style="position: absolute; right: 0; top: 270px; color: #fff; z-index: 1001"
  >
    dream
  </button> -->
  <!-- <button
    class="test"
    @click="chect"
    style="position: absolute; right: 0; top: 300px; color: #fff; z-index: 1001"
  >
    Ending
  </button> -->

  <div style="position: absolute; z-index: -1; left: -50px">
    <img src="/UI/defence/treasure1.png" />
    <img src="/UI/defence/treasure2.png" />
    <img src="/UI/defence/treasure3.png" />
    <img src="/UI/defence/treasure4.png" />
  </div>

    <!-- Process -->
  <transition name="p">
    <Process v-if="processPanel" :process='3'/>
  </transition>

  <!-- Reward -->
  <transition name="r">
    <Reward v-if="rewardOn" :reward="reward"  key="2"/>
  </transition>

    <!-- Done -->
    <transition name="r">
    <Done v-if="doneOn" :doneNum="doneNum"/>
  </transition>
</template>

<style lang="less" scoped>
.dream {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  // background-color: rgba(0, 0, 0, 0.494);
  z-index: 1000;
  transition: all 1.5s ease;
  opacity: 1;
  background-image: url(/UI/screen/end/0.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.dream-enter-from {
  opacity: 0;
}
.dream-enter-to {
  opacity: 1;
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
  z-index: 1050;
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
.warning {
  position: absolute;
  z-index: 200;
  top: 60px;
  height: 120px;
  width: 450px;
  // background-color: rgba(252, 155, 155, 0.576);
  border-radius: 30px;
  left: 0;
  right: 0;
  margin: 0 auto;
  opacity: 0;
  border-radius: 60px;
  overflow: hidden;
  img {
    height: 100%;
  }
  transform: scale(0.8);
}
.warningOn {
  animation: warning 1s linear infinite;
}
@keyframes warning {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}

.propaganda {
  color: #fff;
  // transform: translateX(110px) translateY(-100px);
  -webkit-animation: prop-1bcc8722 0.8s ease 0s forwards;
  animation: prop-1bcc8722 0.8s ease 0s forwards;
  word-break: normal;
  overflow-wrap: anywhere;
  font-size: 30px;
  max-width: 200px;
  position: absolute;
  // bottom: 70px;
  left: 0px;
  cursor: pointer;
  font-family: "xknlt";
}
@keyframes prop {
  from {
    top: -20px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
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