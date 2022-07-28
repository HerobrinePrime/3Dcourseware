import { useSpring } from "lingo3d-vue";
import { computed, reactive, ref } from "vue"

const orbitCamera = reactive({

    // x: 0,
    // y: 0,
    // z: 0,
    // rotationX: 0,
    // rotationY: 0,
    // rotationZ: 0,

    x: 0,
    y: 0,
    z: 0,
    rotationX: 30.30,
    rotationY: 25.61,
    rotationZ: -14.18,

    // innerX: 100,
    innerX: 100,
    // innerY: 150,
    innerY: 420,
    // innerZ: 450.00, //default:500
    innerZ: 450.00, //default:500
    innerRotationX: -45,
    innerRotationY: 0,
    innerRotationZ: 0,

    minPolarAngle:45,
    maxPolarAngle:105,

    autoRotate: true,
    autoRotateSpeed: 0.5,
    enableDamping: true,
    enableZoom: false,

    bokeh: false,

    fov:ref(75)
})

const orbitCameraInstance = ref();

// orbitCamera.innerX = 0
// orbitCamera.innerY = -160
// orbitCamera.innerZ = 200
// orbitCamera.innerRotationX = 15
const springUseInnerX = computed(()=>{
    return orbitCamera.innerX
})
const springUseInnerY = computed(()=>{
    return orbitCamera.innerY
})
const springUseInnerZ = computed(()=>{
    return orbitCamera.innerZ
})
const springUseInnerRotationX = computed(()=>{
    return orbitCamera.innerRotationX
})
const springUseMinPolarAngle = computed(()=>{
    return orbitCamera.minPolarAngle
})
const springUseMaxPolarAngle = computed(()=>{
    return orbitCamera.maxPolarAngle
})
const camera_springInnerX = useSpring({
    to:springUseInnerX,
    bounce:0
})
const camera_springInnerY = useSpring({
    to:springUseInnerY,
    bounce:0
})
const camera_springInnerZ = useSpring({
    to:springUseInnerZ,
    bounce:0
})
const camera_springInnerRotationX = useSpring({
    to:springUseInnerRotationX,
    bounce:0
})
const camera_springMinPolarAngle = useSpring({
    to:springUseMinPolarAngle,
    bounce:0
})
const camera_springMaxPolarAngle = useSpring({
    to:springUseMaxPolarAngle,
    bounce:0
})

const changeView = () => {
    console.log('changeView');
    

    orbitCamera.innerX = 0
    orbitCamera.innerY = 80
    orbitCamera.innerZ = 260
    orbitCamera.innerRotationX = 15

    
    // orbitCamera.rotationX = 0;
    // orbitCamera.rotationY = 0;
    // orbitCamera.rotationZ = 0;

    orbitCamera.minPolarAngle = 90
    orbitCamera.maxPolarAngle = 105
}
const changeView2 = () => {
    console.log('changeView');
    

    orbitCamera.innerX = 100
    orbitCamera.innerY = 145
    orbitCamera.innerZ = 350
    orbitCamera.innerRotationX = 0

    
    // orbitCamera.rotationX = 0;
    // orbitCamera.rotationY = 0;
    // orbitCamera.rotationZ = 0;

    orbitCamera.minPolarAngle = 90
    orbitCamera.maxPolarAngle = 105
}
const resetView = () => {
    console.log('resetView');
    

    orbitCamera.innerX = 100
    orbitCamera.innerY = 420
    orbitCamera.innerZ = 450
    orbitCamera.innerRotationX = -45

    
    // orbitCamera.rotationX = 0;
    // orbitCamera.rotationY = 0;
    // orbitCamera.rotationZ = 0;

    orbitCamera.minPolarAngle = 45
    orbitCamera.maxPolarAngle = 105
}

export {
    orbitCamera,
    orbitCameraInstance,
    changeView,
    changeView2,
    resetView,

    camera_springInnerX,
    camera_springInnerY,
    camera_springInnerZ,
    camera_springInnerRotationX,

    camera_springMinPolarAngle,
    camera_springMaxPolarAngle,
}