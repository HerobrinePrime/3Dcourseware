<script setup lang="ts">
import { Transition } from "vue";
</script>


<template>

  <router-view></router-view>

</template>

<style>
body,
html {
  /* height: 100vh;
  width: 100vw;*/
  overflow: hidden;
  user-select: none;
  background-color: #000;
}
.fade-enter-active,
.fade-leave-active {
  transition: transform 3s ease;
}
.fade-enter-from,
.fade-leave-to {
  transform: translate(100vw);
}
.fade-enter-to,
.fade-leave-from {
  transform: translate(0);
}
</style>