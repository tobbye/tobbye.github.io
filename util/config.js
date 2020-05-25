

var Config = {
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
            hostType: 'github',   
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
        host: {
            html: 'file:///C:/Users/ZHANGJIALIANG/<br/>Documents/GitHub/tobbye.github.io',
            github: 'http://tobbye.github.io',
            local: 'http://localhost:8888',
            http: 'http://tobbye.top',
        },
        page: {
            alertMaxWidth: 1000,
            alertMinMargin: 20,
            alertOffset: 716,
            outerOffset: 220,
            innerOffset: 770, 
            minHeight: 700,
            zoomMobile: 1.00,
            zoomWechat: 1.00,
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
    arrow: [
        {top: '35%', left: '10px', right: '70%', bottom: '35%'},
        {top: '15%', left: '30%', right: '30%', bottom: '60%'},
        {top: '35%', left: '70%', right: '10px', bottom: '35%'},
        {top: '60%', left: '30%', right: '30%', bottom: '12%'},
    ],
};
