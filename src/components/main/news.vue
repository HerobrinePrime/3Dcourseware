<template>
  <transition name="news">
    <div class="news" v-if="newsOn">
      <img class="bot" src="/UI/book/bot.png" />
      <div
        class="label"
        :class="{ 'label-on': currentLabel == 1 }"
        @click="currentLabel = 1"
      >
        <span class="title">虚拟交易类</span>
        <span class="box"> </span>
      </div>
      <div
        class="label"
        :class="{ 'label-on': currentLabel == 2 }"
        @click="currentLabel = 2"
      >
        <!-- <img src="/UI/book/bc1.png" /> -->
        <span class="title">冒充他人类</span>
        <span class="box"></span>
      </div>
      <div
        class="label"
        :class="{ 'label-on': currentLabel == 3 }"
        @click="currentLabel = 3"
      >
        <!-- <img src="/UI/book/bc1.png" /> -->
        <span class="title">中奖福利类</span>
        <span class="box"></span>
      </div>
      <div
        class="label"
        :class="{ 'label-on': currentLabel == 4 }"
        @click="currentLabel = 4"
      >
        <!-- <img src="/UI/book/bc1.png" /> -->
        <span class="title">刷单兼职类</span>
        <span class="box"></span>
      </div>
      <img class="fro" src="/UI/book/fro.png" />
      <img class="claw" src="/UI/book/claw.png" />
      <img class="close" src="/UI/book/close.png" @click="exitIntersect" />
      <!-- 1 -->
      <transition name="el-fade-in-linear">
        <div
          class="content"
          v-if="currentLabel == 1"
          :class="{ display: currentLabel == 1 }"
        >
          <!-- :class="{on:onOn,'on-after':onOnAfter}" -->
          <div class="ul-wrapper">
          <ul class="l-half">
            <img class="img1" src="/UI/book/news/img1.webp" />
          <img class="img2" src="/UI/book/news/img2.webp" />
            <li class="line">
              <div class="title">虚拟交易类</div>
            </li>
            <li class="line">
              <div class="text">浙江初中生小朱同学为了交易账号，</div>
            </li>
            <li class="line">
              <div class="text">加了某网友的联系</div>
            </li>
            <li class="line">
              <div class="text">方式并所谓中介群，</div>
            </li>
            <li class="line">
              <div class="text">中介称要收60元的中</div>
            </li>
            <li class="line">
              <div class="text">介费，小朱转了60元红包后，对方</div>
            </li>
            <li class="line">
              <div class="text">又要收600元的担保费，接口担心打</div>
            </li>
            <li class="line">
              <div class="text">钱后小朱改密码，小朱又转了600元</div>
            </li>
            <li class="line">
              <div class="text">，随后中介又提出要收手续费，小朱</div>
            </li>
            <li class="line">
              <div class="text">才发现被骗。</div>
            </li>
            <li class="line">
              <div class="text">河南12岁王同学在游戏中看到有人</div>
            </li>
            <li class="line">
              <div class="text text-right">说可以免费领福利</div>
            </li>
            <li class="line">
              <div class="text text-right">就联系了对方，对</div>
            </li>
            <li class="line">
              <div class="text text-right">方说充值后双倍返</div>
            </li>
          </ul>
          </div>
          <div class="ul-wrapper">
            <ul class="r-half">
              <img class="img3" src="/UI/book/news/img3.webp" />
            <li class="line">
              <div class="text">现，王同学扫码转了钱，对方以“你</div>
            </li>
            <li class="line">
              <div class="text">是未成年人，所以银行卡被冻结了”</div>
            </li>
            <li class="line">
              <div class="text">要他转账负责“赔偿”，又连续发了两</div>
            </li>
            <li class="line">
              <div class="text">个二维码，王同学通过扫码两次转</div>
            </li>
            <li class="line">
              <div class="text">账，共被骗四千余元。</div>
            </li>
            <li class="line">
              <div class="text">宁夏的小贾同学玩手机时，陌生人发</div>
            </li>
            <li class="line">
              <div class="text">来QQ好友验证申请，通过后，对方</div>
            </li>
            <li class="line">
              <div class="text text-right">说有个游戏福利领</div>
            </li>
            <li class="line">
              <div class="text text-right">取活动，点击二维</div>
            </li>
            <li class="line">
              <div class="text text-right">码后，对方以错误</div>
            </li>
            <li class="line">
              <div class="text text-right">操作导致账户被冻</div>
            </li>
            <li class="line">
              <div class="text">结，她会被法院起诉的理由，小贾被</div>
            </li>
            <li class="line">
              <div class="text">骗走了1.9万元。</div>
            </li>
          </ul>
          </div>
          
          
          
        </div>
      </transition>
      <!-- 2 -->
      <transition name="el-fade-in-linear">
        <div
          class="content"
          v-if="currentLabel == 2"
          :class="{ display: currentLabel == 2 }"
        >
          <!-- :class="{on:onOn,'on-after':onOnAfter}" -->
          <div class="ul-wrapper">
          <ul class="l-half">
            <img class="img2-1" src="/UI/book/news/img2-1.webp" />
            <li class="line">
              <div class="title">冒充他人类</div>
            </li>
            <li class="line">
              <div class="text">13岁女孩小曹在网上添加了某明星</div>
            </li>
            <li class="line">
              <div class="text">所谓的QQ号，对方称可以领取粉丝</div>
            </li>
            <li class="line">
              <div class="text text-right">福利，让她发微</div>
            </li>
            <li class="line">
              <div class="text text-right">信收款码过去，</div>
            </li>
            <li class="line">
              <div class="text text-right">小曹照做。不一</div>
            </li>
            <li class="line">
              <div class="text">会，却称由于小曹是未成年人，导致</div>
            </li>
            <li class="line">
              <div class="text">他们公司的账户被冻结，无法进行转</div>
            </li>
            <li class="line">
              <div class="text">账，要用家长的手机进行解冻。小曹</div>
            </li>
            <li class="line">
              <div class="text">按照对方的要求，用妈妈的支付宝扫</div>
            </li>
            <li class="line">
              <div class="text">描对方发来的二维码，最后被骗五千</div>
            </li>
            <li class="line">
              <div class="text">余元。</div>
            </li>
            <!-- <li class="line">
            <div class="text text-right">的特点进行诈骗.</div>
          </li> -->
          </ul>
          </div>
          <div class="ul-wrapper">
                      <ul class="r-half">
                        <img class="img2-2" src="/UI/book/news/img2-2.webp" />
            <li class="line">
              <div class="text">江苏初中生小蔡收到同班同学小孟的</div>
            </li>
            <li class="line">
              <div class="text">消息，称其朋友在医院治疗急需缴纳</div>
            </li>
            <li class="line">
              <div class="text">医药费。对方表示，自己手机银行卡</div>
            </li>
            <li class="line">
              <div class="text">被限额，要转到小蔡卡上，再让小蔡</div>
            </li>
            <li class="line">
              <div class="text">转到他提供的银行卡号上。小蔡当时</div>
            </li>
            <li class="line">
              <div class="text text-right">没有多想就把</div>
            </li>
            <li class="line">
              <div class="text text-right">钱转了过去，</div>
            </li>
            <li class="line">
              <div class="text text-right">但不久对方又</div>
            </li>
            <li class="line">
              <div class="text text-right">让其转额外的</div>
            </li>
            <li class="line">
              <div class="text">几千元，小蔡感觉不对劲便QQ电话</div>
            </li>
            <li class="line">
              <div class="text">与对方确认，却始终无人接听，怀疑</div>
            </li>
            <li class="line">
              <div class="text">被骗后报警。</div>
            </li>
          </ul>
          </div>

          
          
        </div>
      </transition>
      <!-- 3 -->
      <transition name="el-fade-in-linear">
        <div
          class="content"
          v-if="currentLabel == 3"
          :class="{ display: currentLabel == 3 }"
        >
          <!-- :class="{on:onOn,'on-after':onOnAfter}" -->
          <div class="ul-wrapper">
          <ul class="l-half">
                      <img class="img3-1" src="/UI/book/news/img3-1.webp" />
          
          <img class="img3-3" src="/UI/book/news/img3-3.webp" />
            <li class="line">
              <div class="title">中奖福利类</div>
            </li>
            <li class="line">
              <div class="text">福建的初中生小陈喜欢上了某组合，</div>
            </li>
            <li class="line">
              <div class="text">并发现了自称是某团粉丝后援会，便</div>
            </li>
            <li class="line">
              <div class="text text-right">迫不及待地加入，</div>
            </li>
            <li class="line">
              <div class="text text-right">随后发现群内正在</div>
            </li>
            <li class="line">
              <div class="text text-right">组织开展抽奖活动</div>
            </li>
            <li class="line">
              <div class="text">，巧合的是刚入群的小陈竟被告知自</div>
            </li>
            <li class="line">
              <div class="text">己幸运地成为特等奖的中奖者，管理</div>
            </li>
            <li class="line">
              <div class="text">员让其缴纳保证金，如果不同意转账</div>
            </li>
            <li class="line">
              <div class="text">，就列入失信人</div>
            </li>
            <li class="line">
              <div class="text">名单，并以要报</div>
            </li>
            <li class="line">
              <div class="text">警抓捕进行威胁，</div>
            </li>
            <li class="line">
              <div class="text">小陈信以为真，按对方说的操作，最</div>
            </li>
            <li class="line">
              <div class="text">后被骗钱财。</div>
            </li>
          </ul>
          </div>
          <div class="ul-wrapper">
                      <ul class="r-half">
                        <img class="img3-2" src="/UI/book/news/img3-2.webp" />
            <li class="line">
              <div class="text">徐州的王同学在家刷微博，认识了一</div>
            </li>
            <li class="line">
              <div class="text">个网友，对方给了他一个抽奖二维</div>
            </li>
            <li class="line">
              <div class="text text-right">码，称付款388</div>
            </li>
            <li class="line">
              <div class="text text-right">就能参加抽奖，</div>
            </li>
            <li class="line">
              <div class="text text-right">有机会抽苹果手</div>
            </li>
            <li class="line">
              <div class="text text-right">机，王同学就扫</div>
            </li>
            <li class="line">
              <div class="text">描了对方的二维码，充值了388元人</div>
            </li>
            <li class="line">
              <div class="text">民币，后对方称他中了一个苹果12</div>
            </li>
            <li class="line">
              <div class="text">手机，要求王先付5000元保证金才</div>
            </li>
            <li class="line">
              <div class="text">能将手机寄出，同学表示不想要手机</div>
            </li>
            <li class="line">
              <div class="text">了，要求退还388元，被拉黑，才发</div>
            </li>
            <li class="line">
              <div class="text">现自己被骗。</div>
            </li>
            <!-- <li class="line">
            <div class="text">&nbsp;&nbsp;浙江的初中生</div>
          </li>
          <li class="line">
            <div class="text">徐同学用积攒的</div>
          </li>
          <li class="line">
            <div class="text">压岁钱向微信好友购买一台手机，并</div>
          </li>
          <li class="line">
            <div class="text">通过微信零钱扫二维码支付定金</div>
          </li>
          <li class="line">
            <div class="text">1300元给对方，</div>
          </li> -->
          </ul>
          </div>


        </div>
      </transition>
      <!-- 4 -->
      <transition name="el-fade-in-linear">
        <div
          class="content"
          v-if="currentLabel == 4"
          :class="{ display: currentLabel == 4 }"
        >
          <!-- :class="{on:onOn,'on-after':onOnAfter}" -->
          <div class="ul-wrapper">
                      <ul class="l-half">
                        <img class="img4-1" src="/UI/book/news/img4-1.webp" />
            <li class="line">
              <div class="title">刷单兼职类</div>
            </li>
            <li class="line">
              <div class="text">近期刘同学加入了一个学生群，通过</div>
            </li>
            <li class="line">
              <div class="text">兼职刷单来赚取</div>
            </li>
            <li class="line">
              <div class="text">“零花钱”。刚开始</div>
            </li>
            <li class="line">
              <div class="text">刷的几单均顺利完</div>
            </li>
            <li class="line">
              <div class="text">成任务，刘同学尝</div>
            </li>
            <li class="line">
              <div class="text">到了甜头准备“大干一场”。由于无法</div>
            </li>
            <li class="line">
              <div class="text">承受“大单”的任务费用，只得去找父</div>
            </li>
            <li class="line">
              <div class="text">母借钱，母亲深表怀疑并拨打了当地</div>
            </li>
            <li class="line">
              <div class="text">反诈中心的电话咨询，发现骗局，最</div>
            </li>
            <li class="line">
              <div class="text">后成功帮助刘同学挽回损失1.6万余元。</div>
            </li>
            <li class="line">
              <div class="text">&nbsp;&nbsp;15岁初中生丘同学最近收到陌生人</div>
            </li>
            <li class="line">
              <div class="text">的好友申请，之后将其拉入某刷单返</div>
            </li>
          </ul>
          </div>
          <div class="ul-wrapper">          
            <ul class="r-half">
              <img class="img4-2" src="/UI/book/news/img4-2.webp" />
            <li class="line">
              <div class="text">利群，诱导其完成抖音点赞、关注等</div>
            </li>
            <li class="line">
              <div class="text">任务。完成了1单，对方立即转账</div>
            </li>
            <li class="line">
              <div class="text">8.5元，在完成第二单任务后，再次</div>
            </li>
            <li class="line">
              <div class="text">获利10元。就在继续操作过程中，</div>
            </li>
            <li class="line">
              <div class="text text-right">公安反诈中心及</div>
            </li>
            <li class="line">
              <div class="text text-right">时来电劝阻其立</div>
            </li>
            <li class="line">
              <div class="text text-right">即停止刷单操作</div>
            </li>
            <li class="line">
              <div class="text text-right">，向其详细讲解</div>
            </li>
            <li class="line">
              <div class="text">诈骗套路，退群并删除应用。事后同</div>
            </li>
            <li class="line">
              <div class="text">学还说，之前曾有陌生人以一天100</div>
            </li>
            <li class="line">
              <div class="text">元的价格短期租借微信帐号，重新登</div>
            </li>
            <li class="line">
              <div class="text">陆后，因安全原因被限制使用，更是</div>
            </li>
            <li class="line">
              <div class="text">被这种骗局诈骗2000元。</div>
            </li>
          </ul>
          </div>

          
          
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { computed, ref, watch, watchEffect } from "vue";
import jQ from "jquery";

