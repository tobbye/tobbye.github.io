
let Instances = {};
let Constrtctors = {};

let Container = function(that) {
    let name = that.name || cfg.name;
    console.log(that);
    Instances[name] = ['Instances'];
    Constrtctors[name] = ['Constrtctors'];
} 

let Constant = {
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
        alertType: 'top',
        alertMaxWidth: 1000,
        alertMinMargin: 10,
        alertPadding: 20,
        alertBord: 16,
        alertOffset: 550,
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
        dark: '#888',
        bgd: '#eee',
        style: 'dark',
        type: 'black',
        text: '深黑',
    },
    clock: {
        loop: 10,
    },
    mine: {
        uid: 'd50001',
    },
    hrefTop: [
        {name:'sett', href:'../sett/sett.html', text:'设置'},
        {name:'rank', href:'../rank/rank.html', text:'榜单'},
        {name:'land', href:'../land/land.html', text:'领地'},
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
        this.setUserData();
        Container(this);
        window.onresize();
    }

    this.setUserData = function() {
        for (let x in tempData.userData) {
            let user = tempData.userData[x];
            if (user.name) {
                user.icon = Parse.pick(Array.from(tempData.iconStr));
                user.icon = '<text emoji=1>' + user.icon + '</text>';
            }
        }
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
        this.setConst(temp, 'mine');
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

    this.getOrder = function(line) {
        if (line.ord == null)
            return line.order;
        let order = parseInt(line.ord) + 1 + 'th';
        if (order.length == 3)
            order = order.replace('1th', '1st').replace('2th', '2nd').replace('3th', '3rd');
        return order;
    }

    this.getValue = function(line) {
        if (line.val == null)
            return null;
        else
            return line.valStr + ': ' + Parse.sub4Num(line.val);
    }

    this.getGroup = function(temp) {
        if (temp.uid) 
            temp.isSponer = temp.uid[0] == 's';
        if (temp.group) 
            temp.isSponer = temp.group == '赞助商';
        return temp.isSponer ? '赞助商':'淘金者';
    }

    this.isMine = function(user) {
        return this.mine.uid == user.uid;
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
        if (!uid) return;
        let user = tempData.userData[uid];
        if (!user) return;
        user.uid = uid;
        return user;
    }
}


let tempData = {
    iconStr: 
        `🙈🙉🙊🐵🐒🐶🐕🐩🐺🐱😺😸😹😻😼😽🙀😿😾🐈🐯🐅🐆🐴🐎🐮🐂🐃🐄🐷🐖🐗🐽🐏🐑🐐🐪🐫🐘🐭🐁🐀🐹🐰🐇🐻🐨🐼🐾🐔🐓🐣🐤🐥🐦🐧🐸🐊🐢🐍🐲🐉🐳🐋🐬🐟🐠🐡🐙🐚🐌🐛🐜🐝🐞🦋`,
    searchData: [],
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
        s30003:{name:'星巴克StarBuck',ladd:15,tag:['咖啡','咖啡','咖啡'],mark:['星巴克','星巴克']},
        s30004:{name:'金拱门',ladd:12,tag:['炸鸡','汉堡','薯条'],mark:['麦当劳','麦香鸡']},
        s30005:{name:'百雀羚',ladd:15,tag:['百雀羚','化妆品','东方匠韵'],mark:['东方匠韵','百雀羚']},
        s30006:{name:'康师傅',ladd:15,tag:['康师傅','老坛酸菜','红烧牛肉面'],mark:['牛肉面','方便面']},

        s40001:{name:'萌萌职业技术学院',ladd:20,tag:['卖萌','技术','哪家强'],mark:['技术培训','技术学院']},
        s40002:{name:'萌萌部落格',ladd:17,tag:['孤独症患者','抑郁症患者','强迫症患者'],mark:['二次元','中二病']},
        s40003:{name:'萌萌家族',ladd:15,tag:['大萌','二萌','小萌'],mark:['武林萌主','天下第一萌']},
        s40004:{name:'萌萌宠物店',ladd:7,tag:['宠物','宠物店','人狗情未了'],mark:['宠物配种','宠物医院']},
        s40005:{name:'萌萌水果店',ladd:9,tag:['普陀区','洛川路','宜川路'],mark:['种类丰富','价格实惠']},
        s40006:{name:'萌萌家居(徐汇店)',ladd:17,tag:['徐汇区','漕溪路','126号'],mark:['家居','家具']},
        s40007:{name:'萌萌美容美发',ladd:17,tag:['理发','美容','美发'],mark:['空标签','空标签']},
        s40008:{name:'萌萌养生堂',ladd:16,tag:['针灸','拔火罐','刮痧'],mark:['空标签','空标签']},
        s40009:{name:'萌萌饭店',ladd:16,tag:['宴会','婚宴','喜宴'],mark:['饭店','酒店']},
        s40010:{name:'萌萌汽车养护中心',ladd:16,tag:['保养','修车','洗车'],mark:['金牌修理师','金牌技师']},

        d50001:{name:'二狗子',ladd:7,tag:['你好','我叫','二狗子'],mark:['二狗俱乐部','二狗家族']},
        d50002:{name:'二狗子的老婆',ladd:6,tag:['年龄25','体重150','身高150'],mark:['二狗俱乐部','二狗家族']},
        d50003:{name:'二狗子的岳父',ladd:8,tag:['象棋大师','围棋七段','格斗冠军'],mark:['二狗俱乐部','二狗家族']},
        d50004:{name:'二狗子的表妹',ladd:11,tag:['王源','王俊凯','易烊千玺'],mark:['二狗俱乐部','二狗家族']},
        d50005:{name:'二狗子的三叔',ladd:8,tag:['空标签','空标签','空标签'],mark:['二狗俱乐部','二狗家族']},
        d50006:{name:'二狗子的二姨夫',ladd:8,tag:['空标签','空标签','空标签'],mark:['二狗俱乐部','二狗家族']},
        d50007:{name:'二狗子的七舅姥爷',ladd:12,tag:['哎哟','卧槽','这年轻人'],mark:['二狗俱乐部','二狗家族']},
        d50008:{name:'二狗子的远方大表哥',ladd:14,tag:['老铁','双击','666'],mark:['空标签','空标签']},
    },
    ghostData: {
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
        uid: 'uid001', 
        name: 'The Sponsor', 
        ladd: 17, 
        tag: ['自定义标签1','自定义标签2','自定义标签3'], 
        mark: ['身份标签1','身份标签2'],
        mark2: ['阶层标签1','阶层标签2'],
        mark3: ['成就标签1','成就标签2'],
        mark4: ['排名标签1','排名标签2'],
        mark5: ['评价标签1','评价标签2'],
    },
    

}

let Path = {};
Path.ladd = '../../picture/ladd/#ladd.png';
