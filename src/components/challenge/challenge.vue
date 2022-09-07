<script setup>
import { useProp } from "element-plus";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";
import emitter from "../../eventBus";
import { request } from "../../request";

const alpha = reactive(["A", "B", "C", "D"]);

const props = defineProps(['model'])
console.log(props);

const challengeOn = ref(false);
const model = ref(0); //0简单模式,1困难模式
const rank = ref(0);

const { state } = useStore();
const questions = computed(() => {
  if (model.value == 0) {
    return [
      ...state.questions.get(0),
      ...state.questions.get(1),
      ...state.questions.get(2),
    ];
  } else {
    return [...state.questions.get(rank.value)];
  }
});

const question = reactive({
  question: {},
});

//self
const self = reactive({
  remain: 0,
});
const boss = reactive({
  remain: 0,
});

//activation
const selected = reactive([]);
const answer = (index) => {
  if (selected.indexOf(index) == -1) {
    //没选择这个
    selected.push(index);
  } else {
    selected.splice(selected.indexOf(index), 1);
  }
};
const commit = () => {
  //round
  inRound.value = false;
  //计时器
  clearInterval(timer);

  //判断
  let sign = true;
  if (selected.length != question.question.answer.length) {
    sign = false;
  }
  const seikai = selected.every(
    (ele) => question.question.answer.indexOf(ele) != -1
  );
  if (!seikai) {
    sign = false;
  }
  if (sign) {
    //right
    right();
  } else {
    //wrong
    wrong();
  }
};
const clear = () => {
  selected.length = 0;
};
let rightWrongTimer = {};
const catImg = ref("/UI/challenge/good.png");
const dogImg = ref("/UI/challenge/bad.png");
const catAnime = ref("");
const dogAnime = ref("");
const right = async () => {
  clearTimeout(rightWrongTimer);
  boss.remain--;

  //anime
  dogImg.value = "/UI/challenge/bad_egg.png";
  dogAnime.value = "dogAnime";

  setTimeout(() => {
    dogImg.value = "/UI/challenge/bad.png";
  }, 560);
  rightWrongTimer = setTimeout(() => {
    detection();
    // dogImg.value = "/UI/challenge/bad.png";
    dogAnime.value = "";
  }, 1500);

  //request
  const res = await request({
    url: "/student/rightWrong",
    method: "POST",
    data: {
      type: question.question.type,
      sign: "right",
    },
  });
  console.log(res);
};
const wrong = async () => {
  clearTimeout(rightWrongTimer);
  self.remain--;

  //anime
  catImg.value = "/UI/challenge/good_egg.png";
  catAnime.value = "catAnime";

  setTimeout(() => {
    catImg.value = "/UI/challenge/good.png";
  }, 560);
  rightWrongTimer = setTimeout(() => {
    detection();

    catAnime.value = "";
  }, 1500);

  //request
  const res = await request({
    url: "/student/rightWrong",
    method: "POST",
    data: {
      type: question.question.type,
      sign: "wrong",
    },
  });
  console.log(res);
};

//process control
const inRound = ref(false);
watch(challengeOn, (newValue) => {
  if (newValue) {
    start();
  } else {
    clearInterval(timer);
    inRound.value = false;
    question.question = {};
  }
});
const SELF_REMAIN = ref(0);
const BOSS_REMAIN = ref(0);
let startTimer = {};
const start = () => {
  clearTimeout(startTimer);
  if (model.value == 0) {
    //简单模式
    self.remain = 5;
    SELF_REMAIN.value = 5;
    boss.remain = 5;
    BOSS_REMAIN.value = 5;
  } else {
    //困难模式
    self.remain = 5;
    SELF_REMAIN.value = 5;
    boss.remain = 10 + rank.value * 5;
    BOSS_REMAIN.value = 10 + rank.value * 5;
  }

  //开场动画
  startTimer = setTimeout(() => {
    round();
  }, 2000);
};
const round = () => {
  inRound.value = true;
  getQuestion();
  countStart();
};
const detection = () => {
  clear();
  if (boss.remain == 0) {
    //pass
    console.log("pass");
    challengeOn.value = false
    emitter.emit("challengeDone",true)
    
  } else if (self.remain == 0) {
    //die
    console.log("die");
    challengeOn.value = false
    emitter.emit("challengeDone",false)
  } else {
    //new round
    round();
  }

  
};

//let count down
const COUNTDOWN = 15;
const countDown = ref(COUNTDOWN);
let timer = undefined;
const countStart = () => {
  countDown.value = COUNTDOWN;
  timer = setInterval(() => {
    countDown.value--;
  }, 1000);
};
watch(countDown, (newValue) => {
  if (newValue == 0) {
    //zero
    commit();
  }
});

