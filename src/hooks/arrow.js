import { reactive } from "vue";

const arrow = reactive({
    x: 0,
    y: 0,
    z: 0,
    setArrow: (point) => {
      // console.log(point);
      arrow.x = point.x;
      arrow.y = point.y;
      arrow.z = point.z;
    },
  });

export {
    arrow
}