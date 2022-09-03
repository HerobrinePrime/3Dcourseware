import Load from "../components/Load.vue";
import Load2 from "../components/Load2.vue"

import Room from "../components/spaces/room.vue"

const routes = [
    {
        name: 'main',
        path: '/main',
        component: Load
    },
    {
        name: 'maze',
        path: '/maze',
        component: Load2,
        meta:{
            keepAlive:true
        }
    },
    {
        name: 'Room',
        path: '/room',
        component: Room,
    },
    // {
    //     name:'game',
    //     path:'/game',
    //     component:Game
    // },
    // {
    //     name:'news',
    //     path:'/news',
    //     component:News
    // },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/main'
    }
]

export {
    routes
}