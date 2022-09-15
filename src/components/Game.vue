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
  editor,
  lingoEditor,
} from "../hooks/basicController";
import { arrow } from "../hooks/arrow.js";

import {
  orbitCamera,
  orbitCameraInstance,
  changeView,
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
import { useStore,mapState } from "vuex";
import emitter from "../eventBus.js";
//#endregion

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

console.log(mapState(['student']));

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
const savePoint = (point) => {
  store.commit("SAVE", point);
};

//a top-banner按钮
const active = ref(true);
const newsOn = ref(false);
const phoneOn = ref(false);

//请求状态
const hasResult = ref(false);
const resultStatus = ref(0);
const resultTime = 2000;

const svgRotate = useAnimation({
  from:0,
  to:360,
  duration:800,
  repeat:Infinity,
  ease:(n) => n
})

//登录逻辑
//#region
const form = reactive({
  id: "",
  password: "",
  status: "student",
});
const stuInfo = computed(() => {
  return store.state.student;
});
const statusImg = computed(() => {
  return `UI/login/${form.status}.png`;
});
const statusString = computed(() => {
  return `请输入${form.status == "student" ? "学" : "工"}号`;
});

const logined = ref(false);
const panelOn = ref(false);
const loginEnd = ref(false);
const logining = ref(false);

watch(stuInfo, async (cur, prev) => {
  await nextTick();
  hasResult.value = true;
  resultStatus.value = 1;

  setTimeout(() => {
    // if (form.status == "teacher") {
    //   //跳转到教师端
    //   location.href = "http://localhost:8080/";
    //   return
    // }
    logined.value = true;

    // logining.value = false;
    setTimeout(() => {
      loginEnd.value = true;
      bigHidden.value = false;
      selectPanelOn.value = true;
      
    }, 800);
  }, resultTime);
});

const login = async () => {
  if (panelOn.value) {
    logining.value = true;
    //action
    let a = await store.dispatch("login", form);
    store.commit("RESULT", a.msg);
    if (a.code == 200) {
      //成功结果
      //渲染结束回调
      //states stuInfo更新
      // if (form.status == "teacher") {
      //   //跳转到教师端
      //   location.href = "http://localhost:8080/";
      // }
    } else {
      hasResult.value = true;
      resultStatus.value = -1;
      setTimeout(() => {
        logining.value = false;
        hasResult.value = false;
        resultStatus.value = 0;
      }, resultTime);
    }
  } else panelOn.value = true;
};
//#endregion

//注册逻辑
//#region
const form2 = reactive({
  id: "",
  name: "",
  theClass: "",
  portrait: "",
  gender: "",
  password: "",
  email: "",
});
const formReset = () => {
  form2.id = "";
  form2.name = "";
  form2.theClass = "";
  form2.portrait = "";
  form2.gender = "";
  form2.password = "";
  form2.email = "";
};
const signOn = ref(false);
const signing = ref(false);
const signStatus = ref("student");
const sign = async () => {
  //注册中
  signing.value = true;
  //注册结果
  let res = await store.dispatch("sign", {
    form: toRaw(form2),
    status: signStatus.value,
  });
  store.commit("RESULT", res.msg);
  // res.code = 200
  if (res.code == 200) {
    formReset();
    hasResult.value = true;
    resultStatus.value = 1;
    setTimeout(() => {
      signOn.value = false;
      setTimeout(() => {
        hasResult.value = false;
        resultStatus.value = 0;
        signing.value = false;
      }, 500);
    }, resultTime);
  } else {
    hasResult.value = true;
    resultStatus.value = -1;
    setTimeout(() => {
      hasResult.value = false;
      resultStatus.value = 0;
      signing.value = false;
    }, resultTime);
  }
  //resultTime 延时
};
const file = ref();
const imageLoad = () => {
  let img = file.value.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    form2.portrait = reader.result;
    console.log(reader.result);
  });
  if (img) {
    reader.readAsDataURL(img);
  }
};
//#endregion

//地图逻辑
//#region
import jQ from "jquery";
const activatedNews = reactive(new Map());
const currentLabel = ref(0);
const contentActivate = ref(false);
watch(currentLabel, (newValue) => {
  contentActivate.value = false;
  setTimeout(() => {
    contentActivate.value = true;
  }, 500);
});
const timeSet = new Set();
watch(contentActivate, (newValue) => {
  if (newValue) {
    console.log("contentActivate");
    // const lines = jQ('.display>.l-half').children('.line')
    const lines = jQ(".display").find(".line");

    setTimeout(()=>{
      jQ(".ul-wrapper").addClass('ul-cli')
    },200)

    // for (let i = 0; i < lines.length; i++) {
    //   let t1 = setTimeout(() => {
    //     jQ(lines[i]).addClass("on").addClass("on-after");
    //   }, 200);//i * 
    //   timeSet.add(t1);

    //   let t2 = setTimeout(() => {
    //     jQ(lines[i]).removeClass("on");
    //   },1200);// i * 200 + 
    //   timeSet.add(t2);
    // }

    // jQ(".display").find("img").addClass("img-on");
  } else {
    console.log("contentDisActivate");
    // jQ(".content").find(".line").removeClass("on-after");
    // jQ(".content").find("img").removeClass("img-on");
    jQ(".ul-wrapper").removeClass('ul-cli')
  }
});

