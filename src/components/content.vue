<template>
  <div class="right-panel" v-if="props.count == props.sign">
    <div class="contents" ref="contents">
      <!-- 固定对话 -->
      <div
        class="content-wrapper"
        v-for="(con, index) in content"
        :key="index"
        :class="con.jibun ? 'right' : 'left'"
      >
        <div class="icon">
          <img :src="con.jibun ? portrait : portraits[sign - 1]" />
        </div>
        <div class="content">
          <div class="text-wrapper">
            {{ con.kotoba }}
          </div>
        </div>
      </div>
      <!-- 选择对话 -->
      <div
        class="content-wrapper"
        v-for="(con, index) in decidedContent"
        :key="index"
        :class="con.jibun ? 'right' : 'left'"
      >
        <div class="icon"><img :src="con.jibun ? portrait :  portraits[sign - 1]" /></div>
        <div class="content">
          <div class="text-wrapper">
            {{ con.kotoba }}
          </div>
        </div>
      </div>
    </div>
    <div class="input-panel">
      <img src="/UI/phone/input.png" class="input" @click="input" />
      <div class="panel" :class="{ 'panel-on': kaiwaOn }">
        <!-- 固定部分按钮 -->
        <div
          class="button"
          @click="processAdd"
          :class="{ 'button-hidden': buttonHidden }"
          v-if="buttonContent.jibun"
        >
          <div class="text-wrapper">{{ buttonContent.kotoba }}</div>
        </div>
        <!-- 没了 -->
        <TransitionGroup>
          <div
            class="button"
            v-if="selectionOn"
            style="position: absolute"
            :style="{ left: key ? '10px' : '40px' }"
          >
            <div class="text-wrapper" @click.once="select(-1)">
              {{ undefencableContent[props.sign - 1][0].kotoba }}
            </div>
          </div>
          <div
            class="button"
            :class="{ lostKey: !key }"
            v-if="selectionOn"
            style="position: absolute; right: 10px"
          >
            <div class="text-wrapper" @click.once="select(1)">
              {{ key ? defencableContent[props.sign - 1][0].kotoba : "???" }}
            </div>
          </div>
        </TransitionGroup>
        <!-- 选择决定按钮 -->
        <div
          class="button"
          @click="process2Add"
          :class="{ 'button-hidden': buttonHidden2 }"
          v-if="selection != 0 && decidedButtonContent.jibun"
        >
          <div class="text-wrapper">{{ decidedButtonContent.kotoba }}</div>
        </div>
      </div>
    </div>
    <div class="typing" :style="{ opacity: typing ? 1 : 0 }">Typing...</div>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { computed, nextTick, watch } from "@vue/runtime-core";
import { TransitionGroup } from "@vue/runtime-dom";
import { useStore } from "vuex";

//portraits
const portraits = reactive(["/UI/phone/portraits/portrait0.png", "/UI/phone/portraits/portrait0.png", "/UI/phone/portraits/portrait0.png", "/UI/phone/portraits/portrait0.png"]);

//vue const
const props = defineProps(["count", "sign"]);
const {
  state: {
    constContent,
    undefencableContent,
    defencableContent,
    defences,
  },
  dispatch,
} = useStore();
const store = useStore()

const portrait = computed(()=>{
  // console.log(store.state.student.portrait);
  return store.state.student.portrait
})

const typing = ref(false);

const key = computed(() => {
  return defences.get(`key${props.sign}`);
});

const done = ref(false);
const kanryou = () => {
  done.value = true;

  setTimeout(() => {
    kaiwaOn.value = false;
    //删除按钮
    selectionOn.value = false;

    if (selection.value == 1) {
      console.log("成功防范");
      //请求清除记录
      dispatch("defenced", props.sign);
    } else {
      console.log("失败防范");
      //请求记录失败防范
      dispatch("undefenced", props.sign);
    }
  }, 1200);
};

