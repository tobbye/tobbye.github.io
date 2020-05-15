var tempData = {
	searchData: [
		{order: 1, val: 948670, uid: 'd110001', name: '李刚猛', ladd: 18, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['身份标签1', '身份标签2']},
		{order: 2, val: 690663, uid: 'd110002', name: '张雄壮', ladd: 17, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['阶层标签1', '阶层标签2']},
		{order: 3, val: 582830, uid: 'd110004', name: '章威武', ladd: 12, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['成就标签1', '成就标签2']},
        {order: 4, val: 699972, uid: 'd110002', name: '王坚强', ladd: 20, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['排名标签1', '排名标签2']},
		{order: 5, val: 414480, uid: 'd110005', name: '徐福贵', ladd: 17, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['评价标签1', '评价标签2']},
		{order: 6, val: 341222, uid: 's110006', name: '赵铁柱', ladd: 15, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['理财专家', '投资顾问']},
		{order: 7, val: 202098, uid: 's110007', name: '赵铁牛', ladd: 15, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['理财专家', '投资顾问']},
        {order: 8, val: 182256, uid: 's110008', name: '赵铁蛋', ladd: 15, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['理财专家', '投资顾问']},
	],
    unitData: {
        uid: 'uid001', 
        name: 'The Sponsor', 
        ladd: 17, 
        tag: ['自定义标签1', '自定义标签2', '自定义标签3'], 
        mark: ["身份标签1", "身份标签2"],
        mark2: ["阶层标签1", "阶层标签2"],
        mark3: ["成就标签1", "成就标签2"],
        mark4: ["排名标签1", "排名标签2"],
        mark5: ["评价标签1", "评价标签2"],
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
        // `陈晴晴2009，叶梦梦2009，王嫚嫚2010，胡泱秧2013，邓小丽2016，赵素华2016，黎桂清2017，章威威2018，
        // 崔慧珍2019，鲍青青2019，汤小英2019，张沙沙2019觉得很赞！`,

    },

	chatData: [
    {text:"大佬您好，我有个价值20亿的项目，前无古人后无来者！", time:"11：25", isMine:0},
    {text:"静静的听你装完这个逼。", time:"11：25", isMine:1},
    {text:"如何一块变两块？", time:"11：25", isMine:0},
    {text:`今天一块变两块，
        明天两块变四块，
后天四块变八块，
大后天一十六块，
十天二零四八块，
一月二十一亿块。`, time:"11：27", isMine:0},
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
如此目标实现！`, time:"11：27", isMine:0},

    {text:`二狗子，你这个项目我很有兴趣，你先去市场调研一下，出个详细的策划案出来，把步骤和细节都罗列出来，最好到非洲金矿实地考察一下。`, time:"11：30", isMine:1},
    {text:`另外PPT也是必不可少的，一定要做的美观一点，你上次那个「母猪如何择优配种」项目就是栽在PPT上，做的像狗屎一样，这次可不能再像上次那样瞎搞了。`, time:"11：30", isMine:1},
    {text:`启动资金的问题你不用担心，我大力支持。加油干！二狗子！`, time:"11：30", isMine:1},
    ],
}

function setUserFlex(user, line, isNext) {
    if (config.isRank || isNext) {
        var top = Elem.creat('div', user, 'user-top');
        var order = Elem.creat('div', top, 'user-order');
        var value = Elem.creat('div', top, 'user-value');

        order.innerHTML = line.order;
        value.innerHTML = line.value;  
    }

    var flex = Elem.creat('div', user, 'user-flex');
    var head = Elem.creat('img', flex, 'user-head');
    var left = Elem.creat('div', flex, 'user-left');
    var right = Elem.creat('div', flex, 'user-right');
    var name = Elem.creat('div', left, 'user-name');
    var marks = Elem.creat('div', left, 'user-flex');
    var ladd = Elem.creat('div', right, 'user-ladd');
    var group = Elem.creat('div', right, 'user-group');
    line.mark = line.mark || ["身份标签1", "身份标签2"];
    for (let i in line.mark) {
        var mark = Elem.creat('div', marks, 'user-mark');
        mark.innerHTML = line.mark[i];
        mark.style.borderColor = getColorType();
    }
    Elem.color(head, '', getColorLight());
    Elem.color(group, 'white', getColorType());
    Elem.style(group, 'borderColor', getColorType());

    name.innerHTML = line.name || line.inver;
    ladd.innerHTML = line.ladd + '阶' || '??阶';
    group.innerHTML = line.group || '未知';
    return flex;
}


function setUserAlert(user) {
    var box = Elem.get('alert-box');
    var block = Elem.get('detail-block');
    Elem.color(box, '', getColorLight());
    block.innerHTML = '';

    var x = user.x;
    var data = user.data;
    var line = user.line;
    var body = Elem.creat('div', block, 'user-body');
    var flex = setUserFlex(body, line, x);
    var tags = Elem.creat('div', body, 'user-tags');
    var desc = Elem.creat('div', body, 'user-desc');
    if (line.tag) {
        for (let i in line.tag) {
            var tag = Elem.creat('div',tags, 'user-tag');
            tag.innerHTML = line.tag[i];
            tag.onclick = function() {
                setSearchAlert(this);
            }
        }
    }

    desc.innerHTML = line.desc.replace(/\n/g, '<br/>');;
    
    var button = Elem.get('detail-button');
    button.innerHTML = '';
    for (let k in data.buttonIdx) {
        var _idx = data.buttonIdx[k];
        var _data = config.buttons[_idx];
        //BUTTON
        var btn = Elem.creat('div', button, 'button');
        btn.setAttribute('btype', _data.btype);
        btn.innerHTML = _data.text;
        btn.data = _data;
        btn.user = user;
        btn.onclick = function () {
            setNexu(this);
        }
    }
    showAlert('detail-bg');
}

function setSearchAlert(button) {
    hideAlert('detail-bg');
    var box = Elem.get("alert-box");
    var title = Elem.get("search-title");
    var block = Elem.get("search-block");
    Elem.color(box, "", getColorLight());
    block.innerHTML = "";
    block.style.maxHeight = config.alertHeight + "px";
    title.innerHTML = config.titleStr.replace("#0", button.innerHTML);
    for (let z in tempData.searchData) {

        var user = Elem.creat("div", block, "user-block", z);
        var line = tempData.searchData[z];
        var order = line.order + "th";
        if (order.length == 3)
            line.order = order.replace("1th", "1st").replace("2th", "2nd").replace("3th", "3rd");
        line.group = line.uid[0].replace('s','赞助商').replace('d','淘金者');
        line.value = "权值: " + Parse.sub4Num(line.val);
        setUserFlex(user, line, true);
    }
    showLog('搜索成功!');
    showAlert("search-bg");
}


function setChatAlert() {
    hideAlert("detail-bg");
    var box = Elem.get("alert-box");
    var title = Elem.get("chat-title");
    var block = Elem.get("chat-block");
    var input = Elem.get("chat-textarea");
    Elem.color(box, "", getColorLight());
    Elem.color(input, getColorLight(), "");
    input.placeholder = "输入内容";
    title.innerHTML = document.body.line.name;
    box.style.maxHeight = (config.windHeight - 440) + "px";
    block.style.maxHeight = (config.windHeight - 703) + "px";
    block.innerHTML = "";
    for (let i in tempData.chatData) {
        var data = tempData.chatData[i];
        var ctype = data.isMine ? "right" : "left";
        setChatText(block, ctype, data.text);
    }
    var send = Elem.get("btn-send");
    send.block = block;
    send.onclick = function() {
        var input = Elem.get("chat-textarea");
        setChatText(this.block, "right", input.value);
        if (input.value != "")
            tempData.chatData.push({
                text: input.value,
                date: Parse.getDate(),
                time: Parse.getTime(),
                isMine: 1,
            });
        Elem.color(input, getColorLight(), "");
        input.placeholder = "输入内容";
        input.value = "";
    }
    
    block.lastChild.scrollIntoView();
    showAlert("chat-bg");
}


function setChatText(block, ctype, value) {
    if (value == "") {
        hideAlert();
        return;
    }
    var flex = Elem.creat("div", block, "chat-flex");
    var text = Elem.creat("div", flex, "chat-text");
    Elem.attr(flex, "ctype", ctype);
    Elem.attr(text, "ctype", ctype);
    text.innerHTML = value.replace(/\n/g, "<br/>");
    if (getChatLength(value) < 17)
        text.style.wordBreak = "keep-all";
    text.scrollIntoView();
}

function getChatLength(value) {
    var len = 0;
    var list = value.split('\n');
    for (let idx in list) {
        if (list[idx].length > len)
            len = list[idx].length;
    }
    return len;
}


function onChatFocus() {
    var box = Elem.get("alert-box");
    var block = Elem.get("detail-block");
    if (config.isMobile && !config.isWechat) {
        box.style.maxHeight = (config.windHeight - 940) + "px";
        block.style.maxHeight = (config.windHeight - 1203) + "px";
    }
    block.lastChild.scrollIntoView();
    var input = Elem.get("chat-textarea");
    Elem.color(input, getColorType(), "");
    input.value = "";

    // Style.height("detail-block", "550px");
}











