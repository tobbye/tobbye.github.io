const NAME = 'home';
const INNERIDX = 0;
const AGENT = {};
const ACTION = {
    ref: '#host/#uid/#act/#idx',
    host:'http://tobbye.github.io',
    page:'/page/home/home.html',
    router:'/#uid/#act/#idx',
};

const SETT = {
    hostType: 'github',   
    modeType: 'digger',
    colorType: 'text',
    debugType: 'close', 
}

const FADE = {
    isLog: true,
    timeIn: 1000,
    timeOn: 3000,
    timeOut: 1000,
    timeTog: 1000,
}

const HOST = {
    html: 'file:///C:/Users/ZHANGJIALIANG/Documents/GitHub/tobbye.github.io',
    github: 'http://tobbye.github.io',
    local: 'http://localhost:8888',
    http: 'http://tobbye.top:80',
}

var config = {
    name: 'home',
    innerIdx: 0,
    cfg: {},
    agent: {},
    action: {
        ref: '#host/#uid/#act/#idx',
        host:'http://tobbye.github.io',
        page:'/page/home/home.html',
        router:'/#uid/#act/#idx',
    },
    sett: {},
    fade: {},
    page: {},
    color: {},
    clock: {},
    constant: {
        sett: {
            hostType: 'html',   
            modeType: 'digger',
            colorType: 'text',
            debugType: 'close', 
            dataType: 'clear', 
        },
        fade: {
            isLog: true,
            timeIn: 1000,
            timeOn: 3000,
            timeOut: 1000,
            timeTog: 1000,
        },
        host: {
            html: 'file:///C:/Users/ZHANGJIALIANG/<br/>Documents/GitHub/tobbye.github.io',
            github: 'http://tobbye.github.io',
            local: 'http://localhost:8888',
            http: 'http://tobbye.top',
        },
        page: {
            alertOffset: 716,
            outerOffset: 220,
            innerOffset: 770, 
            minHeight: 700,
            zoomMobile: 1.00,
            zoomWechat: 0.90,
            zoomComput: 0.40,
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
            mixLoop: 10,

        }
    },
    hrefTop: [
        {name:'sett', href:'../sett/sett.html', text:'设置'},
        {name:'rank', href:'../rank/rank.html', text:'榜单'},
        {name:'stat', href:'../stat/stat.html', text:'记录'},
        {name:'help', href:'../help/help.html', text:'帮助'},
    ],
    hrefBot: [
        {name:'user', href:'../user/user.html', text:'个人'},
        {name:'nexu', href:'../nexu/nexu.html', text:'关系'},
        {name:'home', href:'../home/home.html', text:'主页'},
        {name:'fund', href:'../fund/fund.html', text:'资金'},
        {name:'inve', href:'../inve/inve.html', text:'市场'},
    ],
};
