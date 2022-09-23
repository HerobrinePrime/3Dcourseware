<template>
    <div class="process-main">
        <div class="track">
            <div class="track-o"><img class="track-img" src="/UI/process/track.png">
                <img  src="/UI/process/process.png" class="process-img"
                    :class="{'process-on':process === 2,'process-on2':process === 3 || process2 }">
                <img src="/UI/process/track-above.png" class="track-above">
            </div>
            <div class="track-o"><img class="track-img" src="/UI/process/track.png">
                <img  src="/UI/process/process.png" class="process-img"
                    :class="{'process-on':process === 3,'process-on2':process3}">
                <img src="/UI/process/track-above.png" class="track-above">
            </div>
        </div>
        <div class="icon">
            <div class="icon-b"><img src="/UI/process/1.png"></div>
            <div class="icon-b"><img src="/UI/process/2.png"></div>
            <div class="icon-b"><img src="/UI/process/3.png"></div>
        </div>

        <img class="key" src="/UI/commonpanel/key.png">
        <img class="star1" src="/UI/commonpanel/star1.png">
        <img class="star2" src="/UI/commonpanel/star2.png">

        <div class="con">
            <div class="context" v-if="props.process == 1">
                <div class="item">
                    案例分析，了解诈骗
                </div>
                <div class="item" >
                    储备知识，武装自己
                </div>
            </div>
            <div class="context" v-if="props.process == 2">
                <div class="item">
                    直击现场，明辨话术
                </div>
                <div class="item">
                    看破骗局，防范未然
                </div>
            </div>
            <div class="context" v-if="props.process == 3">
                <div class="item">
                    答题巩固，学习技巧
                </div>
                <div class="item">
                    紧握武器，向诈骗发起反抗
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps(["process"])
console.log(props.process);

const process2 = ref(false)
const process3 = ref(false)



if (props.process == 2) {
    setTimeout(()=>{
        process2.value = true
    },2900)
}

if (props.process == 3) {
    setTimeout(()=>{
        process3.value = true
    },2900)
}
</script>

<style lang="less" scoped>
.process-main {

    &>img{
        position: absolute;
        z-index: 40;
    }
    .key{
        transform: scale(1);
        top: 156px;
        left: 77px;
    }
    .star1{
        right: 80px;
        top: 96px;
        transform: scale(1);
    }
    .star2{
        bottom: 30px;
        right: 172px;
        transform: scale(1);
    }

    
    height: 60vh;
    width: 70vw;
    position: absolute;
    z-index: 1020;
    top: 25vh;
    left: 0;
    right: 0;
    margin: auto;
    background-color: rgba(250, 235, 215, 1);
    border-radius: 50px;
    border: 6px solid #fff;
    .con{
        // height: 25vh;
        width: 100%;
        height: 70%;
        position: absolute;
        bottom: 0;

        .context{
            height: 83%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 40px;
            font-family: 'xknlt';
            color: #fff;
            position: relative;
            .item{
                line-height: 55px;
                height: 55px;
                color: #716566;
            }
        }
    }

    .track {
        position: absolute;
        z-index: 0;
        height: 30%;
        width: 60%;
        // background-color: rgba(0, 255, 255, 0.582);
        // top: 0;
        // bottom: 0;
        top: 0.5vh;
        left: 0;
        right: 0;
        margin: auto;
        justify-content: space-between;
        display: flex;
        align-items: center;

        .track-o {
            overflow: hidden;
            position: relative;
            left: -1vw;

            .track-img {
                display: block;
                // height: 10%;
                position: relative;
                z-index: 0;

            }

            .track-above {
                position: absolute;
                z-index: 2;
                top: 0;
            }

            .process-img {
                position: absolute;
                z-index: 1;
                top: 0.5vh;
                left: -32vw;
                max-width: none;
                height: 85%;
                // transition: left 0.5s ease-out 1s;
                // left: 0vw;
            }

            .process-done {
                left: 0;
            }

            .process-on {
                // left: 0vw;
                animation: on 1.4s linear 1.5s forwards;

            }

            .process-on2 {
                animation: on2 0.8s linear infinite;
            }

            @keyframes on {
                from {
                    left: -32vw;
                }

                to {
                    left: -9vw;
                }
            }

            @keyframes on2 {
                from {
                    left: -9vw;
                }

                to {
                    left: 0vw;
                }
            }
        }
    }

    .icon {
        position: absolute;
        z-index: 1;
        height: 30%;
        width: 73%;
        // background-color: rgba(94, 255, 0, 0.413);/
        // top: 0;
        // bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .icon-b {}
    }
}
</style>