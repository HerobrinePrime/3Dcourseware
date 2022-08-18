<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import emitter from "../../eventBus";

const challengeOn = ref(false);
const rank = ref(0);

const { state: {questions} } = useStore()
console.log(questions);

//emitter
onMounted(()=>{
  //challengeSwitch
  emitter.on('challenge',() =>{
    challengeOn.value = !challengeOn.value
  })
})
onBeforeUnmount(()=>{
  emitter.off('challenge')
})
</script>

<template>
  <div class="challenge" v-if="challengeOn"></div>
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
}
</style>