const person = ref();
const running = ref(false);

const mapOnClick = (e) => {
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

//sprites
const sprite1 = ref();
const sprite2 = ref();
const sprite3 = ref();
const sprite4 = ref();

const enterIntersect = (num) => {
  let sprite = undefined;
  if (num == 1) sprite = sprite1.value;
  if (num == 2) sprite = sprite2.value;
  if (num == 3) sprite = sprite3.value;
  if (num == 4) sprite = sprite4.value;
  sprite.onLoop = () => {
    sprite.opacity -= 0.03;
    if (sprite.opacity <= 0) sprite.onLoop = undefined;
  };

  //更新进度
  store.dispatch("setProcess", num);

  activatedNews.set(num);
  store.commit("news",activatedNews.size)

  console.log("enterIntersect");
  changeView();
  const hito = person.value;
  hito.moveTo(Math.floor(hito.x), undefined, Math.floor(hito.z), 1000);

  setTimeout(() => {
    newsOn.value = true;
  }, 500);
  setTimeout(() => {
    currentLabel.value = activatedNews.size;
    // contentActivate.value = true
  }, 1000);

  savePoint({
    x: Math.floor(hito.x),
    y: Math.floor(hito.y) + 600,
    z: Math.floor(hito.z),
  });
};
const newsActivate = () => {
  newsOn.value = true;
  setTimeout(() => {
    if (activatedNews.size == 0) return;
    currentLabel.value = 1;
  }, 500);
};

const spriteWidth = ref(0)
const springSpriteWidth = useSpring({
  to:spriteWidth,
  bounce:0,
  duration:1200
})
const exitIntersect = (e) => {
  currentLabel.value = 0;

  console.log("exitIntersect");
  resetView();

  setTimeout(() => {
    newsOn.value = false;
  }, 500);

  setTimeout(()=>{
    if (activatedNews.size == 4) {
      //teleport
      orbitCamera.autoRotate = false
      const hito = person.value
      hito.onLoop = ()=>{
        hito.lookTo(-38.41,undefined,-166.32,0.15)
      }
      hito.onMouseOver = undefined
      hito.onMouseOut = undefined
      // hito.moveTo(-38.41,undefined,-166.32,0.15)
      orbitCameraInstance.value.lookTo(-38.41,undefined,-166.32,0.5)
      orbitCamera.innerRotationX = -20

      setTimeout(()=>{
        spriteWidth.value = 60
      },400)
      // spriteWidth = useAnimation({from:0,to:100,duration:800})
      const sprite = theSprite.value
      sprite.onClick = spriteClick

      const portertrigger = porterTrigger.value
      portertrigger.onEnter = Maze
      
      // sprite.onLoop = ()=>{
      //   sprite.opacity += 0.015
      //   // sprite.scale += 0.08
      //   if(sprite.opacity >=1 ){
      //     sprite.onLoop = undefined
      //     sprite.onClick = spriteClick
      //   }
      // }
    }
  },1000)
};
const newsDisActivate = () => {
  currentLabel.value = 0;

  setTimeout(() => {
    newsOn.value = false;
  }, 500);
};

const newsChange = () => {
  if (newsOn.value) {
    newsDisActivate();
  } else {
    newsActivate();
  }
};

const onTheTriggerEnter = () => {
  console.log("fallen");
  const hito = person.value;

  hito.moveTo(store.state.x, store.state.y, store.state.z, 10000);
};
//#endregion

//screens
const screens = ["/UI/screen/0.png", "/UI/screen/1.png", "/UI/screen/2.png","/UI/screen/3.png"];
const screenOn = ref(false);
const screenOnInStatus = ()=>{
  screenOn.value = true
}

//select-panel
const selectPanelOn = ref(false);

//spriteClick
const theSprite = ref()
const porterTrigger = ref()
const bright = ref(false)
const fade = ref(false)
const spriteClick = (e)=>{
  const hito = person.value
  hito.moveTo(e.point.x,undefined,e.point.z,10)
  hito.lookTo(e.point.x,undefined,e.point.z,0.15)

  // hito.onMoveToEnd = Maze
}

const Maze = ()=>{
    changeView()
    const sprite = theSprite.value
    bright.value = true
    sprite.onLoop = ()=>{
      sprite.scale += 0.3
      sprite.width += 0.3
      if(sprite.scale >= 30) {
        sprite.onLoop = undefined
        fade.value = true
        setTimeout(()=>{
          toMaze()
        },2500)
      }
    }
  }

//bag事件总线
//#region
onMounted(() => {
  // loginEnd.value = true
  if(localStorage.getItem('token')){
    store.dispatch("testToken")
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
    setTimeout(()=>{
      active.value = false
    },1200)
  });
  emitter.on("selectOff", () => {
    selectPanelOn.value = false;
    setTimeout(() => {
      screenOn.value = true;
      orbitCamera.autoRotate = false
    }, 1000);
  });
});
onBeforeUnmount(() => {
  emitter.off('*')
  emitter.off("thebook");
  emitter.off("thephone");
  emitter.off("screenOff");
  emitter.off("selectOff");
});
//#endregion
</script>

