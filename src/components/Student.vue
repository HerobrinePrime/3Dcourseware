<template>
  <div class="main" @mousewheel.stop="" v-loading="loading">
    <div class="back-banner">
      <i class="iconfont icon-xiangzuo1" @click="back"></i>
    </div>
    <div class="banner">
      <div class="info">
        <div class="name">姓名：{{ studentInfo?._doc?.name }}</div>
        <div class="num">学号：{{ studentInfo?._doc?.student_id }}</div>
      </div>
      <!-- <div class="line" style="width:100%"></div> -->
    </div>
    <div class="datas">
      <div class="process">
        <div class="con"><span>学习进度</span></div>
        <div class="cir">
          <div class="load-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 46 46"
              class="base"
            >
              <circle class="a" cx="23" cy="23" r="17" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 46 46"
              class="loader"
              :style="{
                strokeDashoffset: `calc(-2 * 3.1416 * 20 * (1 - ${
                  progress / 100
                }))`,
              }"
            >
              <circle
                class="a"
                cx="23"
                cy="23"
                r="17"
                style="stroke: #c6cfff"
              />
            </svg>
          </div>
          <div class="moji">{{ progress }}%</div>
        </div>
      </div>
      <div class="process">
        <div class="con"><span>正确率</span></div>
        <div class="cir">
          <div class="load-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 46 46"
              class="base"
            >
              <circle class="a" cx="23" cy="23" r="17" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 46 46"
              class="loader"
              :style="{
                strokeDashoffset: `calc(-2 * 3.1416 * 20 * (1 - ${
                  rate / 100
                }))`,
              }"
            >
              <circle
                class="a"
                cx="23"
                cy="23"
                r="17"
                style="stroke: #e8d3ff"
              />
            </svg>
          </div>
          <div class="moji">{{ rate }}%</div>
        </div>
      </div>
    </div>

    <div class="barChart" ref="chart1"></div>

    <div class="radarChart" ref="chart2"></div>

    <div class="lineChart" ref="chart3"></div>

    <div class="feedback" v-loading="sending">
      <div class="title">教师反馈</div>
      <div class="tags">
        <span class="strengthen">需加强类型：</span>
        <el-tag
          :key="tag"
          v-for="tag in studentInfo?._doc?.teacher_feedback_types"
          color="#fdfaff"
          :disable-transitions="false"
        >
          {{ types[tag].name }}
        </el-tag>
       
      </div>
      <div class="content" :class="reject">
        {{studentInfo?._doc?.teacher_feedback}}
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store/index.ts";
import * as echarts from "echarts";
import { request } from "../request";
import emitter from "../eventBus";
import { Transition } from "@vue/runtime-dom";
import theme from "../theme.json";
echarts.registerTheme("theme", theme);

import { ElLoading } from "element-plus";
import {defineProps} from 'vue'

