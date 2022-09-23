import { createStore } from "vuex";
import { request } from '../request/index.js'
import emitter from '../eventBus.js'

// console.log(window);

export default createStore({
    state: {
        datas: {
            start: new Date(),
            news: 0,
            npcs: 0,
            treasures: 0,
            phones: 0,
            challenges: 0,
            questions:0,
            solved:0,
        },

        rewards:[],

        context:[
            // 0
            [
                { left:false,c: 'dog', kotoba: '最近在玩什么啊' },
                { left:true,c:'rabbit', kotoba: '就那个游戏，周围朋友都在玩' },
                { left:false,c:'dog', kotoba: '那个啊，最近出的皮肤好好看，我都买完了，确实不错，你可以入手，也不算贵' },
                { left:true,c:'rabbit', kotoba: '我也没多少零用钱啊，就看看得了' },
                { left:false,c: 'dog', kotoba: '我也是啊，但是我自己能赚，找了个兼职，每天能赚一百多块呢' },
                { left:true,c: 'rabbit', kotoba: '这么好？那每天都能买皮肤了，做什么啊' },
                { left:false,c: 'dog', kotoba: '很简单，就是帮网店刷刷评论和单量什么的，轻松的很，赚钱就是这么简单' },
                { left:true,c: 'rabbit', kotoba: '真的吗，行，咱俩也是认识这么久的网友了，我信你，教教我吧' },
                { kotoba: '是诈骗，网上凡是提及到刷单的都是诈骗',aside:true },
                { kotoba: '天上不会掉馅饼，也不会不做什么每天就能有收入，提防网络诈骗！',aside:true },
            ],
            [
                { left:false,c:'dog',kotoba:'你好，我们是公安局的，这边检测到您最近与一起诈骗案件有牵连，需要你配合调查，进行网络笔录' },
                { left:true,c:'cat',kotoba:'啊？我没有参与啊，什么情况' },
                { left:false,c:'dog',kotoba:'我们肯定不会无缘无故给你打电话的，请你如实回答问题' },
                { left:true,c:'cat',kotoba:'好吧，你们问吧' },
                { left:false,c:'dog',kotoba:'你近期是不是经常浏览互联网？' },
                { left:true,c:'cat',kotoba:'是的' },
                { left:false,c:'dog',kotoba:'很有可能个人信息遭到泄露，被犯罪分子利用身份参加骗局，这样的话也算你犯罪' },
                { left:true,c:'cat',kotoba:'啊？？那我该怎么办啊，我不想坐牢' },
                { left:false,c:'dog',kotoba:'很简单，只需要你打一笔保证金到一个账户里，这样我们就会先去排查诈骗分子，你就没事了' },
                { left:true,c:'cat',kotoba:'好吧，我知道了' },
                { kotoba: '是诈骗！',aside:true },
                { kotoba: '警察不会做线上笔录，都是线下的！',aside:true },
                { kotoba: '也不要听信冒充身份的电话让你去汇款，一定都是骗子的骗局！！',aside:true },
            ],
            [
                { left:false,c:'dog',kotoba:'你好，我们是B站某知名up主，现在要录一期节目，在海南这边，不知道你有没有意愿来' },
                { left:true,c:'rabbit',kotoba:'我是你的粉丝！我很想去，可是路费怎么办，我只是个学生' },
                { left:false,c:'dog',kotoba:'没关系，只要你缴纳报名费，我们会给你留名额，也会帮你垫路费的，放心，这是我们报名表的链接，你点开输入一些信息就好了' },
                { left:true,c:'rabbit',kotoba:'好的，我看一下......这怎么还要我的身份证号啊，还有家长的一些信息' },
                { left:false,c:'dog',kotoba:'是为了验证你是否是成年人，以及能否联系到你的家长，输入就好了，我们不会骗你的' },
                { left:true,c:'rabbit',kotoba:'好的吧' },
                { kotoba: '不要轻信网上随意联系你的人，更不要去点开未知链接，以防有病毒，被骗钱财',aside:true },
                { kotoba: '保护好自己的隐私，健康上网！！',aside:true },
            ],
        ],

        // window,
        x: 0,
        y: 400,
        z: 0,
        student: {
            portrait: ''
        },//不一定是学生，老师的信息也存进去
        result: '',
        bag: {
            bagOn: true,
            keys: new Set()
        },
        //收集防范
        defences: new Map([['key1', false], ['key2', false], ['key3', false], ['key4', false]]),
        //自言自语
        hanashi: [
            [
                { kotoba: '还差一点点我就能打败他离开这里了！' },
                { kotoba: '只要抵住诱惑' },
                { kotoba: '我是不会上当的！' },
                { kotoba: '我一定可以的' },
            ],
            [
                { kotoba: '哎' },
                { kotoba: '一直在输' },
                { kotoba: '什么时候我才能出去啊' },
                { kotoba: '我想回家呜呜呜' },
            ],
            [
                { kotoba: '我终于通关啦' },
                { kotoba: '我要回家了哈哈哈,开心' },
                { kotoba: '伙伴们祝你们顺利' },
            ],
        ],
        //对话
        kaiwa: [//,key:4 ,key:3
            [//,key:4 
                { c: false, kotoba: '你好啊，是刚刚来到这里的新朋友吗' },
                { c: true, kotoba: '是的，我在这里该做什么,要注意什么' },
                { c: false, kotoba: '在这里你要做的就是提高自己的防骗意识，因为这直接关系到闯关的难度' },
                { c: false, kotoba: '你警惕心越强，他就不容易骗到你，也就会顺利闯关' },
                { c: true, kotoba: '好的，谢谢你' },
                { c: false, kotoba: '等下，我还要和你说一下刷单这一关' },
                { c: true, kotoba: '嗯？有什么要注意的吗' },
                { c: false, kotoba: '不要去贪小便宜，他是在放长线钓大鱼', key: 4 },
                { c: false, kotoba: '看起来是承诺回去后会给我们很丰厚的回报作为这次经历的补偿，其实是利用我们的贪念加固对他的信任', key: 4 },
                { c: false, kotoba: '前几单的确会给你佣金，但是当你花大钱刷更多单子企图得到更高的回报之时，也就正在掉进他的陷阱里面，包括在现实中也是一样，这些不仅限于这里', key: 4 },
                { c: true, kotoba: '好的好的，我会记住的，谢谢你' },
            ],
            [
                { c: true, kotoba: '哎，我今天只过了第一关，这个坏人好多套路啊，一不留神就失败了' },
                { c: false, kotoba: '那你加油，我就差一关就可以打败他了，欺负了我那么久终于解脱了！' },
                { c: true, kotoba: '真好，你有什么方法能顺利通关吗' },
                { c: false, kotoba: '就是多挑战，去积累经验，提高自己的防范和戒备，别轻信他说的好处就行了' },
                { c: true, kotoba: '嗯嗯，好的好的' },
            ],
            [
                { c: false, kotoba: '哎，我看来一时半会是出不去了，不过这里风景也挺好，还有这么多人陪着，也挺热闹' },
                { c: true, kotoba: '是啊，这确实还不错，不走了，回去还要做家务、写作业' },
                { c: false, kotoba: '看来不止我有这个想法啊哈哈，兄弟们都不打算闯关了？' },
                { c: true, kotoba: '不想学，又失败了好几次，感觉出不去了，就这样吧' },
            ],
            [//,key:3，
                { key: 3, c: false, kotoba: '冒充别人，他一般会用很急的事情来当借口，几乎不给你留思考的时间' },
                { key: 3, c: false, kotoba: '比如车祸，被抓，被绑架什么的，而且找各种理由管你借钱，数额都不小' },
                { c: true, kotoba: '那我该怎么应对呢，感觉挺难去识别的' },
                { key: 3, c: false, kotoba: '有几个小技巧' },
                { key: 3, c: false, kotoba: '你可以问他‘我的生日是多少、我叫什么名字’之类的，问一些只有你们知道的信息' },
                { key: 3, c: false, kotoba: '或者“上次怎么没出来玩”这种，类似于对暗号来核对身份' },
                { key: 3, c: false, kotoba: '因为发生什么意外事情，第一时间会去找家里人来解决，不会选择关系相对远的朋友' },
                { key: 3, c: false, kotoba: '当然他有可能会找借口回避，你要多问一些问题' },
                { c: true, kotoba: '好的好的，谢谢你！' },
            ],
            [
                { c: false, kotoba: '诶，帅哥，我刚进来，怎么情况' },
                { c: true, kotoba: '在这里要学有关的反诈知识，boss会通过各种手段骗到你' },
                { c: true, kotoba: '千万别上当，不然就回到保存点了' },
                { c: false, kotoba: '行，谢谢你' },
            ],
        ],
        //決定事項 3 4
        //固定 1 <--> 4
        constContent: [
            //固定1
            [
                { jibun: false, kotoba: '哈喽，王者荣耀最近有免费送皮肤的活动，参加的就能得到好几款限定皮肤，你要参加吗' },
                { jibun: true, kotoba: '真的吗，这么好，我想要那个皮肤好久了' },
                { jibun: false, kotoba: '对啊，好不容易返场，机会很难得，好多小伙伴都领到了' },
                { jibun: true, kotoba: '需要我做什么啊' },
                { jibun: false, kotoba: '只需要用微信扫这个二维码填一下游戏账户的信息就会发送到你的账号里了' },
                { jibun: true, kotoba: '我扫完了然后呢' },
                { jibun: false, kotoba: '怎么回事，我这边检测到你的账户涉嫌盗刷皮肤，不仅没法领取还会被冻结，警察还会找上门，这个后果可是十分严重的' },
            ],
            //固定2
            [
                { jibun: false, kotoba: '你好啊，恭喜你成为微博幸运用户' },
                { jibun: true, kotoba: '啊，真的是我吗，我参与了那么多抽奖终于轮到我了，太开心了' },
                { jibun: false, kotoba: '是的，我们也很替你开心，请按照如下要求填写个人信息' },
                { jibun: true, kotoba: '好，为什么要我身份证号还要我缴费？' },
                { jibun: false, kotoba: '为了验证是你本人，费用是保证金，因为礼品比较贵重，怕被别人冒领' },
            ],
            //固定3
            [
                { jibun: false, kotoba: '在吗，有急事，我姐姐刚刚突然出了车祸，现在在医院里抢救', },
                { jibun: true, kotoba: '怎么会这样，她还好吗', },
                { jibun: false, kotoba: '很严重，现在还没醒过来', },
                { jibun: true, kotoba: '医生怎么说', },
                { jibun: false, kotoba: '医生说要先交费才能做手术，我爸妈不在身边，我身上钱不够，急需手术费', },
                { jibun: true, kotoba: '大概要多少', },
                { jibun: false, kotoba: '2000左右吧，我到时候肯定会还你', },
            ],
            //固定4
            [
                { jibun: false, kotoba: '你好，我们最近在找暑假工，薪资日结，可以赚很多零花钱，很适合学生' },
                { jibun: true, kotoba: '真的吗，你不会是在骗我吧' },
                { jibun: false, kotoba: '怎么会呢，我们这边很需要你这样的学生' },
                { jibun: true, kotoba: '那我要怎么做' },
                { jibun: false, kotoba: '只需要帮我们刷刷单量，就可以给你提成，越到后面越多' },
            ],
        ],
        //无防范 1 <--> 4
        undefencableContent: [
            //无防范1
            [
                { jibun: true, kotoba: '我没有啊，那我该怎么办，快告诉我' },
                { jibun: false, kotoba: '我这边有技术人员帮你解决，只需要往这个账户里转3000块作为保证金就不会有什么事了' },
                { jibun: true, kotoba: '好' },
            ],
            //无防范2
            [
                { jibun: true, kotoba: '好吧，我知道了', },
            ],
            //无防范3
            [
                { jibun: true, kotoba: '好吧，救人要紧，我给你转', },
            ],
            //无防范4
            [
                { jibun: true, kotoba: '这个可靠吗' },
                { jibun: false, kotoba: '放心好了，我们这边有好多像你这样的学生都赚了不少钱' },
                { jibun: true, kotoba: '原来赚钱这么简单' },
                { jibun: false, kotoba: '对啊，所以尽快加入我们吧' },
                { jibun: true, kotoba: '好' },
            ],
        ],
        //有防范 1 <--> 4
        defencableContent: [
            //有防范1
            [
                { jibun: true, kotoba: '那你现在把账号冻结了吧，反正也不是我的，我倒想看看会怎么样' },
                { jibun: false, kotoba: '我这边有技术人员很快就会把你账号冻结，只需要往这个账户里转3000块作为保证金就不会有什么事了' },
                { jibun: true, kotoba: '也好，等警察叔叔来，我问问你这样的骗子怎么处理' },
            ],
            //有防范2
            [
                { jibun: true, kotoba: '中奖还需要保证金吗，我不信' },
                { jibun: false, kotoba: '需要的，不然视为你信誉不佳，不会发放礼品的' },
                { jibun: true, kotoba: '要我身份证号，是为了盗取信息然后威胁我吗，我不会上当的，你就是个骗子！' },
            ],
            //有防范3
            [
                { jibun: true, kotoba: '行，你在哪个医院啊，我和我家里人过去看看' },
                { jibun: false, kotoba: '就在省医院这，急诊科' },
                { jibun: true, kotoba: '可是你昨天晚上刚和我说在外面和家里人旅游啊' },
                { jibun: false, kotoba: '家里有点事突然回来了，路上就出了事故' },
                { jibun: true, kotoba: '好吧，周末一起出去玩的计划只好泡汤了' },
                { jibun: false, kotoba: '本来和你约好的，没办法，我得照顾姐姐，你快点把钱转我吧' },
                { jibun: true, kotoba: '可是我们并没有约定周末出去玩，你就是骗子！' },
            ],
            //有防范4
            [
                {
                    jibun: true, kotoba: `先让我尝尝甜头，后面金额越来越大，骗我越来越深啊
我看过新闻，你就是在诈骗，你就是个骗子！`}
            ],
        ],
        //完成phone数量
        phoneCount: 0,
        questions: new Map()
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
            if (res.data.code == 400) {
                // 教师
                location.href = '/management/'
                // location.href = 'http://localhost:8080/management/#/studentList'
                
            }


            context.commit('TESTTOKEN', res.data)

            return res.data
        },
        //setProcess
        async setProcess(context, num) {
            // console.log("****************************************************");
            // console.log(num);
            // console.log("****************************************************");
            let res = await request({
                url: '/student/setProcess',
                method: 'POST',
                data: {
                    which:num
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
        async undefenced(context, sign) {
            console.log(sign);
            let res = await request({
                url: '/student/undefenced',
                method: 'post',
                data: {
                    node: sign
                }
            })
            console.log(res);
        },
        //defenced
        async defenced(content, sign) {
            console.log(sign);
            //defenced
            let res = await request({
                url: '/student/defenced',
                method: 'post',
                data: {
                    node: sign
                }
            })
            console.log(res);
        },

        //getAllQuestions
        async getAllQuestions({ commit }) {
            let res = await request({
                method: 'POST',
                url: '/student/getAllQuestions',
            })
            console.log(res.data);
            if (res.data.code == 200) {
                commit('QUESTIONS', res.data.data)
            }
            else {
                //
            }
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
            if (data.code == 200) state.student = data.data
        },
        RESULT(state, msg) {
            state.result = msg
        },
        PROCESS(state, process) {
            state.student.process = process
        },
        BAGCHANGE(state, sss) {
            state.bag.bagOn = sss
            console.log(sss);
            if(sss){
                // emitter.emit('setumeiOff')
            }
        },
        GETKEY(state, key) {
            state.bag.keys.add(key)
            state.defences.set(`key${key}`, true)
        },
        QUESTIONS(state, data) {
            state.questions = new Map(data)
            console.log(state.questions);
        },
        REWARD(state,reward){
            state.rewards.push(reward)
        },

        news(state,activedNewsSize) {
            state.datas.news = activedNewsSize
        },
        npcs(state) {
            state.datas.npcs++
        },
        treasures(state){
            state.datas.treasures++
        },
        phones(state){
            state.datas.phones++
        },
        challenges(state){
            state.datas.challenges++
        },
        questions(state){
            state.datas.questions++
        },
        solved(state){
            state.datas.solved++
        },
    },
    getters: {

    }
})