// #region
//进程1
const process = ref(1);
const buttonContent = computed(() => {
  if (props.count == 0) return;
  // console.log("asdfasdf");
  if (process.value == constContent[props.sign - 1]?.length) {
    if (!done.value && selection.value == 0) {
      //激活选项
      selectionOn.value = true;
    }

    return { jibun: false, kotoba: "" };
  }
  return constContent[props.sign - 1][process.value];
});
const buttonHidden = ref(false);
let processing = false;
const processAdd = async () => {
  if (processing) return;
  processing = true;

  //隐藏按钮
  buttonHidden.value = true;

  new Promise((resolve) => {
    setTimeout(() => {
      //等按钮消失后
      //更新process 说话更新
      process.value++;
      resolve();
    }, 300);
  })
    .then((res) => {
      return new Promise((resolve) => {
        typing.value = true;
        setTimeout(() => {
          process.value++;
          typing.value = false;
          resolve();
        }, 2000);
      });
    })
    .then((res) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          buttonHidden.value = false;
          resolve();
        }, 500);
      });
    });

  setTimeout(() => {
    processing = false;
  }, 4000);
};

//进程2
const process2 = ref(0);
const selection = ref(0);
const selectionOn = ref(false);
const select = (se) => {
  if (se == 1 && key.value == false) {
    console.log("还没有钥匙");
    return;
  }
  selection.value = se;
  selectionOn.value = false;

  new Promise((resolve) => {
    setTimeout(() => {
      process2.value = 1;
      resolve();
    }, 300);
  })
    .then((res) => {
      return new Promise((resolve) => {
        if (done.value) {
          return;
        }
        typing.value = true;
        setTimeout(() => {
          process2.value++;
          typing.value = false;
          resolve();
        }, 2000);
      });
    })
    .then((res) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          buttonHidden2.value = false;
          resolve();
        }, 500);
      });
    });
};
const decidedButtonContent = computed(() => {
  // console.log(selection.value);
  if (selection.value == 1) {
    if (process2.value == defencableContent[props.sign - 1].length) {
      //激活选项
      console.log("kanryou");

      kanryou();
      return { jibun: false, kotoba: "" };
    }

    return defencableContent[props.sign - 1][process2.value];
  } else if (selection.value == -1) {
    console.log(process2.value);
    console.log(undefencableContent[props.sign - 1].length);
    if (process2.value == undefencableContent[props.sign - 1].length) {
      //激活选项
      console.log("kanryou");

      kanryou();
      return { jibun: false, kotoba: "" };
    }

    return undefencableContent[props.sign - 1][process2.value];
  }
});
const buttonHidden2 = ref(true);
let processing2 = false;
const process2Add = async () => {
  if (processing2) return;
  processing2 = true;

  buttonHidden2.value = true;

  new Promise((resolve) => {
    setTimeout(() => {
      //等按钮消失后
      //更新process 说话更新
      process2.value++;
      resolve();
    }, 300);
  })
    .then((res) => {
      return new Promise((resolve) => {
        if (done.value) {
          return;
        }
        typing.value = true;
        setTimeout(() => {
          process2.value++;
          typing.value = false;
          resolve();
        }, 2000);
      });
    })
    .then((res) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          buttonHidden2.value = false;
          resolve();
        }, 500);
      });
    });

  setTimeout(() => {
    processing2 = false;
  }, 4000);
};

//决定的对话
const decidedContent = computed(() => {
  scrollDown();
  if (selection.value == 1) {
    return defencableContent[props.sign - 1]?.slice(0, process2.value);
  } else if (selection.value == -1) {
    return undefencableContent[props.sign - 1]?.slice(0, process2.value);
  }
});
//循环固定对话
const content = computed(() => {
  scrollDown();
  return constContent[props.sign - 1]?.slice(0, process.value);
});
// #endregion

//#region
//对话框
const contents = ref();

const kaiwaOn = ref(false);
const scrollDown = async () => {
  const c = contents.value;
  //500s

  if (c == undefined) return;
  await nextTick();
  c.scrollTop = c.scrollHeight;

  // setTimeout(() => {
  // console.log(c.clientHeight);
  // console.log(c.scrollHeight);
  // console.log(c.scrollTop);

  // let time = setInterval(() => {
  //   if (c == undefined) return;
  //   c.scrollTop += 10;
  //   console.log(c.scrollHeight - c.clientHeight - c.scrollTop);
  //   if (c.scrollHeight - c.clientHeight - c.scrollTop < 2) {
  //     clearInterval(time);
  //   }
  // }, 1);

  // }, 500);
};
const input = () => {
  kaiwaOn.value = !kaiwaOn.value;
  scrollDown();
};
//#endregion
</script>

