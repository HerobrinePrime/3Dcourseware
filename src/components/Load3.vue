<script setup name="Load2">
    import { computed, ref, watch, onMounted, toRaw } from "@vue/runtime-core";
    import { useRouter } from "vue-router";
    import { useStore } from "vuex";
    import { usePreload } from "lingo3d-vue";
    import { Transition } from "@vue/runtime-dom";
    import Mid from "./Mid.vue";
    import emitter from "../eventBus";
    
    const { dispatch } = useStore();
    
    const progress = usePreload(
      [
        '/models/characters/rabbit-with-wise-eyes.glb',
        '/models/characters/dog-with-black-tail.glb',
        '/models/characters/dog-with-brown-fur.glb',
        '/models/characters/cat-with-orange-skin.glb',
        '/models/characters/rabbit-with-sunglass.glb',
        '/models/characters/black-dog.glb',
        '/models/main/cat.fbx',
        '/models/mid/screen.glb',
        '/svg/arrow.svg',
        '/UI/porter2.png',
        '/env/env1.hdr',
        '/UI/dialog/dialog.png',
        '/UI/dialog/cat.png',
        '/UI/dialog/dog.png',
        '/UI/dialog/rabbit.png',
        '/UI/dialog/next.png',
      ],
      "37.1MB"
    );
    
    // const progress = ref(100)
    
    const loaded = computed(() => {
      return progress.value == 100;
    });
    
    // if (loaded) {
    
    // }
    
    const started = ref(false);
    const getStart = () => {
      started.value = true;
      emitter.emit("midStart")
    };
    

    </script>
    
    <template>
      <Transition name="v1">
        <div class="bc" v-if="!started">
          <div class="wrapper">
            <div class="moji" v-if="!loaded">{{ Math.round(progress) }}%</div>
            <div class="moji" v-else @click="getStart">Start</div>
    
            <div class="load-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 46 46"
                class="base"
              >
                <circle class="a" cx="23" cy="23" r="20" />
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
                <circle class="a" cx="23" cy="23" r="20" />
              </svg>
            </div>
          </div>
        </div>
      </Transition>
      <div class="wrapper" :class="{ show: started }"><Mid /></div>
    
      <div class="load-font" style="font-family: 'hwhp'">asdf</div>
      <div class="load-font" style="font-family: 'xknlt'">asdf</div>
    </template>
    
    <style lang="less" scoped>
    .v1-enter-active,
    .v1-leave-active {
      transition: filter 0.8s ease;
    }
    .v1-leave-from,
    .v1-enter-to {
      filter: brightness(1);
    }
    .v1-leave-to,
    .v1-enter-from {
      filter: brightness(0);
    }
    
    .wrapper {
      height: 100vh;
      width: 100vw;
      opacity: 0;
      transition: opacity 1s ease 0.8s;
      position: absolute;
      z-index: 0;
    }
    .show {
      opacity: 1;
    }
    @font-face {
      font-family: "hwhp";
      src: url("/fonts/hwhp.ttf");
    }
    @font-face {
      font-family: "xknlt";
      src: url("/fonts/xknlt.ttf");
    }
    .load-font {
      position: absolute;
      z-index: -1;
      top: -50px;
    }
    .bc {
      height: 100vh;
      width: 100vw;
      position: absolute;
      z-index: 1;
      left: 0;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url(/stars/stars.webp);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      .wrapper {
        height: 200px;
        width: 200px;
        text-align: center;
        line-height: 200px;
        .moji {
          font-weight: bolder;
          position: relative;
          z-index: 7;
          cursor: pointer;
          color: #aaffee;
          font-size: 30px;
        }
        .load-box {
          height: 200px;
          width: 200px;
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
            overflow: hidden;
            backface-visibility: hidden;
            circle {
              overflow: hidden;
              transition: all 0.2s ease;
              fill: none;
              stroke: #43bcc7b5;
              stroke-miterlimit: 10;
              stroke-width: 2px;
              backface-visibility: hidden;
              transition: stroke 1.1s ease;
            }
          }
          .base {
            opacity: 0.5;
          }
          .loader {
            opacity: 1;
            stroke-dasharray: calc(2 * 3.1416 * 20);
            transform: rotateY(180deg);
            animation-fill-mode: both;
            transition: stroke-dashoffset 1s ease;
          }
        }
        animation: enter 1s ease forwards;
      }
    }
    @keyframes enter {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    </style>