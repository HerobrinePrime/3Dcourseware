<template>
  <div class="map">
    <!-- {{position}} -->
    <img class="chart" src="/UI/map/map.png" :style="{top:`${chartPos.left}px`,left:`${chartPos.top}px`}"/>
    <div class="arrow" :style="{ transform: `rotate(${rotate}deg)` }"></div>
  </div>
</template>

<script setup>
import {
  onBeforeUnmount,
  onMounted,
  reactive,
  watch,
  ref,
} from "vue";
import emitter from "../eventBus";

const props = defineProps(["position"]);
const target = reactive({
  x: 0,
  z: 0,
});
const rotate = ref(0);
const chartPos= reactive({
  /*:x="-4652.75"
        :y="100.38"
        :z="-2407.21"
  */
    // top: -330,
    // left: 29,
    top: 25,
    left: -330,
    x:-4652.75,
    z:-2407.21,
    // rate:18
    // rate:16.564912280701754385964912280702
    rate1:18.944827586206896551724137931034,
    rate2:14.377714285714285714285714285714,
})

const x = chartPos.x
const z = chartPos.z
const left = chartPos.left
const top = chartPos.top
const rate1 = chartPos.rate1
const rate2 = chartPos.rate2
watch(props.position, (newValue) => {
    //1774.10 -- -2002.70   228 =>3,776.8
    // console.log("x:","z:",);
    chartPos.top = top - (newValue.z - z) / rate2
    chartPos.left = left + (newValue.x - x) / rate1
});
watch(target, (target) => {
  const x = target.x - props.position.x;
  const z = target.z - props.position.z;
  const tan = x / z;
  if (z < 0) rotate.value = -((Math.atan(tan) / Math.PI / 2) * 360) - 90;
  else rotate.value = 180 - (Math.atan(tan) / Math.PI / 2) * 360 -90 ;
});

onMounted(() => {
  emitter.on("target", (point) => {
    target.x = point.x;
    target.z = point.z;
  });
});
onBeforeUnmount(() => {
  emitter.off("target");
});
</script>

<style lang="less" scoped>
.map {
  // display: none;
  position: absolute;
  z-index: 100;
  height: 200px;
  width: 200px;
  background-color: rgb(239, 239, 239);
  opacity: 0.8;
  left: 25px;
  top: 25px;
  // top: 125px;
  border-radius: 50%;
  text-align: center;
  font-size: 12px;
  line-height: 50px;
  overflow: hidden;

  .chart {
    max-width: none;
    //347 ==> 228.6
    display: block;
    position: absolute;
    height: 443px;
    width: 510px;
    
  }
  .arrow {
    position: absolute;
    z-index: 10;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 0px;
    width: 0px;
    border: 20px solid red;
    border-top: none;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    transition: transform 0.3s ease;
  }
}
@media screen and (max-width: 768px) {
  .map {
    // display: none;
  }
}
</style>