import { useSpring } from "lingo3d-vue"
import { reactive, ref } from "vue"

const characterinnerRotationY = ref(0)
const characterinnerY = ref(0)
const characterOutline = ref(false)

const characterX = ref(0)
const characterY = ref(-554.50)
const characterZ = ref(0)



const characterOver = (on) => {
    characterOutline.value = on
    if (on) {
        characterinnerRotationY.value = 360
        characterinnerY.value = 20
    }
    else {
        characterinnerRotationY.value = 0
        characterinnerY.value = 0
    }
}

const characterspringInnerRotationY = useSpring({
    to: characterinnerRotationY,
    duration: 1500,
})

const characterspringInnerY = useSpring({
    to: characterinnerY,
    duration: 1700,
})


export {
    characterOutline,
    characterOver,

    characterspringInnerRotationY,
    characterinnerRotationY,

    characterspringInnerY,
    characterinnerY,

    characterX,
    characterY,
    characterZ,

}