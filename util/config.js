
var Instances = {};
var Constrtctors = {};

var Container = function(that) {
    let name = that.name || cfg.name;
    console.log(that);
    Instances[name] = ['Instances'];
    Constrtctors[name] = ['Constrtctors'];
} 

var Page = function() {

    Config.getConst(this, 'page');
    this.isPhone = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    this.isPad = (/Pad/i.test(navigator.userAgent));
    this.zoom = this.isPhone ? this.zoomPhone : this.zoomPc;
    this.zoom = this.isPad ? this.zoomPad : this.zoom;
    this.windWidth = ~~(window.innerWidth / this.zoom);
    this.windHeight = ~~(window.innerHeight / this.zoom);
    if (this.alertType == 'bot') {
        this.alertMinMargin = 0;
        this.alertBorder = 0;
    } else {
        this.alertOffset += 180;
    }
    this.alertHeight = this.windHeight - this.alertOffset;
    this.outerHeight = this.windHeight - this.outerOffset;
    this.innerHeight = this.windHeight - this.innerOffset;
    this.flowHeight = Math.max(this.innerHeight, this.minHeight);
    this.alertMargin = this.windWidth - this.alertMaxWidth;
    this.alertMargin = Math.max(this.alertMargin / 2, this.alertMinMargin);
    this.alertFillWidth = this.windWidth - this.alertMargin * 2;
    this.alertFullWidth = this.windWidth - this.alertMinMargin * 2;
    this.alertWidth =  this.alertFillWidth - this.alertPadding - this.alertBorder;
    this.isWidth = this.windWidth > this.windHeight;
    this.isFlow = this.innerHeight > this.minHeight;
    let box = Elem.get('alert-box');
    if (box) {
        box.setAttribute('pos', this.alertType);
        box.style.left = this.alertMargin + 'px';
        box.style.right = this.alertMargin + 'px';
    }
    document.body.style.zoom = this.zoom;
    let center = Elem.get('outer-center');
    Elem.height(center, this.outerHeight);
}

var Constant = {
    agent: {},
    action: {
        ref: '#host/#uid/#act/#idx',
        host:'http://localhost:8888',
        page:'/page/home/home.html',
        router:'/#uid/#act/#idx',
    },
    sett: {
        linkType: 'github',   
        modeType: 'digger',
        colorType: 'text',
        debugType: 'close', 
    },
    fade: {
        isLog: true,
        timeIn: 1000,
        timeOn: 3000,
        timeOut: 1000,
        timeTog: 1000,
    },
    link: {
        html: 'file:///C:/Users/ZHANGJIALIANG/<br/>Documents/GitHub/tobbye.github.io',
        github: 'http://tobbye.github.io',
        local: 'http://localhost:8888',
        http: 'http://tobbye.top',
    },
    page: {
        alertType: 'bot',
        alertMaxWidth: 1000,
        alertMinMargin: 10,
        alertPadding: 20,
        alertBorder: 16,
        alertOffset: 410,
        outerOffset: 220,
        innerOffset: 770, 
        minHeight: 700,
        zoomPhone: 1.00,
        zoomPad: 0.80,
        zoomPc: 0.40,
    }, 
    color: {
        font: '#333',
        light: '#ccc',
        bgd: '#eee',
        style: 'dark',
        type: 'black',
        text: '深黑',
    },
    clock: {
        loop: 10,
    },
    hrefTop: [
        {name:'sett', href:'../sett/sett.html', text:'设置'},
        {name:'rank', href:'../rank/rank.html', text:'榜单'},
        {name:'task', href:'../task/task.html', text:'任务'},
        {name:'stat', href:'../stat/stat.html', text:'记录'},
        {name:'help', href:'../help/help.html', text:'帮助'},
    ],
    hrefBot: [
        {name:'user', href:'../user/user.html', text:'个人'},
        {name:'nexu', href:'../nexu/nexu.html', text:'关系'},
        {name:'home', href:'../home/home.html', text:'主页'},
        {name:'fund', href:'../fund/fund.html', text:'资金'},
        {name:'tran', href:'../tran/tran.html', text:'市场'},
    ],
    string: {
        titleSearch: '搜索: #0',
    },
};

