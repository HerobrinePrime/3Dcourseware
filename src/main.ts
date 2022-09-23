import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from "vue-router";
import App from './App.vue'
import './index.css'
import './swiper.min.css'
import 'swiper/dist/css/swiper.min.css'
//element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcon from '@element-plus/icons-vue'

import store from "./store";
import { routes } from "./router/router"

import 'animate.css';

import Reward from './components/Reward.vue'
import Done from './components/Done.vue'
import NotePanel from './components/NotePanel.vue'
import Report from './components/Report.vue'

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
app.component(Reward);
app.component(Done);
app.component(NotePanel);
app.component(Report);

// window.addEventListener('scroll',()=>{
//     console.log("main.ts"); 
// })