<script setup lang="ts">
import { Transition } from "vue";
</script>


<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="Load2">
      <component :is="Component" v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive"/>
  </router-view>
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
.wrapper:hover .load-box {
  transform: scale(1.2);
}
.load-box {
  transition: transform 0.8s ease;
}
</style>