var Config = new __Config();

function __Config() {

//初始化配置
    this.init = function() {
        this.cfg = cfg;
        this.name = 'Config';
        this.fade = new Fade();
        this.action = {};

        this.getTemp();

        this.getLink();
        Container(this);
        window.onresize();
    }

    this.getTemp = function() {
        let temp = Storage.get('Config') || {};
        if (cfg.name == 'sett')
            temp = {};
        if (cfg.name == temp.name && temp.sett.isInto)
            this.innerIdx = temp.innerIdx || 0;
        else
            this.innerIdx = 0;
        this.setConst(temp, 'sett');
        this.setConst(temp, 'color');
        this.setConst(temp, 'clock');
        if (this.sett.isOnline) {
            Elem.release();
        }

    }



    this.setAction = function(act, idx) {
        let uid = 'i';
        let ref = Constant.action.ref;
        ref = ref.replace('#uid', uid).replace('#act', act).replace('#idx', idx);
        this.action.router = ref.replace('#host', '');
        this.action.ref = ref.replace('#host', Constant.action.host);
        console.log(this.action);
        return this.action.ref;
    }


    this.setConst = function(temp, key) {
        this[key] = temp[key] || Constant[key];
        if (typeof(this[key]) === 'object')
            this[key] = JSON.parse(JSON.stringify(this[key]));
    }

    this.getConst = function(that, key) {
        let defult = Constant[key];
        for (let x in defult) {
            that[x] = defult[x];
        }
    }


    this.getObject = function(that, obj) {
        for (let x in obj) {
            that[x] = obj[x];
        }
    }

    this.getLink = function() {
        let path = window.document.location.href;
        let page = window.document.location.pathname;
        let pos = path.indexOf(page);
        let link = path.substring(0, pos);
        this.action.link = link;
        this.action.page = page;
        this.getLinkType(link);
    }

    this.getLinkType = function(link) {
        for (let key in Constant.link) {
            if (Constant.link[key] == link) {
                this.sett.linkType = key;
                return;
            }
        }
    }

    this.getOrder = function(idx) {
        let order = parseInt(idx) + 1 + 'th';
        if (order.length == 3)
            order = order.replace('1th', '1st').replace('2th', '2nd').replace('3th', '3rd');
        return order;
    }

    this.getGroup = function(temp) {
        temp.isSponer = temp.uid[0] == 's';
        return temp.isSponer ? '赞助商':'淘金者';
    }


    //---根据绑定的idx属性查找数据
    this.__key = function(e, attr) {
        attr = attr || '';
        if (e.parentNode == document.body) {
            return attr;
        } else {
            if (e.getAttribute('key')) 
                attr = e.getAttribute('key') + attr;
            return this.__key(e.parentNode, attr);  
        }
    }

    this.__line = function(e) {
        let key = this.__key(e).replace(/(?<=lines\[\d\])[^\s]*/, '');
        // console.log(key);
        return eval(key);
    }

    this.__list = function(e) {
        let key = this.__key(e).replace(/(?<=list\[\d\])[^\s]*/, '');
        // console.log(key);
        return eval(key);
    }

    this.__item = function(e) {
        let key = this.__key(e).replace(/(?<=items\[\d\])[^\s]*/, '');
        // console.log(key);
        return eval(key);
    }


    this.__self = function(e) {
        let key = this.__key(e);
        // console.log(key);
        return eval(key);
    }
    //---根据绑定的idx属性查找数据

    this.__user = function(uid) {
        let user = tempData.userData[uid];
        user.uid = uid;
        return user;
    }
}


