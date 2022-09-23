<template>
<div class="done-main">
    <div class="content" v-if="props.doneNum == 1">
        恭喜你所掌握的诈骗类型UP！{{props.newsCount}}/4
    </div>
    <div class="content" v-if="props.doneNum == 2">
        恭喜你已识破{{props.doneCount}}/3的骗局
    </div>
    <div class="content" v-if="props.doneNum == 3">
        恭喜你已获得{{store.state.datas.treasures}}/4的防范锦囊
    </div>
    <div class="content" v-if="props.doneNum == 4">
        反诈成功！
    </div>
    <div class="content" v-if="props.doneNum == 5">
        挑战成功！
    </div>
    <div class="close" @click="doneOff">
        确  定
    </div>

    <img class="key" src="/UI/commonpanel/key.png">
    <img class="star1" src="/UI/commonpanel/star1.png">
    <img class="star2" src="/UI/commonpanel/star2.png">
</div>
</template>

<script setup>
import { ref } from "vue" 
import emitter from '../eventBus.js'
import { useStore } from "vuex";

const props = defineProps(["doneNum","newsCount","doneCount"])
const store = useStore()

const doneOff = ()=>{
    emitter.emit('doneOff');
}
</script>

<style lang="less" scoped>
.done-main{
    &>img{
        position: absolute;
        z-index: 40;
    }
    .key{
        transform: scale(0.8);
    top: 23px;
    left: -3px;
    }
    .star1{
        right: 10px;
        top: 48px;
        transform: scale(0.9);
    }
    .star2{
        bottom: 30px;
        right: 172px;
        transform: scale(0.5);
    }

    height: 370px;
    width: 568px;
    background-color: #ffead9;
    border-radius: 40px;
    color: #000;
    font-family: 'xknlt';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    border: 6px solid #fff;
    .content{
        height: 100px;
    width: 100%;
    top: 78px;
    position: relative;
    z-index: 50;
    text-align: center;
    color: #716566;
    font-size: 44px;
    line-height: 67px;
    }
    .close{
        text-align: center;
        position: absolute;
        height: 54px;
        width: 170px;
        font-size: 40px;
        line-height: 54px;
        bottom: 50px;
        left: 0;
        right: 0;
        margin: auto;
        border: 2px solid #716566;
        border-radius: 15px;
        box-sizing: content-box;
        text-shadow: #fff -1px 0 10px;
        cursor: pointer;
        color: #716566;
        z-index: 20;
    }
}
</style>