const last = ref(-1);
const getQuestion = () => {
  const length = questions.value.length;
  const index = Math.floor(Math.random() * length);
  if (index == last.value) return getQuestion();
  question.question = questions.value[index];
  last.value = index;
};

//emitter
onMounted(() => {
  //challengeSwitch
  emitter.on("challenge", () => {
    challengeOn.value = !challengeOn.value;
  });
});
onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
  clearInterval(timer);

  emitter.off("challenge");
});
</script>

<template>
  <transition name="el-fade-in">
    <div class="challenge" v-if="challengeOn">
      <!-- {{question.question}} -->
      <div class="remain">
        <div class="num">
          <img src="/UI/challenge/count.png" />
          <div class="countDown">{{ inRound ? countDown + " s" : "" }}</div>
        </div>
        <div class="count-down">
          <span class="moji">倒计时</span>
        </div>
        <div class="boss">
          <!-- {{ boss.remain }} -->
          <img class="portrait_bac" src="/UI/challenge/cat_portrait.png" />
          <img
            class="remain_num"
            src="/UI/challenge/left.png"
            :style="{
              // width: 52 * boss.remain/BOSS_REMAIN + '%'
              left:
                90 - (230 * (SELF_REMAIN - self.remain)) / SELF_REMAIN + 'px',
              // 90 - (230 * (BOSS_REMAIN - boss.remain)) / BOSS_REMAIN + 'px',
            }"
          />
        </div>
        <div class="self">
          <!-- {{ self.remain }} -->
          <img class="portrait_bac" src="/UI/challenge/dog_portrait.png" />
          <img
            class="remain_num"
            src="/UI/challenge/right.png"
            :style="{
              // width: 52 * self.remain/SELF_REMAIN + '%'
              right:
                // 90 - (230 * (SELF_REMAIN - self.remain)) / SELF_REMAIN + 'px',
                90 - (230 * (BOSS_REMAIN - boss.remain)) / BOSS_REMAIN + 'px',
            }"
          />
        </div>
      </div>
      <div class="bamen">
        <div class="boss-bamen">
          <img class="bac" src="/UI/challenge/bat_bac.png" />
          <img
            class="char"
            :src="catImg"
            :class="{
              catAnime: catAnime,
            }"
          />
        </div>
        <div class="self-bamen">
          <img class="bac" src="/UI/challenge/bat_bac.png" />
          <img
            class="char"
            :src="dogImg"
            :class="{
              dogAnime: dogAnime,
            }"
          />
        </div>
      </div>
      <div class="bottom" v-loading="!inRound">
        <!-- <div class="bottom"> -->
        <div class="question">
          <span class="content">
            {{ question.question.contnet }}
          </span>
        </div>
        <div class="answers">
          <div
            class="answer"
            :class="{ selected: selected.indexOf(index) != -1 }"
            v-for="(selection, index) in question.question.selections"
            :key="index"
            @click="answer(index)"
          >
            <span class="content">
              {{ alpha[index] }}
              {{ selection }}
            </span>
          </div>
        </div>
        <div class="act">
          <div class="commit" @click="commit">
            <img src="/UI/challenge/queding.png" />
          </div>
          <div class="clear" @click="clear">
            <img src="/UI/challenge/quxiao.png" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="less" scoped>
