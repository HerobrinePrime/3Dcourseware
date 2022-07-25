<template>
  <Model
    name="diamond"
    :scale="1.75"
    :src="`models/main/diamond${cat}.fbx`"
    :metalnessFactor="1"
    :roughnessFactor="0"
    @click="mapOnClick($event)"
    physics="map"
    :x="x"
    :y="y"
    :z="z"
    :rotationY="anime"
    bloom
    toon
    :outline="outline"
    :onMouseOver="onMouseOver"
    :onMouseOut="onMouseOut"
  >
  </Model>
</template>

<script >
import { Model, Sprite, useAnimation } from "lingo3d-vue";
import { reactive, ref } from "vue";

export default {
  components: {
    Model,
  },
  props: ["mapOnClick", "x", "y", "z", "cat"],
  setup(props) {
    console.log(props);

    const outline = ref(false);

    const onMouseOver = () => {
      outline.value = true;
    };
    const onMouseOut = () => {
      outline.value = false;
    };

    // const diamond = reactive({
    //   rotationY: 0,
    // });
    const anime = useAnimation({
      from: 0,
      to: 360,
      duration: 3000,
      repeatType: "loop",
      repeat:Infinity,
      // ease:Infinity
      ease:(number) => number
    });
    console.log(useAnimation);

    // setInterval(() => {
    //   diamond.rotationY += 2;
    // }, 30);

    return {
      anime,
      outline,
      onMouseOver,
      onMouseOut,
    };
  },
};
</script>

<style>
</style>