export default {
  data() {
    return {
      // progress: 0,
      types: [],
      studentInfo: {},
 

      reject: false,
      sending: false,
      //需要提交
      msg: "",
      commitTypes: [],

      loading: true,

      // loadingInstance:ElLoading.service({
      //   target:'.main',
      //   body:true,
      // })
    };
  },
  props: ["id"],
  computed: {
    progress() {
      console.log("process");
      if (this.studentInfo.process) {
        return this.studentInfo.process;
      } else return 0;
    },
    rate() {
      console.log("rate");
      console.log(this.studentInfo);
      if (!this.studentInfo.typeStatus) return 0;
      let t = 0;
      let f = 0;
      this.studentInfo.typeStatus?.forEach(({ errCount, resCount }) => {
        t += resCount;
        f += errCount;
      });
      if (isNaN((t * 100) / (t + f))) return 0;
      console.log(Math.ceil((t * 100) / (t + f)));
      return Math.ceil((t * 100) / (t + f));
      // return 15
    },
    //bar
    resCount() {
      let res = [];
      this.studentInfo.weekStatus?.forEach((ele) => {
        res?.push(ele.resCount);
      });
      return res;
    },
    errCount() {
      let res = [];
      this.studentInfo.weekStatus?.forEach((ele) => {
        res?.push(-ele.errCount);
      });
      return res;
    },
    grade() {
      let res = [];
      this.studentInfo.weekStatus?.forEach((ele) => {
        res?.push(ele.grade);
      });
      return res;
    },
    //radar
    indicator() {
      const arr = [];
      this.types?.forEach((ele) => {
        arr?.push({
          name: ele.name,
          max: 1,
        });
      });
      return arr;
    },
    radarRates() {
      const arr = [];
      this.studentInfo.typeStatus?.forEach(({ errCount, resCount }) => {
        arr?.push(resCount / (resCount + errCount));
      });
      return arr;
    },
  },
  watch: {
    studentInfo: {
      async handler(newValue) {
        // this.loadingInstance.close()
        // this.loadingInstance.close();
        setTimeout(() => {
          
          this.$nextTick(() => {
            const chart1 = echarts.init(this.$refs.chart1, "theme");
            const chart3 = echarts.init(this.$refs.chart3, "theme");
            const chart2 = echarts.init(this.$refs.chart2, "theme");

            console.log("11" + this.data);

            chart1.setOption({
              title: {
                text: "  做题情况",
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "shadow",
                },
              },
              legend: {
                data: ["错误数", "Income"],
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
              yAxis: [
                {
                  type: "value",
                },
              ],
              xAxis: [
                {
                  type: "category",
                  axisTick: {
                    show: false,
                  },
                  data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                },
              ],
              series: [
                {
                  name: "Income",
                  type: "bar",
                  stack: "Total",
                  label: {
                    show: true,
                  },
                  emphasis: {
                    focus: "series",
                  },
                  data: this.resCount,
                  barWidth: "45%",
                  itemStyle: {},
                },
                {
                  name: "错误数",
                  type: "bar",
                  stack: "Total",
                  label: {
                    show: true,
                    position: "left",
                  },
                  emphasis: {
                    focus: "series",
                  },
                  data: this.errCount,
                  // data:[120, 200, 150],
                  itemStyle: {},
                },
              ],
            });

            chart2.setOption({
              title: {
                text: "",
              },
              legend: {
                data: ["各类型正确率"],
              },
              radar: {
                // shape: 'circle',
                indicator: this.indicator,
              },
              series: [
                {
                  // name: "Budget vs spending",
                  type: "radar",
                  data: [
                    {
                      value: this.radarRates,
                      name: "各类型正确率",
                    },
                    // {
                    //   value: [0.34, 0.65, 0.98, 0.5, 0.4, 0.52],
                    //   name: "Actual Spending",
                    // },
                  ],
                },
              ],
            });

            chart3.setOption({
              title: {
                text: "Stacked Line",
              },
              tooltip: {
                trigger: "axis",
              },
              legend: {
                data: ["分 数"],
              },
              grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
              },
              toolbox: {
                feature: {
                  saveAsImage: {},
                },
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: ["Sun", "Tue", "Wed", "Thu", "Fri", "Sat", "Mon"],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  name: "分 数",
                  type: "line",
                  smooth: true,
                  stack: "Total",
                  data: this.grade,
                },
              ],
            });
          });
        }, 500);
      },
      immediate: true,
    },
  },
  mounted() {
    console.log("***********")
    console.log(this.id);

    const res = request({
      url: "/student/getWeekStatus",
      method: "POST",
      data: {
        id: this.id,
      },
    });
    res.then((res) => {
      console.log(res.data.data);
      this.studentInfo = res.data.data;
      this.types = res.data.data.types;
      this.loading = false;
      // this.progress = 45
    });
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      let { type } = this.types.find((ele) => {
        return ele.name == tag;
      });
      this.commitTypes.splice(this.commitTypes.indexOf(type), 1);
      // console.log("commitTypes:", this.commitTypes);
    },
    handleSelect(type) {
      this.dynamicTags?.push(type.name);
      this.commitTypes?.push(type.type);
    },
    back() {
      emitter.emit("studentOff");
    },
  },
};
</script>




