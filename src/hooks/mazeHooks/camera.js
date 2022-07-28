import { useSpring } from "lingo3d-vue"
import { reactive, ref } from "vue"

const mouseControl = ref(false)
const cameraPosition = reactive({
    x: 64.55,
    y: 102.33,
    z: -84.55,
    fov:75,
})

const autoRotate = ref(false)
const autoRotateSpeed = ref(-1)
const enableDamping = ref(true)

const rotationX = ref(0)
const rotationY = ref(0)
const rotationZ = ref(0)
const innerRotationX = ref(-31.2)
const innerRotationY = ref(37.7)
const innerRotationZ = ref(20.3)
const innerX = ref(1000)
const innerY = ref(1000)
const innerZ = ref(1000)
const minPolarAngle = ref(5)
const maxPolarAngle = ref(175)


const springRotationX = useSpring({
    to: rotationX,
    bounce:0,
    duration:500
})
const springRotationY = useSpring({
    to: rotationY,
    bounce: 0,
    duration:500
})
const springRotationZ = useSpring({
    to: rotationZ,
    bounce: 0,
    duration:500
})
const springInnerRotationX = useSpring({
    to: innerRotationX,
    bounce: 0
})
const springInnerRotationY = useSpring({
    to: innerRotationY,
    bounce: 0
})
const springInnerRotationZ = useSpring({
    to: innerRotationZ,
    bounce: 0
})
const springInnerX = useSpring({
    to: innerX,
    bounce: 0
})
const springInnerY = useSpring({
    to: innerY,
    bounce: 0
})
const springInnerZ = useSpring({
    to: innerZ,
    bounce: 0
})
const springMinPolarAngle = useSpring({
    to: minPolarAngle,
    bounce: 0
})
const springMaxPolarAngle = useSpring({
    to: maxPolarAngle,
    bounce: 0
})

const changeView = () => {
    console.log('changeView');
    autoRotate.value = true

    innerX.value = 100
    innerY.value = 420
    innerZ.value = 450
    innerRotationX.value = -45
    innerRotationY.value = 0
    innerRotationZ.value = 0

    minPolarAngle.value = 45
    maxPolarAngle.value = 105

    mouseControl.value = 'drag'
}
const resetView = () => {
    console.log('resetView');
    mouseControl.value = false
    autoRotate.value = false



    innerX.value = 1000
    innerY.value = 1000
    innerZ.value = 1000
    innerRotationX.value = -31.2
    innerRotationY.value = 37.7
    innerRotationZ.value = 20.3

    minPolarAngle.value = 5
    maxPolarAngle.value = 175

    // setTimeout(() => {
    rotationX.value = 0.01
    rotationY.value = 0.01
    rotationZ.value = 0.01

    setTimeout(() => {
        rotationX.value = 0
        rotationY.value = 0
        rotationZ.value = 0
    }, 500)

    // }, 5000)


}

export {
    mouseControl,
    cameraPosition,

    rotationX,
    rotationY,
    rotationZ,
    innerRotationX,
    innerRotationY,
    innerRotationZ,
    innerX,
    innerY,
    innerZ,
    minPolarAngle,
    maxPolarAngle,

    springRotationX,
    springRotationY,
    springRotationZ,
    springInnerRotationX,
    springInnerRotationY,
    springInnerRotationZ,
    springInnerX,
    springInnerY,
    springInnerZ,
    springMinPolarAngle,
    springMaxPolarAngle,
    autoRotate,
    autoRotateSpeed,
    enableDamping,

    changeView,
    resetView,

}