.challenge {
  position: absolute;
  z-index: 200;
  height: 100%;
  width: 100%;
  // background-color: rgba(255, 255, 255, 0.419);
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background-image: url(/UI/challenge/bac.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 5.5vh 5.7%;
  // padding-top:12.6%  ;
  & > div {
    width: 100%;
    display: flex;
    flex-direction: row;
    transition: all 0.3s ease;
  }
  .remain {
    position: relative;
    height: 11%;
    // background-color: rgba(240, 248, 255, 0.724);
    justify-content: space-between;
    .count-down {
      position: absolute;
      text-align: center;
      // width: 10%;
      height: 75px;
      line-height: 75px;
      width: 150px;
      left: 0;
      right: 0;
      margin: 0 auto;
      .moji {
        font-family: "xknlt";
        color: #586f90;
        font-size: 47px;
        font-weight: bold;
      }
    }
    & > div {
      height: 100%;
      width: 40%;
      // background-color: rgba(240, 248, 255, 0.724);
      position: relative;
    }

    .num {
      position: absolute;
      height: 200px;
      width: 200px;
      margin: 0 auto;
      left: 0;
      right: 0;
      top: 180px;
      img {
        position: absolute;
        z-index: 0;
      }
      .countDown {
        position: absolute;
        z-index: 1;
        height: 100px;
        width: 100px;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        line-height: 95px;
        font-family: "xknlt";
        color: #fff;
        font-size: 50px;
      }
    }
    .boss,
    .self {
      height: 105px;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      overflow: hidden;
      .portrait_bac {
        position: absolute;
        // height: 100%;
        /* transform: scale(1.5); */
        height: 105px;
        top: 0;
        bottom: 0;
        margin: auto;
        z-index: 1;
      }
      .remain_num {
        // width: 53%;
        height: 75px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        z-index: 0;
        transition: all 0.3s ease;
      }
    }
    .boss {
      left: 0;
      border-top-left-radius: 60px;
      border-bottom-left-radius: 60px;
      .portrait_bac {
        left: 0;
      }
      .remain_num {
        left: 90px;
      }
    }
    .self {
      right: 0;
      border-top-right-radius: 60px;
      border-bottom-right-radius: 60px;
      .portrait_bac {
        right: 0;
      }
      .remain_num {
        right: 90px;
      }
    }
  }
  .bamen {
    flex: 60;
    // background-color: rgba(255, 239, 219, 0.731);
    justify-content: space-between;
    & > div {
      position: relative;
      height: 100%;
      width: 30%;
      // background-color: rgba(255, 239, 219, 0.731);
      display: flex;
      align-items: center;
      img {
        display: block;
        // height: 100%;
      }
      .char {
        position: relative;
        z-index: 1;
        transition: right 0.5s ease-out;
      }
    }
    .boss-bamen {
      justify-content: flex-end;
      .bac {
        position: absolute;
        z-index: 0;
        right: 0;
      }
      .char {
        right: 70px;
      }
      .catAnime {
        animation: jump1 1.4s ease;
      }
      @keyframes jump1 {
        0% {
          right: 70px;
          bottom: 0;
        }
        8% {
          bottom: 30px;
        }
        16% {
          bottom: 0px;
        }
        24% {
          bottom: 20px;
        }
        30% {
          bottom: 0;
        }
        36% {
          bottom: 10px;
        }
        40% {
          right: 130px;
          bottom: 0;
        }
        50% {
          right: 130px;
        }
        100% {
          right: 70px;
        }
      }
    }
    .self-bamen {
      .bac {
        position: absolute;
        z-index: 0;
        left: 0;
      }
      .char {
        left: 70px;
      }
      .dogAnime {
        animation: jump2 1.4s ease;
      }
      @keyframes jump2 {
        0% {
          left: 70px;
          bottom: 0;
        }
        8% {
          bottom: 30px;
        }
        16% {
          bottom: 0px;
        }
        24% {
          bottom: 20px;
        }
        30% {
          bottom: 0;
        }
        36% {
          bottom: 10px;
        }
        40% {
          left: 130px;
          bottom: 0;
        }
        50% {
          left: 130px;
        }
        100% {
          left: 70px;
        }
      }
    }
  }
  .bottom {
    min-height: 31.35%;
    // flex: 29;
    // background-color: rgba(225, 254, 245, 0.596);
    & > div {
      height: 100%;
    }
    .question {
      width: 30%;
      background-image: url(/UI/challenge/quest.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 25px;
      text-align: center;
      position: relative;
      /* line-height: 200px; */
      display: flex;
      justify-content: center;
      align-items: center;
      // overflow: auto;
      .content {
        font-family: "xknlt";
        color: #586f90;
        font-size: 18px;
      }
    }
    .answers {
      position: relative;
      flex: 50;
      // background-color: rgba(175, 255, 228, 0.672);
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      padding: 10px;
      text-align: center;
      .answer {
        // height: 42%;
        width: 44%;
        min-height: 29.58%;
        // background-color: rgba(255, 248, 220, 0.604);
        border-radius: 20px;
        margin-top: 1%;
        margin-left: 3%;
        cursor: pointer;
        background-image: url(/UI/challenge/A.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-family: "xknlt";
        padding: 15px;
        color: #2c2f38;
        font-size: 20px;
        .content {
        }
        &:nth-of-type(2n) {
          margin-left: 6%;
        }
      }
      .selected {
        // background-color: rgba(247, 224, 195, 0.737);
        filter: brightness(0.8);
      }
    }
    .act {
      // flex: 6;
      width: 6%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      padding-right: 5px;
      & > div {
        // background-color: antiquewhite;
        // height: 30%;
        // width: 80%;
        height: 70px;
        width: 70px;
        border-radius: 20px;
        cursor: pointer;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .commit {
        // background-image: url(/UI/challenge/queding.png);
        // background-repeat: no-repeat;
        // background-size: 100% 100%;
      }
      .clear {
        // background-image: url(/UI/challenge/quxiao.png);
        // background-repeat: no-repeat;
        // background-size: 100% 100%;
      }
    }
  }
}
</style>