<style lang="less" scoped>
.main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 500px;
  }
  &::-webkit-scrollbar-track {
    -webkit-appearance: none;
    background-color: transparent;
    height: 500px;
  }
  &::-webkit-scrollbar {
    // -webkit-appearance: none;
    width: 5px;
    // height: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2.5px;
  }
  &::-webkit-scrollbar-thumb {
    -webkit-appearance: none;
    width: 2px;
    height: 8px;
    background-color: rgba(191, 191, 191, 0.485);
  }
  /* text-align: center; */
  color: #2c3e50;

  height: calc(100% - 80px);
  width: calc(100% - 160px);
  background-color: rgba(255, 255, 255, 0.95);
  position: absolute;
  right: 0;
  bottom: 0;
  overflow: auto;

  border-radius: 10px;
  top: 7.5%;
  left: 12.5%;
  height: 85%;
  position: relative;
  width: 75%;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  & > div {
    margin-top: 20px;
    box-shadow: 0 5px 10px 0 rgb(50 50 93 / 35%);
  }
  .back-banner {
    height: 35px;
    width: 100%;
    margin-top: 0;
    box-shadow: none;
    i {
      font-size: 25px;
      cursor: pointer;
    }
  }
  .banner {
    position: relative;
    top: -20px;
    // left: 15px;
    height: 40px;
    width: 100%;
    // background-color: #f1f1f1;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // padding-left: 30px;
    // box-shadow: 0 0 10px 1px rgba(158, 158, 158, 0.482);
    // border-bottom: 1px solid #a1a1a1;
    .info {
      display: flex;
      align-items: baseline;
      color: #4f4c4c;
      height: 100%;
      div {
        height: 100%;
        line-height: 40px;
      }
      .name {
        margin-left: 20px;
        margin-right: 15px;
        display: inline-block;
        font-size: 18px;

        // margin-left: 20px;
        // margin-right: 15px;
        // display: inline-block;
        // font-size: 18px;
        // background-color: #cfe8fc;
        // padding: 5px 10px;
        // box-sizing: content-box;
        // border-radius: 10px;
        // color: #8c8c8e;
      }
      .num {
        display: inline-block;
        font-size: 14px;
      }
    }
    .icon {
      height: 60px;
      width: 60px;
      // background-color: #f7c5ff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 15px 2px rgb(158, 158, 158);
      img {
        display: 100%;
        height: 100%;
        width: 100%;
        border-radius: 10px;
      }
    }
  }

  .datas {
    width: 45%;
    height: 380px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
    box-shadow: none;
    .process {
      position: relative;
      height: 45%;
      width: 100%;
      // background-color: rgba(225, 254, 245, 1);
      box-shadow: 0 5px 10px 0 rgb(50 50 93 / 35%);
      border-radius: 10px;
      display: flex;
      .con {
        height: 100%;
        flex: 4;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 22px;
          color: #666666;
          font-weight: bold;
        }
      }
      .cir {
        height: 100%;
        flex: 5;
        position: relative;
        .moji {
          height: 40px;
          // width: 45px;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          text-align: center;
          line-height: 40px;
          font-size: 30px;
        }
        .load-box {
          height: 200px;
          max-width: 170px;
          transition: 0.8s ease;
          position: absolute;
          z-index: 5;
          right: 0;
          top: -0;
          left: 0;
          bottom: 0;
          margin: auto;
          svg {
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto 0;
            overflow: hidden;
            backface-visibility: hidden;
            circle {
              overflow: hidden;
              transition: all 0.2s ease;
              fill: none;
              //   stroke: #000000b5;
              stroke-miterlimit: 10;
              stroke-width: 2px;
              backface-visibility: hidden;
              transition: stroke 1.1s ease;
            }
          }
          .base {
            opacity: 0.5;
            circle {
              stroke: #eeeef0bc;
            }
          }
          .loader {
            opacity: 1;
            stroke-dasharray: calc(2 * 3.1416 * 20);
            transform: rotateZ(-90deg) rotateX(0deg);
            animation-fill-mode: both;
            transition: stroke-dashoffset 1s ease 0.5s;
            circle {
              stroke: #f7c5ff;
              // stroke-width: 3px;
            }
          }
        }
        animation: enter 1s ease forwards;
      }
    }
  }

  .feedback {
    position: relative;
    width: 100%;
    // height: vh;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0px 0px 10px 2px rgb(223, 223, 223);
    .title {
      height: 70px;
      width: 100%;
      //background-color: rgb(252, 252, 240);
      border-bottom: 1px solid #f0f0f0;
      line-height: 70px;
      padding: 0 20px;
      font-weight: bolder;
      font-size: larger;
      i {
        cursor: pointer;
        &::before {
          color: #b6b7e9;
        }
      }
    }
    .tags {
      padding: 10px 5px;
      padding-left: 18px;
      // border-bottom: 1px solid rgb(207, 207, 207);
      // border-bottom: 1px solid rgb(207, 207, 207);
      .strengthen {
        font-weight: bold;
        font-size: 15px;
        color: #666666;
      }
      .el-tag {
        margin: 0 5px;
      }
      .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
      }
      .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
      }
      .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
    }
    .content {
      // height: 35vh;
      width: 100%;
      position: relative;
      // background-color: #f7c5ff;
      display: flex;
      padding: 10px 20px;
      box-sizing: border-box;
      .select {
        height: 100%;
        width: 32%;
        display: flex;
        flex-direction: column;
      }
      .input {
        height: 100%;
        position: relative;
        // background-color: #f7c5ff;
      }
    }
    .button-container {
      margin: 0 auto 0px;
      padding: 10px 0px;
      box-sizing: content-box;
      height: 40px;
      width: calc(100% - 0px);
      //border-top: 1px solid #dcdfe6;
      text-align: center;
    }
  }
  .barChart {
    height: 380px;
    width: 50%;
    // background-color: rgb(243, 249, 255);
    border-radius: 10px;
    position: relative;
    // margin:0 auto;
  }
  .radarChart {
    height: 600px;
    width: 100%;
    border-radius: 10px;
    // background-color: aliceblue;
    padding: 30px;
    box-sizing: border-box;
  }
  .lineChart {
    height: 400px;
    width: 100%;
    // background-color: rgba(225, 254, 245, 0.4);
    border-radius: 20px;
  }
}
.reject textarea {
  border-color: #d94646 !important;
}
.reject::after {
  content: "请填写反馈信息";
  color: #d94646;
  font-size: 12px;
  /* line-height: 1; */
  /* padding-top: 4px; */
  position: absolute;
  bottom: -5px;
  left: 25px;
}
</style>
