import { ref } from "vue";

const cameraActive = ref(false);
const thirdPersonCameraActive = ref(true);
const mouseControl = ref(true);
const bloom = ref(false)
const editor = ref(false)
const lingoEditor = ref(false)

export {
    cameraActive, thirdPersonCameraActive, mouseControl, bloom, editor, lingoEditor
}