let tempData = {
    searchData: [
        {order: 1, val: 948670, nexu:1, uid: 'd20001'},
        {order: 2, val: 690663, nexu:1, uid: 'd20002'},
        {order: 3, val: 582830, nexu:1, uid: 'd20003'},
        {order: 4, val: 699972, nexu:1, uid: 'd20004'},
        {order: 5, val: 414480, nexu:1, uid: 'd20005'},
        {order: 6, val: 341222, nexu:1, uid: 'd20006'},
        {order: 7, val: 202098, nexu:1, uid: 'd20007'},
        {order: 8, val: 182256, nexu:1, uid: 'd20008'},
        ],
    userData: {
        d10001:{name:'青青',ladd:13,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['阶层展示1','阶层展示2']},
        d10002:{name:'倩倩',ladd:7,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['称号标签1','称号标签2']},
        d10003:{name:'素素',ladd:6,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['排名标签1','排名标签2']},
        d10004:{name:'梦梦',ladd:3,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['成就标签1','成就标签2']},
        d10005:{name:'萌萌',ladd:5,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['评价展示1','评价展示2']},
        d10006:{name:'威威',ladd:19,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['身份认证1','身份认证2']},
        d10007:{name:'明明',ladd:22,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['成就标签1','成就标签2']},
        d10008:{name:'欢欢',ladd:12,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['阶层展示1','阶层展示2']},
        d10009:{name:'亮亮',ladd:17,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['身份认证1','身份认证2']},
        d10010:{name:'辰辰',ladd:21,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['成就标签1','成就标签2']},

        d20001:{name:'李刚猛',ladd:18,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['身份标签1','身份标签2']},
        d20002:{name:'张雄壮',ladd:17,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['阶层标签1','阶层标签2']},
        d20003:{name:'章威武',ladd:12,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['成就标签1','成就标签2']},
        d20004:{name:'王坚强',ladd:20,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['排名标签1','排名标签2']},
        d20005:{name:'徐福贵',ladd:17,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['评价标签1','评价标签2']},
        d20006:{name:'赵铁柱',ladd:15,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['理财专家','投资顾问']},
        d20007:{name:'赵铁牛',ladd:15,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['理财专家','投资顾问']},
        d20008:{name:'赵铁蛋',ladd:15,tag:['自定义标签1','自定义标签2','自定义标签3'],mark:['理财专家','投资顾问']},

        s30001:{name:'苹果Apple',ladd:18,tag:['MacPro','XDRDisplay','ProStand'],mark:['科技公司','苹果不香吗']},
        s30002:{name:'腾讯Tencent',ladd:18,tag:['王者荣耀','英雄联盟','地下城与勇士'],mark:['游戏公司','氪金变强']},
        s30003:{name:'鬼冢虎OnitsukaTiger',ladd:15,tag:['鬼冢虎','运动鞋','休闲鞋'],mark:['鬼冢虎','亚瑟士']},
        s30004:{name:'悦诗风吟Innisfree',ladd:12,tag:['悦诗风吟','化妆品','韩国美妆'],mark:['韩国美妆','悦诗风吟']},
        s30005:{name:'百雀羚',ladd:15,tag:['百雀羚','化妆品','东方匠韵'],mark:['东方匠韵','百雀羚']},
        s30006:{name:'康师傅',ladd:15,tag:['康师傅','老坛酸菜','红烧牛肉面'],mark:['牛肉面','方便面']},

        s40001:{name:'萌萌职业技术学院',ladd:20,tag:['挖掘机','技术','哪家强'],mark:['技术培训','技术学院']},
        s40002:{name:'萌萌部落格',ladd:17,tag:['孤独症患者','抑郁症患者','强迫症患者'],mark:['二次元','中二病']},
        s40003:{name:'萌萌家族',ladd:15,tag:['大萌','二萌','小萌'],mark:['武林萌主','天下第一萌']},
        s40004:{name:'萌萌宠物店',ladd:7,tag:['宠物','宠物店','人狗情未了'],mark:['宠物配种','宠物医院']},
        s40005:{name:'萌萌水果店',ladd:9,tag:['普陀区','洛川路','宜川路'],mark:['种类丰富','价格实惠']},
        s40006:{name:'萌萌家居(徐汇店)',ladd:17,tag:['徐汇区','漕溪路','126号'],mark:['家居','家具']},
        s40007:{name:'萌萌美容美发',ladd:17,tag:['理发','美容','美发'],mark:['空标签','空标签']},
        s40008:{name:'萌萌养生堂',ladd:16,tag:['针灸','拔火罐','刮痧'],mark:['空标签','空标签']},
        s40009:{name:'萌萌汽修',ladd:16,tag:['保养','修车','洗车'],mark:['金牌修理师','金牌技师']},

        d50001:{name:'二狗子本人',ladd:7,tag:['你好','我叫','二狗子'],mark:['二狗俱乐部','二狗家族']},
        d50002:{name:'二狗子的老婆',ladd:6,tag:['年龄25','体重150','身高150'],mark:['二狗俱乐部','二狗家族']},
        d50003:{name:'二狗子的岳父',ladd:8,tag:['象棋大师','围棋七段','格斗冠军'],mark:['二狗俱乐部','二狗家族']},
        d50004:{name:'二狗子的表妹',ladd:11,tag:['王源','王俊凯','易烊千玺'],mark:['二狗俱乐部','二狗家族']},
        d50005:{name:'二狗子的三叔',ladd:8,tag:['空标签','空标签','空标签'],mark:['二狗俱乐部','二狗家族']},
        d50006:{name:'二狗子的二姨夫',ladd:8,tag:['空标签','空标签','空标签'],mark:['二狗俱乐部','二狗家族']},
        d50007:{name:'二狗子的七舅姥爷',ladd:12,tag:['哎哟','卧槽','这年轻人'],mark:['二狗俱乐部','二狗家族']},
        d50008:{name:'二狗子的远方大表哥',ladd:14,tag:['老铁','双击','666'],mark:['空标签','空标签']},

        m90001:{name:'魔',ladd:10,tag:['奴奵婒','姃姣嫌媾','娳娏嬆嫬婖'],mark:['身份标签1','身份标签2']},
        m90002:{name:'鬼',ladd:10,tag:['妁奻婐','姹姘嫄嫁','娒娚嬄嫽娹'],mark:['身份标签1','身份标签2']},
        m90003:{name:'溾',ladd:10,tag:['奼奾娺','姽姝嫋媲','娞娦嬂嬋婭'],mark:['身份标签1','身份标签2']},
        m90004:{name:'愧',ladd:10,tag:['奺妒媿','姞娅嬅媳','娋娧嬗嫵媕'],mark:['身份标签1','身份标签2']},
        m90005:{name:'媿',ladd:10,tag:['妣妋媦','娇姙媺媽','娪娨嬙嫻媠'],mark:['身份标签1','身份标签2']},
        m90006:{name:'塊',ladd:10,tag:['妫妓媛','姱娍嫓媼','娮娙嬔嫿媢'],mark:['身份标签1','身份标签2']},
        m90007:{name:'槐',ladd:10,tag:['妠姒媮','娜姛嫆嫎','婊娛嬠嬞媚'],mark:['身份标签1','身份标签2']},
        m90008:{name:'傀',ladd:10,tag:['妊妩媯','娆姟嫊媰','娼娡嬒嫴婷'],mark:['身份标签1','身份标签2']},
        m90009:{name:'瘣',ladd:10,tag:['妍妖媋','娀娂媴媹','婳婢嬐嬇媟'],mark:['身份标签1','身份标签2']},
        m90010:{name:'廆',ladd:10,tag:['妤妪媅','姚姼嫦嫇','婕婵嬢嬍婣'],mark:['身份标签1','身份标签2']},
        m90011:{name:'魂',ladd:10,tag:['妘妉媂','姻婙嫪嫟','娵婼嬕嬘媬'],mark:['身份标签1','身份标签2']},
        m90012:{name:'魄',ladd:10,tag:['姉妢媍','姪姰嫣嫀','嫏婧嬑嫸媨'],mark:['身份标签1','身份标签2']},
        m90013:{name:'魁',ladd:10,tag:['姂妚媓','姦姳嫕媷','婉婗嬩嬡婸'],mark:['身份标签1','身份标签2']},
        m90014:{name:'魉',ladd:10,tag:['妦妔婽','姶姵嫰嫍','婞婠嬪嬝媏'],mark:['身份标签1','身份标签2']},
        m90015:{name:'鬽',ladd:10,tag:['妎姖媫','姯姺嫧媱','娬婋嬱嬨媩'],mark:['身份标签1','身份标签2']},
        m90016:{name:'魅',ladd:10,tag:['妌妕媡','姡娗嫭嫃','媧婬嬥嬓媈'],mark:['身份标签1','身份标签2']},
        m90017:{name:'魒',ladd:10,tag:['妜妲媔','姢姠嫤嫡','婦媖嬤嬚媘'],mark:['身份标签1','身份标签2']},
        m90018:{name:'魌',ladd:10,tag:['妧姗媆','姩姸嫲嫘','婩婥嬺嬛嫅'],mark:['身份标签1','身份标签2']},
        m90019:{name:'鬾',ladd:10,tag:['妡姁媊','姾姷嫥嫚','婇娾嬬嬟媄'],mark:['身份标签1','身份标签2']},
        m90020:{name:'魃',ladd:10,tag:['妐妬媶','娰娭嫞嫖','婃婄嬯嬳婻'],mark:['身份标签1','身份标签2']},
        m90021:{name:'魑',ladd:10,tag:['姅姍媞','姲娣嬉嫱','婰婤嬹嬭媥'],mark:['身份标签1','身份标签2']},
        m90022:{name:'魀',ladd:10,tag:['姌妼婾','娫婀嬈嫛','婏婝嬽嬶媇'],mark:['身份标签1','身份标签2']},
        m90023:{name:'魐',ladd:10,tag:['妯姀媙','姫姬嬀嫜','婔娻孅嬦媣'],mark:['身份标签1','身份标签2']},
        m90024:{name:'鬿',ladd:10,tag:['妷姏媗','娖娠嬌嫗','婎婟孉嬧媃'],mark:['身份标签1','身份标签2']},
        m90025:{name:'魕',ladd:10,tag:['妭妳媀','娥娲嫺嫷','媎婫孄嬵媤'],mark:['身份标签1','身份标签2']},
        m90026:{name:'魋',ladd:10,tag:['妸妵媑','娓娴嬁嫨','婛婅孆嬣媁'],mark:['身份标签1','身份标签2']},
        m90027:{name:'魍',ladd:10,tag:['姈姎媸','娱娝嬏嫮','婮婡孇嬫媉'],mark:['身份标签1','身份标签2']},
        m90028:{name:'魈',ladd:10,tag:['姄妱嫉','娕娊嫶嫝','娽婈孋嬻婹'],mark:['身份标签1','身份标签2']},
        m90029:{name:'魆',ladd:10,tag:['妽姤嫫','娐娢嫾嫹','婂婨孍嬾媜'],mark:['身份标签1','身份标签2']},
        m90030:{name:'魖',ladd:10,tag:['妶姮嫔','婲娔嫼嫙','婑媌孊嬿嫒'],mark:['身份标签1','身份标签2']},
        m90031:{name:'魇',ladd:10,tag:['婍娸媒','婌婘孃婿','孏娷孈孀孂'],mark:['身份标签1','身份标签2']},
    },
    unitData: {
        nexu:1, uid: 'uid001', 
        name: 'The Sponsor', 
        ladd: 17, 
        tag: ['自定义标签1','自定义标签2','自定义标签3'], 
        mark: ['身份标签1','身份标签2'],
        mark2: ['阶层标签1','阶层标签2'],
        mark3: ['成就标签1','成就标签2'],
        mark4: ['排名标签1','排名标签2'],
        mark5: ['评价标签1','评价标签2'],
        desc: `<h3>谁能告诉我花儿为什么那么红？</h3>花儿为什么这样红？
            为什么这样红？
            哎红得好像，
            红得好像燃烧的火，
            它象征着纯洁的友谊和爱情。
            花儿为什么这样鲜？
            为什么这样鲜？
            哎鲜得使人，
            鲜得使人不忍离去，
            它是用了青春的血液来浇灌。
            哎鲜得使人，
            鲜得使人不忍离去，
            它是用了青春的血液来浇灌。
            哎红得好像，
            红得好像燃烧的火，
            它象征着纯洁的友谊和爱情。`
            // `陈晴晴2009/叶梦梦2009/王嫚嫚2010/胡泱秧2013/邓小丽2016/赵素华2016/黎桂清2017/章威威2018/崔慧珍2019/鲍青青2019/汤小英2019/张沙沙2019觉得很赞！`,

    },

    chatData: [
    {text:'大佬您好，我有个价值20亿的项目，前无古人后无来者！', time:'11：25', isMine:0},
    {text:'静静的听你装完这个逼。', time:'11：25', isMine:1},
    {text:'如何一块变两块？', time:'11：25', isMine:0},
    {text:`今天一块变两块，
        明天两块变四块，
        后天四块变八块，
        大后天一十六块，
        十天二零四八块，
        一月二十一亿块。`, time:'11：27', isMine:0},
    {text:`方法：
        1).培养一种繁殖周期是1天的生物体
        2).剪下蚂蚁的寻路基因植入此生物体内
        3).剪下蜜蜂的采集基因进行改造
        4).在采集基因上镶嵌3.66毫克黄金（价值1元，金价273/克）
        5).把采集基因植入此生物体内
        6).把此生物体投放到非洲金矿
        7).在31天后把蚁后投放到金矿上
        8).在蚁后的吸引下这些生物体聚集到一起，数一数，有21.47亿个
        9).关键时刻到了，一把火（3000度以上）烧死这么多的生物体
        10).等冷却凝固后，地上一堆黄色金属，称重约7.866吨，价值估算21.47亿元
        如此目标实现！`, time:'11：27', isMine:0},

    {text:`二狗子，你这个项目我很有兴趣，你先去市场调研一下，出个详细的策划案出来，把步骤和细节都罗列出来，最好到非洲金矿实地考察一下。`, time:'11：30', isMine:1},
    {text:`另外PPT也是必不可少的，一定要做的美观一点，你上次那个「母猪如何择优配种」项目就是栽在PPT上，做的像狗屎一样，这次可不能再像上次那样瞎搞了。`, time:'11：30', isMine:1},
    {text:`启动资金的问题你不用担心，我大力支持。加油干！二狗子！`, time:'11：30', isMine:1},
    ],
}

