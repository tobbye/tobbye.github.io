function setElems() {
    setOuterTop();
    setOuterCenter();
    setOuterBot();
    setInner();
}


function setContent(inner, x) {
    var list = items[x].list;
    for (let y in list) {
        var content = Elem.creat('div', inner, 'content', y);
        var data = list[y];
        setTitle(content, data, x);
        setLine(content, data.lines, x, y);
    }
}


function setTitle(content, data, x) {
    //TITLE
    if (data.title) {
        var title = Elem.creat('div', content, 'title');
        title.innerHTML = data.title;
        title.x = x;
    }

    //VICE
    if (data.vice) {
        var vice = Elem.creat('div', content, 'vice');
        vice.innerHTML = data.vice;
        vice.x = x;
    }
}


function setLine(content, lines, x, y) {
    if (!lines) return;
    var list = items[x].list[y];
    var block = Elem.creat('table', content, 'block', x);
    for (let z in lines) {
        var data = lines[z];
        data.color = items[x].color;

        //BLOCK
        var flex = Elem.creat('tr', block, 'row', z);	
        var left = Elem.creat('td', flex, 'col', 0);
        var stamp = Elem.creat('td', flex, 'col', 1);
        var right = Elem.creat('td', flex, 'col', 2);

        if (z == 0) {
            left.innerHTML = data.left;
            stamp.innerHTML = data.stamp;
            right.innerHTML = data.right;
        } else {
            left.innerHTML = data.left ? list.left.replace('#0', Parse.sub4Num(data.left)) : '';
            stamp.innerHTML = data.stamp;
            right.innerHTML = data.right ?  list.right.replace('#0', Parse.sub4Num(data.right)) : '';
        }
    }
}





function getjson() {
    var sort = config.sort;
    var json = Storage.get('recd-json') || [];
    json = json.reverse();
    for (let x in json) {
        for (let y in sort) {
            if (json[x].type == sort[y].type) {
                pushdata(json[x], sort, y);
                break;
            }
        }
    }
    console.log(items);
}

function pushdata(json, sort, y) {
    var data = {
        stamp: '<h4>' + json.date.split('年')[1] + '</h4>' + json.time,
        left: json.value * sort[y].left,
        right: json.value * sort[y].right
    };
    var order = config.order;
    var idx = sort[y].idx;
    var list = items[idx].list[0];
    if (items[idx].list.length == 1) {
        order[idx] = list;
    }
    if (!order[idx].day || order[idx].day == json.date) {
        order[idx].vice = json.date;
        order[idx].lines.push(data);
    } else {
        var newlist = {
            title:'',
            vice: json.date,
            left: list.left,
            right:list.right,
            lines:[list.lines[0]]
        }
        items[idx].list.push(newlist);
        order[idx] = newlist;
        order[idx].lines.push(data);
    }
    order[idx].day = json.date;
}