<style lang="less" scoped>
.right-panel {
  position: absolute;
  top: 72px;
  right: 3px;
  width: 66.3%;
  display: flex;
  flex-direction: column;
  height: 410px;
  justify-content: space-between;
  .contents {
    display: block;
    // position: absolute;
    // height: 71%; //41%
    // width: 66.3%;
    // top: 72px;
    // right: 3px;
    overflow: auto;
    // background-color: antiquewhite;
    overflow: auto;
    &::-webkit-slider-runnable-track {
      -webkit-appearance: none;
    }
    &::-webkit-scrollbar-track {
      -webkit-appearance: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar {
      // -webkit-appearance: none;
      width: 5px;
      // height: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 2.5px;
    }
    &::-webkit-scrollbar-thumb {
      -webkit-appearance: none;
      width: 2px;
      height: 8px;
      background-color: rgba(191, 191, 191, 0.485);
    }
    .content-wrapper {
      width: 70%;
      position: relative;
      margin: auto;
      .content {
        display: inline-block;
        max-width: 300px;

        min-height: 63.15px;
        // width: 80%;
        // background-color: aqua;
        margin: 8% auto 0 auto;
        background-repeat: no-repeat;

        font-family: "xknlt";
        color: #000;
        .text-wrapper {
          // min-width: 50px;
          // max-width: 100%;
          font-size: 18px;
        }
      }

      .icon {
        position: absolute;
        height: 50px;
        width: 50px;
        background-color: #fff;
        border-radius: 10px;
        top: 30px;
        overflow: hidden;
        img {
          display: block;
          height: 100%;
          width: 100%;
        }
      }
    }
    .left {
      text-align: left;
      .content {
        border-image: url(/UI/phone/left.png) 46 10 10 40 stretch;
        border-top: 46px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 40px solid transparent;
      }
      .text-wrapper {
        transform: translate(-10px, -15px);
      }
      .icon {
        left: -60px;
      }
    }
    .right {
      text-align: right;
      .content {
        border-image: url(/UI/phone/right.png) 46 40 10 10 stretch;
        border-top: 46px solid transparent;
        border-right: 40px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid transparent;
        .text-wrapper {
          transform: translate(10px, -15px);
        }
      }
      .icon {
        right: -60px;
      }
    }
  }
  .input-panel {
    // width: 66.3%;
    background-color: transparent;
    // position: absolute;
    // right: 3px;
    // bottom: 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .input {
      // height: 25px;
      cursor: pointer;
    }
    .panel {
      height: 0;
      width: 100%;
      transition: height 0.5s ease;
      .button {
        opacity: 0;
        // transition: opacity 0.5s 0.5s;
      }
    }
    .panel-on {
      height: 140px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .button {
        cursor: pointer;
        transition: opacity 0.3s ease 0.5s;
        opacity: 1;
        min-width: 100px;
        max-width: 200px;
        // height: 63.15px;
        // height: 80px;
        // width: 180px;
        // background-color: antiquewhite;
        border-image: url(/UI/phone/button.png) 10 10 10 10 stretch;
        border-top: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid transparent;
        .text-wrapper {
          font-size: 18px;
          font-family: "xknlt";
          text-align: center;
        }
      }
      .lostKey {
        background-color: #00000029;
        border-radius: 17px;
        right: 40px !important;
      }
      .button-hidden {
        transition: opacity 0.3s ease;
        opacity: 0;
      }
      .v-enter-active,
      .v-leave-active {
        transition: opacity 0.3s ease !important;
      }
      .v-enter-from,
      .v-leave-to {
        opacity: 0;
      }
      .v-enter-to,
      .v-leave-from {
        opacity: 1;
      }
    }
  }

  .typing {
    font-size: 30px;
    font-family: "xknlt";
    color: #b4b2b2;
    position: absolute;
    left: 10%;
    top: -14%;
  }
}
</style>