export default {
  props: ["newsOn", "newsChange"],
  setup(props) {
    const currentLabel = ref(0);
    const contentActivate = ref(false);
    const exitIntersect = (e) => {
      currentLabel.value = 0;

      console.log("exitIntersect");

      setTimeout(() => {
        props.newsChange(false);
      }, 500);
    };
    watchEffect(() => {
      if (props.newsOn) {
        setTimeout(() => {
          currentLabel.value = 1;
        }, 500);
      } else {
        exitIntersect();
      }
    });
    watch(currentLabel, (newValue) => {
      contentActivate.value = false;
      setTimeout(() => {
        contentActivate.value = true;
      }, 500);
    });
    const timeSet = new Set();
    watch(contentActivate, (newValue) => {
      if (newValue) {
        console.log("contentActivate");
        // const lines = jQ('.display>.l-half').children('.line')
        const lines = jQ(".display").find(".line");

        setTimeout(()=>{
          jQ(".ul-wrapper").addClass('ul-cli')
        },200)

        // for (let i = 0; i < lines.length; i++) {
        //   let t1 = setTimeout(() => {
        //     jQ(lines[i]).addClass("on").addClass("on-after");
        //   },200);// i * 
        //   timeSet.add(t1);

        //   let t2 = setTimeout(() => {
        //     jQ(lines[i]).removeClass("on");
        //   }, 1200);//i * 200 + 
        //   timeSet.add(t2);
        // }

        // jQ(".display").find("img").addClass("img-on");
      } else {
        console.log("contentDisActivate");
        // jQ(".content").find(".line").removeClass("on-after");
        // jQ(".content").find("img").removeClass("img-on");
        jQ(".ul-wrapper").removeClass('ul-cli')
      }
    });

    return {
      currentLabel,
      exitIntersect,
    };
  },
};
</script>

