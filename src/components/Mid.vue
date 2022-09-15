<template>
  <World>
    <Model
      src="/models/mid/screen.glb"
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
    <LingoEditor v-if="lingoEditor" />
  </World>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { World, Cube, LingoEditor, Model, Setup } from "lingo3d-vue";

const lingoEditor = ref(true)
</script>


<style lang="less" scoped>
</style>