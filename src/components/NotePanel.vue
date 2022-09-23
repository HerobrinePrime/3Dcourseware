<template>
<div class="note-main">
    <img class="back" src="/UI/screen/end/0.png">
    <div class="context">
        <div class="contexts" v-if="props.endCount == 1">
            <div class="con">虚拟交易，熟人骗局</div>
            <div class="con">中奖福利，刷单兼职</div>
            <div class="con">诈骗类型千千万，万万不可入坑</div>
        </div>
        <div class="contexts" v-if="props.endCount == 2">
            <div class="con">诈骗就在我们身边，不留心就会深陷其中</div>
            <div class="con">涉及金钱、信息定要警惕</div>
            <div class="con">识别骗局，及时止损，回头是岸</div>
        </div>
        <div class="close" @click="noteOff">
            确  定
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
import { ref } from "vue" 
import emitter from '../eventBus.js'

const props = defineProps(["endCount"])

const noteOff = ()=>{
    emitter.emit("noteOFf")
}
</script>

<style lang="less" scoped>
.note-main{
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1050;
    display: flex;
    justify-content: center;
    align-items: center;
    .back{
        display: block;
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 0;
        top: 0;
        left: 0;
    }
    .context{
        text-align: center;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .contexts{
            .con{
                color: #716566;
                font-family: "xknlt";
                font-size: 40px;
            }
        }
        .close{
            text-align: center;
            height: 54px;
            width: 170px;
            font-size: 40px;
            line-height: 54px;
            border: 2px solid #716566;
            border-radius: 15px;
            box-sizing: content-box;
            text-shadow: #fff -1px 0 10px;
            cursor: pointer;
            font-family: 'xknlt';
            color: #716566;
            margin-top: 20px;
        }
    }
}
</style>