<style lang="less">
.news {
  height: 656px;
  width: 1069px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
  z-index: 100;
  img {
    position: absolute;
  }
  // background-color: rgba(0, 255, 255, 0.482);
  .bot {
    z-index: 1;
    display: block;
    height: 100%;
    width: 100%;
  }
  .label {
    position: absolute;

    z-index: 40;
    background-color: #faf5fc;
    height: 50px;
    overflow: hidden;
    // width: 155px;
    width: 112px;
    // transform: rotate(5deg);
    align-items: center;
    cursor: pointer;
    transition: width 0.5s ease;
    &::before {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 1;
      transition: opacity 1.2s cubic-bezier(0.215, 0.61, 0.355, 1),
        width 0s linear 1.2s;
      background: #b9a8dc;
      width: 0;
      height: 100%;
      content: "";
    }

    &::after {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0;
      z-index: 3;
      transition: opacity 0.45s cubic-bezier(0.215, 0.61, 0.355, 1);
      background: linear-gradient(to right, #bfb0de 0%, #faf5fc 100%);
      width: 100%;
      height: 100%;
      content: "";
    }

    &:hover::before {
      opacity: 1;
      transition: width 0.65s cubic-bezier(0.215, 0.61, 0.355, 1);
      width: 100%;
    }

    &:hover::after {
      opacity: 1;
      transition: opacity 0.85s cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    .title {
      display: block;
      position: absolute;
      height: 100%;
      width: 140px;
      color: white;
      text-align: center;
      line-height: 50px;
      font-size: 20px;
      z-index: 5;
    }
    .box {
      display: block;
      height: 38px;
      width: 140px;
      position: absolute;
      margin: 6px 7.5px;
      border: 1px solid rgb(222, 212, 164);
      z-index: 4;
    }
    &:nth-of-type(1) {
      top: 100px;
      left: -35px;
    }
    &:nth-of-type(2) {
      top: 200px;
      left: -35px;
    }
    &:nth-of-type(3) {
      top: 300px;
      left: -35px;
    }
    &:nth-of-type(4) {
      top: 400px;
      left: -35px;
    }
  }
  .label-on {
    // top: 100px !important;
    height: 50.5px;
    width: 155px;
    &::before {
      opacity: 1;
      width: 100%;
    }
    &::after {
      opacity: 1;
    }
  }
  // .label-on-2 {
  //   // top: 172.35px !important;
  //   width: 155px;
  // }
  // .label-on-3 {
  //   // top: 232.35px !important;
  //   width: 155px;
  // }
  // .label-on-4 {
  //   // top: 292.35px !important;
  //   width: 155px;
  // }
  .fro {
    z-index: 3;
    display: block;
    height: 97%;
    width: 85%;
    left: 7%;
    top: 1%;
  }
  //正文
  .content {
    height: 86%;
    width: 75%;
    position: absolute;
    top: 6%;
    left: 12.5%;
    z-index: 5;
    .ul-wrapper{
      &:nth-of-type(2){
        left: 55%;
      }
    }
    // background-color: rgba(250, 235, 215, 0.584);
    ul {
      position: absolute;
      top: 0;
      height: 100%;
      width: 352.74px;
      z-index: 0;
      transition: width 0.65s cubic-bezier(0.215, 0.61, 0.355, 1);
      // background-color: rgba(0, 255, 2550, 0.448);
      .line {
        position: relative;
        // margin: 2% 0;
        overflow: hidden;
        // height: 7%;
        // opacity: 0;
        width: 100%;
        // background-color: #b9a8dcbd;
        transition: width 0.65s cubic-bezier(0.215, 0.61, 0.355, 1);
        &::before {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          z-index: -1;
          transition: opacity 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s,
          width 0s linear 1.2s;
          // background: #b9a8dc;
          width: 0;
          height: 100%;
          content: "";
        }
        &::after {
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.45s cubic-bezier(0.215, 0.61, 0.355, 1);
          // background: linear-gradient(to right, #bfb0de 0%, #faf5fc 100%);
          width: 100%;
          height: 100%;
          content: "";
        }

        //2
        // &:nth-of-type(2){
        //   transition-delay: @del * 1;
        //   &::after{
        //     transition-delay: @del * 1;
        //   }
        // }
        // //3
        // &:nth-of-type(3){
        //   transition-delay: @del * 2;
        //   &::after{
        //     transition-delay: @del * 2;
        //   }
        // }
        // //4
        // &:nth-of-type(4){
        //   transition-delay:  @del * 3;
        //   &::after{
        //     transition-delay:  @del * 3;
        //   }
        // }
        // &:nth-of-type(5){
        //   transition-delay:  @del * 4;
        //   &::after{
        //     transition-delay:  @del * 4;
        //   }
        // }
        // &:nth-of-type(6){
        //   transition-delay:  @del * 5;
        //   &::after{
        //     transition-delay:  @del * 5;
        //   }
        // }
        // &:nth-of-type(7){
        //   transition-delay:  @del * 6;
        //   &::after{
        //     transition-delay:  @del * 6;
        //   }
        // }
        // &:nth-of-type(8){
        //   transition-delay:  @del * 7;
        //   &::after{
        //     transition-delay:  @del * 7;
        //   }
        // }

        div {
          width: 352.76px;
          color: rgba(165, 165, 165, 1);
        }
        .title {
          font-family: "hwhp";
          font-size: 42px;
          text-align: center;
          // font-weight: ;
          margin: 0 0 10px 0;
        }
        .text {
          line-height: 36px;
          text-align: left;
          font-size: 20px;
          letter-spacing: 2px;
        }
        .text-right {
          text-align: right;
        }
      }
      .on {
        // li{
        width: 100%;
        &::before {
          opacity: 1;
          transition: width 0.65s cubic-bezier(0.215, 0.61, 0.355, 1);
          width: 100%;
        }
        &::after {
          opacity: 1;
          transition: opacity 0.85s cubic-bezier(0.215, 0.61, 0.355, 1);
        }

        // //2
        // &:nth-of-type(2){
        //   transition-delay:  @del * 1;
        //   &::before{
        //     transition-delay:  @del * 1;
        //   }
        //   &::after{
        //     transition-delay:  @del * 1;
        //   }
        // }
        // //3
        // &:nth-of-type(3){
        //   transition-delay:  @del * 2;
        //   &::before{
        //     transition-delay:  @del * 2;
        //   }
        //   &::after{
        //     transition-delay:  @del * 2;
        //   }
        // }
        // &:nth-of-type(4){
        //   transition-delay:  @del * 3;
        //   &::before{
        //     transition-delay:  @del * 3;
        //   }
        //   &::after{
        //     transition-delay:  @del * 3;
        //   }
        // }
        // &:nth-of-type(5){
        //   transition-delay:  @del * 4;
        //   &::before{
        //     transition-delay:  @del * 4;
        //   }
        //   &::after{
        //     transition-delay:  @del * 4;
        //   }
        // }
        // &:nth-of-type(6){
        //   transition-delay:  @del * 5;
        //   &::before{
        //     transition-delay:  @del * 5;
        //   }
        //   &::after{
        //     transition-delay:  @del * 5;
        //   }
        // }
        // &:nth-of-type(7){
        //   transition-delay:  @del * 6;
        //   &::before{
        //     transition-delay:  @del * 6;
        //   }
        //   &::after{
        //     transition-delay:  @del * 6;
        //   }
        // }
        // &:nth-of-type(8){
        //   transition-delay:  @del * 7;
        //   &::before{
        //     transition-delay:  @del * 7;
        //   }
        //   &::after{
        //     transition-delay:  @del * 7;
        //   }
        // }
        // }
      }

      .on-after {
        width: 100%;
      }

      .line-disapper {
        width: 0 !important;
        transition: width 0s 0s !important;
      }
    }
    .ul-wrapper{
      overflow: hidden;
      position: absolute;
      height: 100%;
      width: 0;
      transition: width 0.65s cubic-bezier(0.215, 0.61, 0.355, 1);
      .l-half {
        left: 0;
      }
      .r-half {
        // right: 2%;
        padding-top: 8px;
      }
    }
    .ul-cli{
      width: 44%;
    }
    img {
      display: block;
      position: absolute;
      z-index: -1;
      opacity: 1;
    }

    .img-disapper {
      opacity: 0 !important;
      transition: opacity 0s 0s !important;
    }
    .img1 {
      height: 102px;
      // left: 26%;
      right: 20px;
      top: 21%;
      // transition: opacity 0.65s ease 0.4s;
    }
    .img2 {
      height: 106px;
      left: 1%;
      bottom: 5%;
      transition: opacity 0.65s ease 0.4s;
    }
    .img3 {
      height: 137px;
      left: 2%;
      bottom: 29%;
      transition: opacity 0.65s ease 0.4s;
    }
    .img2-1 {
      height: 119px;
      left: 1%;
      top: 25%;
      transition: opacity 0.65s ease 1.55s;
    }
    .img2-2 {
      height: 130px;
      left: 2%;
      bottom: 42%;
      transition: opacity 0.65s ease 4.7s;
    }
    .img3-1 {
      height: 119px;
      left: 0%;
      top: 25%;
      transition: opacity 0.65s ease 1.55s;
    }
    .img3-2 {
      height: 146px;
      left: 0.5%;
      top: 14%;
      transition: opacity 0.65s ease 4.4s;
    }
    .img3-3 {
      height: 110px;
      right: 0%;
      bottom: 17%;
      transition: opacity 0.65s ease 3s;
    }
    .img4-1 {
      height: 145px;
      right: 5%;
      top: 20%;
      transition: opacity 0.65s ease 1.55s;
    }
    .img4-2 {
      height: 137px;
      left: 1%;
      top: 29%;
      transition: opacity 0.65s ease 4.9s;
    }
  }
  .claw {
    display: block;
    position: absolute;
    height: 50px;
    width: 50px;
    z-index: 6;
    bottom: 60px;
    right: 150px;
  }
  .close {
    display: block;
    position: absolute;
    height: 70px;
    z-index: 6;
    top: 25px;
    right: -5px;
    cursor: pointer;
  }
}
.news-enter-active,
.news-leave-active {
  transition: opacity 0.5s cubic-bezier(0.42, 0, 0.58, 1) 0s,
    transform 0.5s cubic-bezier(0.42, 0, 0.58, 1) 0s;
}
.news-enter-from,
.news-leave-to {
  // transform: translateX(-100vw);
  opacity: 0;
}
.news-enter-to,
.news-leave-from {
  // transform: translateX(0);
  opacity: 1;
}
</style>