<template>
  <div class="world" :class="{fade:fade}">
    <World
      color="transparent"
      ref="world"
      :logarithmicDepth="true"
      :ambientOcclusion="true"
      default-orbit-controls="false"
    >
      <!-- <SkyLight color="#ffffff" :intensity="1" groundColor="#ffffff"/> -->
      <!-- <AmbientLight /> -->

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
        :autoRotate="orbitCamera.autoRotate && !running"
        :autoRotateSpeed="orbitCamera.autoRotateSpeed"
        :enableDamping="orbitCamera.enableDamping"
        :enableZoom="orbitCamera.enableZoom"
        :minPolarAngle="camera_springMinPolarAngle"
        :maxPolarAngle="camera_springMaxPolarAngle"
        :bokeh="orbitCamera.bokeh"
      >
      <!-- :autoRotate="orbitCamera.autoRotate && !running" -->
        <!-- character -->
        <Model
          src="/models/main/cat.fbx"
          :outline="characterOutline"
          :y="characterY"
          :scale="1.9"
          :innerY="characterspringInnerY"
          :innerRotationY="characterspringInnerRotationY"
          @mouse-over="characterOver(true)"
          @mouse-out="characterOver(false)"
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
      <Model
        src="/models/main/SCEEN-final.fbx"
        :scale="10"
        physics="map"
        toon
        @mouse-down="mapDown"
        @click="mapOnClick"
        :y="-827.09"
        id="map"
        name="map"
        :metalnessFactor="0"
      >
      </Model>

      <Model
        toon
        src="/models/main/trees.fbx"
        :scale="3.7"
        name="trees"
        :x="122.89"
        :y="-315.61"
        :z="15.2"
        physics="map"
      >
      </Model>

      <!-- 1 -->
      <Diamond
        :mapOnClick="mapOnClick"
        :x="1576.6"
        :y="-252.08"
        :z="2091.61"
        :cat="1"
      />
      <Trigger
        :x="1576.6"
        :y="-252.08"
        :z="2091.61"
        :radius="170"
        targetIds="character"
        @enter="enterIntersect(1)"
        :onExit="exitIntersect"
        :interval="100"
      />
      <Sprite
        bloom
        :opacity-factor="1.1"
        adjust-emissive-color="#000000"
        adjust-color="#ffffff"
        :x="1576.6"
        :y="-50"
        :z="2091.61"
        texture="/UI/bag/book.png"
        ref="sprite1"
      />
      <!-- 2 -->
      <Diamond
        :mapOnClick="mapOnClick"
        :x="-1840.8"
        :y="-252.08"
        :z="1574.08"
        :cat="2"
      />
      <Trigger
        :x="-1840.8"
        :y="-252.08"
        :z="1574.08"
        :radius="170"
        targetIds="character"
        @enter="enterIntersect(2)"
        :onExit="exitIntersect"
        :interval="100"
      />
      <Sprite
        bloom
        :opacity-factor="1.1"
        adjust-emissive-color="#000000"
        adjust-color="#ffffff"
        :x="-1840.8"
        :y="-50"
        :z="1574.08"
        texture="/UI/bag/book.png"
        ref="sprite2"
      />
      <!-- 3 -->
      <Diamond
        :mapOnClick="mapOnClick"
        :x="1832.62"
        :y="-252.08"
        :z="-1050.79"
        :cat="3"
      />
      <Trigger
        :x="1832.62"
        :y="-252.08"
        :z="-1050.79"
        :radius="170"
        targetIds="character"
        @enter="enterIntersect(3)"
        :onExit="exitIntersect"
        :interval="100"
      />
      <Sprite
        bloom
        :opacity-factor="1.1"
        adjust-emissive-color="#000000"
        adjust-color="#ffffff"
        :x="1832.62"
        :y="-50"
        :z="-1050.79"
        texture="/UI/bag/book.png"
        ref="sprite3"
      />
      <!-- 4 -->
      <Diamond
        :mapOnClick="mapOnClick"
        :x="-785.65"
        :y="-252.08"
        :z="-1837.57"
        :cat="4"
      />
      <Trigger
        :x="-785.65"
        :y="-252.08"
        :z="-1837.57"
        :radius="170"
        targetIds="character"
        @enter="enterIntersect(4)"
        :onExit="exitIntersect"
        :interval="100"
      />
      <Sprite
        bloom
        :opacity-factor="1.1"
        adjust-emissive-color="#000000"
        adjust-color="#ffffff"
        :x="-785.65"
        :y="-50"
        :z="-1837.57" 
        texture="/UI/bag/book.png"
        ref="sprite4"
      />

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
        :radius="450"
        :interval="300"
        :y="-770"
        :onEnter="undefined"
      />

      <Sprite
        ref="theSprite"
        bloom
        :opacity="1"
        :x="-38.41"
        :y="-183.67"
        :z="-166.32"
        :scale="10.5"
        :onClick="undefined"
        :width="springSpriteWidth"
        :animationPaused="true"
        texture="/UI/porter.png"
      />
      <!-- <Trigger 
        targetIds="character"
        :x="-38.41"
        :y="-483.67"
        :z="-166.32" 
        :radius="200.00"
        :onEnter="teleport"
      /> -->

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
      <!-- <Reflector
        :y="-325.1
        :scaleX="113.2"
        :scaleY="113.2"
        :rotationX="-90"
        :contrast="1"
      /> -->
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
        defaultLight="/env/sunset_fairway_4k.hdr"
        :defaultLightScale="1"
        :exposure="0.5"
        skybox="/env/env1.hdr"
        defaultFog="#000000"
        :bloom="bloom"
        :bloomStrength="1.1"
        :bloomRadius="0.2"
      />
      <!-- <LingoEditor v-if="true" /> -->
      <LingoEditor v-if="false" />
    </World>
    <Editor v-if="editor" />
  </div>
  <!-- 阴影 -->
  <div class="front top" :class="{bright:bright,fade:fade}"></div>
  <div class="front bottom" :class="{bright:bright,fade:fade}"></div>
  <!-- 按钮 -->
  <a
    class="button"
    :class="{ '-off': !active }"
    href="javascript:void(0);"
    @click="active = !active"
    :style="{ top: logined ? '1.5vh' : '5vh', opacity: logined ? '1' : '0' }"
  >
    <!-- <button @click.stop="exitIntersect">exit</button> -->
    <span></span>
  </a>

  <!-- <button class="test" @click="bagChange(!store.state.bag.bagOn)" style="position:absolute;right:0;top:80px;color:#fff;">Bag</button> -->
  <!-- <button
    class="test"
    @click="toMaze"
    style="position: absolute; right: 0; top: 160px; color: #fff"
  >
    Maze
  </button> -->
  <!-- <button
    class="test"
    @click="emitter.emit('unlock')"
    style="position: absolute; z-index: 500; right: 0; top: 220px; color: #fff"
  >
    Unlock
  </button> -->
  <!-- 学生信息 -->
  <States :active="active" :screenOnInStatus="screenOnInStatus"/>
  <!-- bag -->
  <Bag :hidden="bigHidden" />
  
  <!-- book -->
  <transition name="news">
    <div class="news" v-if="newsOn"  @mousewheel.stop="">
      <img class="bot" src="/UI/book/bot.png" />
      <div
        class="label"
        :class="{ 'label-on': currentLabel == 1 }"
        v-show="activatedNews.size > 0"
        @click="currentLabel = 1"
      >
        <span class="title">虚拟交易类</span>
        <span class="box"> </span>
      </div>
      <div
        class="label"
        :class="{ 'label-on': currentLabel == 2 }"
        v-show="activatedNews.size > 1"
        @click="currentLabel = 2"
      >
        <!-- <img src="/UI/book/bc1.png" /> -->
        <span class="title">冒充他人类</span>
        <span class="box"></span>
      </div>
      <div
        class="label"
        :class="{ 'label-on': currentLabel == 3 }"
        v-show="activatedNews.size > 2"
        @click="currentLabel = 3"
      >
        <!-- <img src="/UI/book/bc1.png" /> -->
        <span class="title">中奖福利类</span>
        <span class="box"></span>
      </div>
      <div
        class="label"
        :class="{ 'label-on': currentLabel == 4 }"
        v-show="activatedNews.size > 3"
        @click="currentLabel = 4"
      >
        <!-- <img src="/UI/book/bc1.png" /> -->
        <span class="title">刷单兼职类</span>
        <span class="box"></span>
      </div>
      <img class="fro" src="/UI/book/fro.png" />
      <img class="claw" src="/UI/book/claw.png" />
      <img class="close" src="/UI/book/close.png" @click="exitIntersect" />
      <!-- 1 -->
      <transition name="el-fade-in-linear">
        <div
          class="content"
          v-if="currentLabel == 1"
          :class="{ display: currentLabel == 1 }"
        >
          <!-- :class="{on:onOn,'on-after':onOnAfter}" -->
          <div class="ul-wrapper">
            <ul class="l-half">
              <img class="img1" src="/UI/book/news/img1.webp" />
              <img class="img2" src="/UI/book/news/img2.webp" />
              <li class="line">
                <div class="title">虚拟交易类</div>
              </li>
              <li class="line">
                <div class="text">浙江初中生小朱同学为了交易账号，</div>
              </li>
              <li class="line">
                <div class="text">加了某网友的联系</div>
              </li>
              <li class="line">
                <div class="text">方式并所谓中介群，</div>
              </li>
              <li class="line">
                <div class="text">中介称要收60元的中</div>
              </li>
              <li class="line">
                <div class="text">介费，小朱转了60元红包后，对方</div>
              </li>
              <li class="line">
                <div class="text">又要收600元的担保费，接口担心打</div>
              </li>
              <li class="line">
                <div class="text">钱后小朱改密码，小朱又转了600元</div>
              </li>
              <li class="line">
                <div class="text">，随后中介又提出要收手续费，小朱</div>
              </li>
              <li class="line">
                <div class="text">才发现被骗。</div>
              </li>
              <li class="line">
                <div class="text">河南12岁王同学在游戏中看到有人</div>
              </li>
              <li class="line">
                <div class="text text-right">说可以免费领福利</div>
              </li>
              <li class="line">
                <div class="text text-right">就联系了对方，对</div>
              </li>
              <li class="line">
                <div class="text text-right">方说充值后双倍返</div>
              </li>
            </ul>
          </div>
          <div class="ul-wrapper">
            <ul class="r-half">
              <img class="img3" src="/UI/book/news/img3.webp" />
            <li class="line">
              <div class="text">现，王同学扫码转了钱，对方以“你</div>
            </li>
            <li class="line">
              <div class="text">是未成年人，所以银行卡被冻结了”</div>
            </li>
            <li class="line">
              <div class="text">要他转账负责“赔偿”，又连续发了两</div>
            </li>
            <li class="line">
              <div class="text">个二维码，王同学通过扫码两次转</div>
            </li>
            <li class="line">
              <div class="text">账，共被骗四千余元。</div>
            </li>
            <li class="line">
              <div class="text">宁夏的小贾同学玩手机时，陌生人发</div>
            </li>
            <li class="line">
              <div class="text">来QQ好友验证申请，通过后，对方</div>
            </li>
            <li class="line">
              <div class="text text-right">说有个游戏福利领</div>
            </li>
            <li class="line">
              <div class="text text-right">取活动，点击二维</div>
            </li>
            <li class="line">
              <div class="text text-right">码后，对方以错误</div>
            </li>
            <li class="line">
              <div class="text text-right">操作导致账户被冻</div>
            </li>
            <li class="line">
              <div class="text">结，她会被法院起诉的理由，小贾被</div>
            </li>
            <li class="line">
              <div class="text">骗走了1.9万元。</div>
            </li>
            </ul>
            
          </div>

          
          
        </div>
      </transition>
      <!-- 2 -->
      <transition name="el-fade-in-linear">
        <div
          class="content"
          v-if="currentLabel == 2"
          :class="{ display: currentLabel == 2 }"
        >
          <!-- :class="{on:onOn,'on-after':onOnAfter}" -->
          <div class="ul-wrapper">
          <ul class="l-half">
            <img class="img2-1" src="/UI/book/news/img2-1.webp" />
            <li class="line">
              <div class="title">冒充他人类</div>
            </li>
            <li class="line">
              <div class="text">13岁女孩小曹在网上添加了某明星</div>
            </li>
            <li class="line">
              <div class="text">所谓的QQ号，对方称可以领取粉丝</div>
            </li>
            <li class="line">
              <div class="text text-right">福利，让她发微</div>
            </li>
            <li class="line">
              <div class="text text-right">信收款码过去，</div>
            </li>
            <li class="line">
              <div class="text text-right">小曹照做。不一</div>
            </li>
            <li class="line">
              <div class="text">会，却称由于小曹是未成年人，导致</div>
            </li>
            <li class="line">
              <div class="text">他们公司的账户被冻结，无法进行转</div>
            </li>
            <li class="line">
              <div class="text">账，要用家长的手机进行解冻。小曹</div>
            </li>
            <li class="line">
              <div class="text">按照对方的要求，用妈妈的支付宝扫</div>
            </li>
            <li class="line">
              <div class="text">描对方发来的二维码，最后被骗五千</div>
            </li>
            <li class="line">
              <div class="text">余元。</div>
            </li>
            <!-- <li class="line">
            <div class="text text-right">的特点进行诈骗.</div>
          </li> -->
          </ul>
          </div>
          <div class="ul-wrapper">
            
          <ul class="r-half">
            <img class="img2-2" src="/UI/book/news/img2-2.webp" />
            <li class="line">
              <div class="text">江苏初中生小蔡收到同班同学小孟的</div>
            </li>
            <li class="line">
              <div class="text">消息，称其朋友在医院治疗急需缴纳</div>
            </li>
            <li class="line">
              <div class="text">医药费。对方表示，自己手机银行卡</div>
            </li>
            <li class="line">
              <div class="text">被限额，要转到小蔡卡上，再让小蔡</div>
            </li>
            <li class="line">
              <div class="text">转到他提供的银行卡号上。小蔡当时</div>
            </li>
            <li class="line">
              <div class="text text-right">没有多想就把</div>
            </li>
            <li class="line">
              <div class="text text-right">钱转了过去，</div>
            </li>
            <li class="line">
              <div class="text text-right">但不久对方又</div>
            </li>
            <li class="line">
              <div class="text text-right">让其转额外的</div>
            </li>
            <li class="line">
              <div class="text">几千元，小蔡感觉不对劲便QQ电话</div>
            </li>
            <li class="line">
              <div class="text">与对方确认，却始终无人接听，怀疑</div>
            </li>
            <li class="line">
              <div class="text">被骗后报警。</div>
            </li>
          </ul>
          </div>

          
          
        </div>
      </transition>
      <!-- 3 -->
      <transition name="el-fade-in-linear">
        <div
          class="content"
          v-if="currentLabel == 3"
          :class="{ display: currentLabel == 3 }"
        >
          <!-- :class="{on:onOn,'on-after':onOnAfter}" -->
          <div class="ul-wrapper">
          <ul class="l-half">
            <img class="img3-3" src="/UI/book/news/img3-3.webp" />
            <img class="img3-1" src="/UI/book/news/img3-1.webp" />
             
            <li class="line">
              <div class="title">中奖福利类</div>
            </li>
            <li class="line">
              <div class="text">福建的初中生小陈喜欢上了某组合，</div>
            </li>
            <li class="line">
              <div class="text">并发现了自称是某团粉丝后援会，便</div>
            </li>
            <li class="line">
              <div class="text text-right">迫不及待地加入，</div>
            </li>
            <li class="line">
              <div class="text text-right">随后发现群内正在</div>
            </li>
            <li class="line">
              <div class="text text-right">组织开展抽奖活动</div>
            </li>
            <li class="line">
              <div class="text">，巧合的是刚入群的小陈竟被告知自</div>
            </li>
            <li class="line">
              <div class="text">己幸运地成为特等奖的中奖者，管理</div>
            </li>
            <li class="line">
              <div class="text">员让其缴纳保证金，如果不同意转账</div>
            </li>
            <li class="line">
              <div class="text">，就列入失信人</div>
            </li>
            <li class="line">
              <div class="text">名单，并以要报</div>
            </li>
            <li class="line">
              <div class="text">警抓捕进行威胁，</div>
            </li>
            <li class="line">
              <div class="text">小陈信以为真，按对方说的操作，最</div>
            </li>
            <li class="line">
              <div class="text">后被骗钱财。</div>
            </li>
          </ul>
          </div>
          <div class="ul-wrapper">
          <ul class="r-half">
            <img class="img3-2" src="/UI/book/news/img3-2.webp" />
            <li class="line">
              <div class="text">徐州的王同学在家刷微博，认识了一</div>
            </li>
            <li class="line">
              <div class="text">个网友，对方给了他一个抽奖二维</div>
            </li>
            <li class="line">
              <div class="text text-right">码，称付款388</div>
            </li>
            <li class="line">
              <div class="text text-right">就能参加抽奖，</div>
            </li>
            <li class="line">
              <div class="text text-right">有机会抽苹果手</div>
            </li>
            <li class="line">
              <div class="text text-right">机，王同学就扫</div>
            </li>
            <li class="line">
              <div class="text">描了对方的二维码，充值了388元人</div>
            </li>
            <li class="line">
              <div class="text">民币，后对方称他中了一个苹果12</div>
            </li>
            <li class="line">
              <div class="text">手机，要求王先付5000元保证金才</div>
            </li>
            <li class="line">
              <div class="text">能将手机寄出，同学表示不想要手机</div>
            </li>
            <li class="line">
              <div class="text">了，要求退还388元，被拉黑，才发</div>
            </li>
            <li class="line">
              <div class="text">现自己被骗。</div>
            </li>
            <!-- <li class="line">
            <div class="text">&nbsp;&nbsp;浙江的初中生</div>
          </li>
          <li class="line">
            <div class="text">徐同学用积攒的</div>
          </li>
          <li class="line">
            <div class="text">压岁钱向微信好友购买一台手机，并</div>
          </li>
          <li class="line">
            <div class="text">通过微信零钱扫二维码支付定金</div>
          </li>
          <li class="line">
            <div class="text">1300元给对方，</div>
          </li> -->
          </ul>
          </div>

          
          
        </div>
      </transition>
      <!-- 4 -->
      <transition name="el-fade-in-linear">
        <div
          class="content"
          v-if="currentLabel == 4"
          :class="{ display: currentLabel == 4 }"
        >
          <!-- :class="{on:onOn,'on-after':onOnAfter}" -->
          <div class="ul-wrapper">
            <ul class="l-half">
              <img class="img4-1" src="/UI/book/news/img4-1.webp" />
            <li class="line">
              <div class="title">刷单兼职类</div>
            </li>
            <li class="line">
              <div class="text">近期刘同学加入了一个学生群，通过</div>
            </li>
            <li class="line">
              <div class="text">兼职刷单来赚取</div>
            </li>
            <li class="line">
              <div class="text">“零花钱”。刚开始</div>
            </li>
            <li class="line">
              <div class="text">刷的几单均顺利完</div>
            </li>
            <li class="line">
              <div class="text">成任务，刘同学尝</div>
            </li>
            <li class="line">
              <div class="text">到了甜头准备“大干一场”。由于无法</div>
            </li>
            <li class="line">
              <div class="text">承受“大单”的任务费用，只得去找父</div>
            </li>
            <li class="line">
              <div class="text">母借钱，母亲深表怀疑并拨打了当地</div>
            </li>
            <li class="line">
              <div class="text">反诈中心的电话咨询，发现骗局，最</div>
            </li>
            <li class="line">
              <div class="text">后成功帮助刘同学挽回损失1.6万余元。</div>
            </li>
            <li class="line">
              <div class="text">&nbsp;&nbsp;15岁初中生丘同学最近收到陌生人</div>
            </li>
            <li class="line">
              <div class="text">的好友申请，之后将其拉入某刷单返</div>
            </li>
          </ul>
          </div>
          <div class="ul-wrapper">
            <ul class="r-half">
              <img class="img4-2" src="/UI/book/news/img4-2.webp" />
            <li class="line">
              <div class="text">利群，诱导其完成抖音点赞、关注等</div>
            </li>
            <li class="line">
              <div class="text">任务。完成了1单，对方立即转账</div>
            </li>
            <li class="line">
              <div class="text">8.5元，在完成第二单任务后，再次</div>
            </li>
            <li class="line">
              <div class="text">获利10元。就在继续操作过程中，</div>
            </li>
            <li class="line">
              <div class="text text-right">公安反诈中心及</div>
            </li>
            <li class="line">
              <div class="text text-right">时来电劝阻其立</div>
            </li>
            <li class="line">
              <div class="text text-right">即停止刷单操作</div>
            </li>
            <li class="line">
              <div class="text text-right">，向其详细讲解</div>
            </li>
            <li class="line">
              <div class="text">诈骗套路，退群并删除应用。事后同</div>
            </li>
            <li class="line">
              <div class="text">学还说，之前曾有陌生人以一天100</div>
            </li>
            <li class="line">
              <div class="text">元的价格短期租借微信帐号，重新登</div>
            </li>
            <li class="line">
              <div class="text">陆后，因安全原因被限制使用，更是</div>
            </li>
            <li class="line">
              <div class="text">被这种骗局诈骗2000元。</div>
            </li>
          </ul>
          </div>
          
          
        </div>
      </transition>
    </div>
  </transition>
  <!-- phone -->
  <Phone :phoneOn="phoneOn" />

  <!-- 登录面板 -->
  <div
    class="login-panel panel"
    v-if="!loginEnd"
    :class="{ 'sign-on-1': signOn }"
  >
    <div
      class="login-wapper"
      :class="{ 'panel-down1': !(panelOn && !logined) }"
    >
      <div class="login">
        <template v-if="!logining">
          <div class="options-line">
            <span
              class="options"
              @click="form.status = 'student'"
              :class="{ 'option-active': form.status == 'student' }"
              ><span>学生登录</span></span
            >
            <span
              class="options"
              @click="form.status = 'teacher'"
              :class="{ 'option-active': form.status == 'teacher' }"
              ><span>教师登录</span></span
            >
          </div>
          <div class="line" style="margin: 40px 0 26px 0">
            <img :src="statusImg" />
            <input
              class="text"
              type="text"
              :placeholder="statusString"
              v-model="form.id"
            />
          </div>
          <div class="line" style="margin: 26px 0 40px 0">
            <img src="/UI/login/password.png" />
            <input
              class="text"
              type="password"
              placeholder="请输入密码"
              v-model="form.password"
              @keypress.enter="login"
            />
          </div>
          <div class="other-line">
            <div class="col" @click="signOn = true"><span>注册</span></div>
            <div class="col"><span>忘记密码?</span></div>
          </div>
        </template>
        <template v-if="logining">
          <div
            class="load-box"
            :class="{
              'result-box': hasResult,
              success: resultStatus > 0,
              failure: resultStatus < 0,
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 46 46"
              class="base"
            >
              <circle class="a" cx="23" cy="23" r="20" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 46 46"
              class="loader"
            >
              <circle class="a" cx="23" cy="23" r="20" />
            </svg>
            <div class="msg">
              {{ store.state.result }}
            </div>
            <div class="icon">
              <div class="success">
                <span class="left"> </span>
                <span class="right"> </span>
              </div>
              <div class="failure">
                <span class="left"> </span>
                <span class="right"> </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <button
      class="login-btn"
      @click="login"
      :class="{ 'panel-down2': logined }"
      :disabled="logining"
    >
      <span>登录</span>
    </button>
  </div>

  <!-- 注册面板 -->
  <div class="sign-panel panel" :class="{ 'sign-on-2': signOn }">
    <template v-if="!signing">
      <div class="sign">
        <div class="options-line">
          <span
            class="options"
            @click="signStatus = 'student'"
            :class="{ 'option-active': signStatus == 'student' }"
            ><span>学生注册</span></span
          >
          <span
            class="options"
            @click="signStatus = 'teacher'"
            :class="{ 'option-active': signStatus == 'teacher' }"
            ><span>教师注册</span></span
          >
        </div>
      </div>
      <form>
        <div class="pic">
          <div class="select-portrait">
            <a href="javascript:;">
              <input
                ref="file"
                type="file"
                @change="imageLoad"
                accept="image/*"
              />
              <img :src="form2.portrait" v-if="form2.portrait"/>
              <img :src="signStatus == 'student'?'/UI/login/portrait0.png':'/UI/login/portrait1.png'" v-else/>
              <img class="camera" src="/UI/login/camera.png" />
            </a>
          </div>
        </div>
        <div class="inputBasic">
          <input
            v-model="form2.gender"
            type="text"
            class="gender"
            placeholder="性别"
            :style="{
              width: signStatus == 'student' ? '144px' : '300px',
              margin: signStatus == 'student' ? '0 6px' : '0',
            }"
          />
          <input
            v-model="form2.theClass"
            type="text"
            class="classes"
            :style="{ display: signStatus == 'student' ? 'block' : 'none' }"
            placeholder="班级"
            style="margin: 0 6pxs"
          />
        </div>
        <input
          v-model="form2.id"
          type="ID"
          class="inputBox"
          placeholder="请输入工号/学号"
        />
        <input
          v-model="form2.name"
          type="name"
          class="inputBox"
          placeholder="请输入姓名"
        />
        <input
          v-model="form2.password"
          type="password"
          class="inputBox"
          placeholder="请输入密码"
        />
        <input
          v-model="form2.email"
          type="mailbox"
          class="inputBox"
          placeholder="请输入邮箱"
        />
        <p class="return">
          <a @click.prevent="signOn = false">返回登录</a>
        </p>
        <div class="registBox" style="opacity: 0"></div>
      </form>
    </template>
    <template v-else>
      <div
        class="load-box"
        :class="{
          'result-box': hasResult,
          success: resultStatus > 0,
          failure: resultStatus < 0,
        }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 46 46"
          class="base"
        >
          <circle class="a" cx="23" cy="23" r="20" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 46 46"
          class="loader"
        >
          <circle class="a" cx="23" cy="23" r="20" />
        </svg>
        <div class="msg">
          {{ store.state.result }}
        </div>
        <div class="icon">
          <div class="success">
            <span class="left"> </span>
            <span class="right"> </span>
          </div>
          <div class="failure">
            <span class="left"> </span>
            <span class="right"> </span>
          </div>
        </div>
      </div>
    </template>
    <button class="registBox" @click="sign" :disabled="signing">注册</button>
  </div>

  <!-- Screen -->
  <Screen :screens="screens" :screenOn="screenOn" />

  <!-- SelectPanel -->
  <SelectPanel :selectPanelOn="selectPanelOn" />
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
.bright{
  transition: 0.3s ease-out;
  box-shadow: 2px 2px 18vh 9vh #fff;
}
.fade{
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
</style>