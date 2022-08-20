<script setup>
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

watch(challengeOn, (newValue) => {
  if (newValue) {
    start();
  }
});
const start = () => {
  if (model.value == 0) {
    //简单模式
    self.remain = 5;
    boss.remain = 5;
  } else {
    //困难模式
    self.remain = 5;
    boss.remain = 10 + rank.value * 5;
  }

  round();
};
const round = () => {
  getQuestion();
};

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
  emitter.off("challenge");
});
</script>

<template>
  <div class="challenge" v-if="challengeOn">
    <!-- {{question.question}} -->
    <div class="remain">
      <div class="boss"></div>
      <div class="self"></div>
    </div>
    <div class="bamen">
      <div class="boss-bamen"></div>
      <div class="self-bamen"></div>
    </div>
    <div class="bottom">
      <div class="question">
        {{question.question.contnet}}
      </div>
      <div class="answers">
        <div class="answer" v-for="(selection,index) in question.question.selections" :key="index" @click="answer">
        {{index}}
          {{selection}}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.challenge {
  position: absolute;
  z-index: 200;
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.419);
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  & > div {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  .remain {
    flex: 11;
    background-color: rgba(240, 248, 255, 0.724);
    justify-content: space-between;
    & > div {
      height: 100%;
      width: 40%;
      background-color: rgba(240, 248, 255, 0.724);
    }
    .boss {
    }
    .remain {
    }
  }
  .bamen {
    flex: 60;
    background-color: rgba(255, 239, 219, 0.731);
    justify-content: space-between;
    & > div {
      height: 100%;
      width: 40%;
      background-color: rgba(255, 239, 219, 0.731);
    }
  }
  .bottom {
    flex: 29;
    background-color: rgba(225, 254, 245, 0.596);
    &>div{
      height: 100%;
    }
    .question{
      flex: 26;
      background-color: rgba(229, 255, 203, 0.672);
    }
    .answers{
      position: relative;
      flex: 74;
      background-color:rgba(175, 255, 228, 0.672);
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      .answer{
        height: 42%;
        width: 44%;
        background-color: rgba(255, 248, 220, 0.604);
        border-radius: 20px;
        margin-top: 1%;
        margin-left: 3%;
        cursor: pointer;
        &:nth-of-type(2n){
          margin-left: 6%;
        }
      }
    }
  }
}
</style>