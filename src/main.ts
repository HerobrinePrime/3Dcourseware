import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from "vue-router";
import App from './App.vue'
import './index.css'
import 'swiper/dist/css/swiper.min.css'
//element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcon from '@element-plus/icons-vue'

import store from "./store";
import { routes } from "./router/router"

import 'animate.css';

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    console.log('to', to);
    console.log('from', from);

    next()
})


const app = createApp(App)

for (let iconName in ElIcon){
    app.component(iconName, ElIcon[iconName])
  }

app.use(ElementPlus)
app.use(store)
app.use(router)
app.mount('#app')

// window.addEventListener('scroll',()=>{
//     console.log("main.ts"); 
// })