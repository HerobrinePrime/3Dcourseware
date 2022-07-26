import { createStore } from "vuex";
import { request } from '../request/index.js'

export default createStore({
    state: {
        x: 0,
        y: 400,
        z: 0,
        student: {
            portrait:''
        },//不一定是学生，老师的信息也存进去
        result: '',
        bag: {
            bagOn: true,
            keys: new Set()
        },
        //收集防范
        defences:new Map([['key1',false],['key2',false],['key3',false],['key4',false]]),
        //自言自语
        hanashi: [
            
            [
                'hitogoto',
                'second',
                'third',
            ],
            [
                '宿命なのかい？',
                '自分のゆく道は、自分選びたいんですけど',
                'いまさらもはや止められない',
            ],
            [
                '宿命なのかい？',
                '自分のゆく道は、自分選びたいんですけど',
                'いまさらもはや止められない',
            ],
            [
                '宿命なのかい？',
                '自分のゆく道は、自分選びたいんですけど',
                'いまさらもはや止められない',
            ],
        ],
        //对话
        kaiwa: [
            [
                { c: true, kotoba: 'c1:first' },
                { c: false, kotoba: 'c2:second' },
                { c: false, kotoba: 'c2:third' },
                { c: true, kotoba: 'c1:forth' },
            ],
            [
                { c: false, kotoba: '1 1' },
                { c: true, kotoba: '2 2' },
                { c: false, kotoba: '1 3' },
                { c: false, kotoba: '1 4' },
                { c: true, kotoba: '2 5' },
                { c: true, kotoba: '2 6' },
                { c: true, kotoba: '2 7' },
                { c: false, kotoba: '1 8' },
            ],
            [
                { c: false, kotoba: 'asdf' },
                { c: true, kotoba: 'asdf' },
                { c: false, kotoba: 'dfghj' },
                { c: false, kotoba: 'ryfgh' },
                { c: true, kotoba: 'dfgh e4gfb' },
                { c: true, kotoba: 'dtfhyswer5' },
                { c: true, kotoba: 'dgs48741' },
                { c: false, kotoba: 'ending' },
            ],
        ],
        //固定
        constContent: [
            //固定1
            [
                { jibun: false, kotoba: '在吗，有急事，我姐姐刚刚突然出了车祸，现在在医院里抢救', },
                { jibun: true, kotoba: '怎么会这样，她还好吗', },
                { jibun: false, kotoba: '很严重，现在还没醒过来', },
                { jibun: true, kotoba: '医生怎么说', },
                { jibun: false, kotoba: '医生说要先交费才能做手术，我爸妈不在身边，我身上钱不够，急需手术费', },
                { jibun: true, kotoba: '大概要多少', },
                { jibun: false, kotoba: '2000左右吧，我到时候肯定会还你', },
            ],
            //固定2
            [
                {jibun:false,kotoba:'你好啊，恭喜你成为微博幸运用户'},
                {jibun:true,kotoba:'啊，真的是我吗，我参与了那么多抽奖终于轮到我了，太开心了'},
                {jibun:false,kotoba:'是的，我们也很替你开心，请按照如下要求填写个人信息'},
                {jibun:true,kotoba:'好，为什么要我身份证号还要我缴费？'},
                {jibun:false,kotoba:'为了验证是你本人，费用是保证金，因为礼品比较贵重，怕被别人冒领'},
            ],
            //固定3
            [
                {jibun:false,kotoba:'你好，我们最近在找暑假工，薪资日结，可以赚很多零花钱，很适合学生'},
                {jibun:true,kotoba:'真的吗，你不会是在骗我吧'},
                {jibun:false,kotoba:'怎么会呢，我们这边很需要你这样的学生'},
                {jibun:true,kotoba:'那我要怎么做'},
                {jibun:false,kotoba:'只需要帮我们刷刷单量，就可以给你提成，越到后面越多'},
            ],
            //固定4
            [
                {jibun:false,kotoba:'哈喽，王者荣耀最近有免费送皮肤的活动，参加的就能得到好几款限定皮肤，你要参加吗'},
                {jibun:true,kotoba:'真的吗，这么好，我想要那个皮肤好久了'},
                {jibun:false,kotoba:'对啊，好不容易返场，机会很难得，好多小伙伴都领到了'},
                {jibun:true,kotoba:'需要我做什么啊'},
                {jibun:false,kotoba:'只需要用微信扫这个二维码填一下游戏账户的信息就会发送到你的账号里了'},
                {jibun:true,kotoba:'我扫完了然后呢'},
                {jibun:false,kotoba:'怎么回事，我这边检测到你的账户涉嫌盗刷皮肤，不仅没法领取还会被冻结，警察还会找上门，这个后果可是十分严重的'},
            ]
        ],
        //无防范
        undefencableContent: [
            //无防范1
            [
                { jibun: true, kotoba: '好吧，救人要紧，我给你转', },
            ],
            //无防范2
            [
                { jibun: true, kotoba: '好吧，我知道了', },
            ],
            //无防范3
            [
                { jibun: true, kotoba: '这个可靠吗' },
                { jibun: false, kotoba: '放心好了，我们这边有好多像你这样的学生都赚了不少钱' },
                { jibun: true, kotoba: '原来赚钱这么简单' },
                { jibun: false, kotoba: '对啊，所以尽快加入我们吧' },
                { jibun: true, kotoba: '好' },
            ],
            //无防范4
            [
                {jibun:true,kotoba:'我没有啊，那我该怎么办，快告诉我'},
                {jibun:false,kotoba:'我这边有技术人员帮你解决，只需要往这个账户里转3000块作为保证金就不会有什么事了'},
                {jibun:true,kotoba:'好'},
            ],
        ],
        //有防范
        defencableContent: [
            //有防范1
            [
                {jibun:true,kotoba:'行，你在哪个医院啊，我和我家里人过去看看'},
                {jibun:false,kotoba:'就在省医院这，急诊科'},
                {jibun:true,kotoba:'可是你昨天晚上刚和我说在外面和家里人旅游啊'},
                {jibun:false,kotoba:'家里有点事突然回来了，路上就出了事故'},
                {jibun:true,kotoba:'好吧，周末一起出去玩的计划只好泡汤了'},
                {jibun:false,kotoba:'本来和你约好的，没办法，我得照顾姐姐，你快点把钱转我吧'},
                {jibun:true,kotoba:'可是我们并没有约定周末出去玩，你就是骗子！'},
            ],
            //有防范2
            [
                {jibun:true,kotoba:'中奖还需要保证金吗，我不信'},
                {jibun:false,kotoba:'需要的，不然视为你信誉不佳，不会发放礼品的'},
                {jibun:true,kotoba:'要我身份证号，是为了盗取信息然后威胁我吗，我不会上当的，你就是个骗子！'},
            ],
            //有防范3
            [
                {jibun:true,kotoba:`先让我尝尝甜头，后面金额越来越大，骗我越来越深啊
我看过新闻，你就是在诈骗，你就是个骗子！`}
            ],
            //有防范4
            [
                {jibun:true,kotoba:'那你现在把账号冻结了吧，反正也不是我的，我倒想看看会怎么样'},
                {jibun:false,kotoba:'我这边有技术人员很快就会把你账号冻结，只需要往这个账户里转3000块作为保证金就不会有什么事了'},
                {jibun:true,kotoba:'也好，等警察叔叔来，我问问你这样的骗子怎么处理'},
            ]
        ],

    },
    actions: {
        //登录
        async login(context, { id, password, status }) {
            let res = await request({
                url: '/lg/login',
                method: "POST",
                data: {
                    id,
                    password,
                    status,
                }
            })
            if (res.data.code == 200) {
                //登录成功
                //存放token
                localStorage.setItem('token', res.data.token)
                //立即验证token
                context.dispatch('testToken', res.data.token)
            }
            return res.data
        },
        //注册
        async sign(context, { form, status }) {
            let { data } = await request({
                url: `/lg/sign/${status}`,
                method: 'POST',
                data: form
            })
            return data
        },
        //验证token
        async testToken(context, token) {
            let res = await request({
                url: '/student/testToken',
                method: 'POST'
            })
            // console.log(res.data.data);
            

            context.commit('TESTTOKEN', res.data)

            return res.data
        },
        //setProcess
        async setProcess(context, num) {
            console.log(num);
            let res = await request({
                url: '/student/setProcess',
                method: 'POST',
                data: {
                    process: num
                }
            })
            if (res.data.code == 200) {
                context.commit('PROCESS', res.data.data.process)
            }
            else {
                // alert(res.data.msg)
            }
        },
        //undefenced
        async undefenced(context,sign){
            console.log(sign);
            let res = await request({
                url:'/student/undefenced',
                method:'post',
                data:{
                    node:sign
                }
            })
            console.log(res);
        },
        //defenced
        async defenced(content,sign){
            console.log(sign);
            //defenced
            let res = await request({
                url:'/student/defenced',
                method:'post',
                data:{
                    node:sign
                }
            })
            console.log(res);
        }
    },
    mutations: {
        SAVE(state, { x, y, z }) {
            state.x = x
            state.y = y
            state.z = z
        },
        TESTTOKEN(state, data) {
            console.log(data.code);
            if(data.code == 200) state.student = data.data
        },
        RESULT(state, msg) {
            state.result = msg
        },
        PROCESS(state, process) {
            state.student.process = process
        },
        BAGCHANGE(state, sss) {
            state.bag.bagOn = sss
        },
        GETKEY(state, key) {
            state.bag.keys.add(key)
            state.defences.set(`key${key}`,true)
        }
    },
    getters: {

    }
})