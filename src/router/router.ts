import Game from '../components/Game.vue'
import Load from "../components/Load.vue";
import News from '../components/News.vue'
import Load2 from "../components/Load2.vue"
import Content from '../components/content.vue'

const routes = [
    {
        name:'main',
        path:'/main',
        component:Load
    },
    {
        name:'maze',
        path:'/maze',
        component:Load2,
        // children:[
        //     {
        //         name:'content1',
        //         path:'content1',
        //         component:Content,
                
        //     },
        //     {
        //         name:'content2',
        //         path:'content2',
        //         component:Content,
                
        //     }
        // ]
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
        path:'/:pathMatch(.*)*',
        redirect:'/main'
    }
]

export{
    routes
}