var Path = {};
Path.ladd = {
    ladd1: 'http://i2.tiimg.com/720251/f51b4943c8a7e60f.png', 
    ladd2: 'http://i2.tiimg.com/720251/d6971ccfb30b6859.png', 
    ladd3: 'http://i2.tiimg.com/720251/2c4eda7a6d43b981.png', 
    ladd4: 'http://i2.tiimg.com/720251/ba8abd4aae2f71f8.png', 
    ladd5: 'http://i2.tiimg.com/720251/11923a433f061e6d.png', 
    ladd6: 'http://i2.tiimg.com/720251/cda4f3f4ae1df0e6.png', 
    ladd7: 'http://i2.tiimg.com/720251/03c9057484efbb44.png', 
    ladd8: 'http://i2.tiimg.com/720251/585f51f06acbdfe8.png', 
    ladd9: 'http://i2.tiimg.com/720251/4fbee14258ac3dc5.png', 
    ladd10: 'http://i2.tiimg.com/720251/e2ffbd1759cb9472.png', 
    ladd11: 'http://i2.tiimg.com/720251/9f4e922cb3e6fcc8.png', 
    ladd12: 'http://i2.tiimg.com/720251/e6004b5bfb19dbd2.png', 
    ladd13: 'http://i2.tiimg.com/720251/30ff1cdf0c4ae501.png', 
    ladd14: 'http://i2.tiimg.com/720251/9a2a435dd7db6c0d.png', 
    ladd15: 'http://i2.tiimg.com/720251/3e9556a6811e3ef7.png', 
    ladd16: 'http://i2.tiimg.com/720251/42cc78a9afd77da9.png', 
    ladd17: 'http://i2.tiimg.com/720251/0e5f4514e3a14e71.png', 
    ladd18: 'http://i2.tiimg.com/720251/e7392610e203397f.png', 
    ladd19: 'http://i2.tiimg.com/720251/692d5e9f83a30768.png', 
    ladd20: 'http://i2.tiimg.com/720251/dec85db050086f23.png', 
    ladd21: 'http://i2.tiimg.com/720251/20de9a85f417f796.png', 
    ladd22: 'http://i2.tiimg.com/720251/fcba683d6ac4b702.png', 
    ladd23: 'http://i2.tiimg.com/720251/819cb3f1c51476fd.png', 
    ladd24: 'http://i2.tiimg.com/720251/b8220dda07cbace1.png', 
    ladd25: 'http://i2.tiimg.com/720251/3c7238efdd6df7d2.png', 
};
