var Recd = new __Recd();

function __Recd() {

    this.init = function() {
        this.getjson();
        this.creatElems();
        Container(this);
    }


    this.creatElems = function() {
        Alert.creatOuterTop(this);
        Alert.creatOuterCenter(this);
        Alert.creatOuterBot(this);
        Alert.showInner();
    }

    this.creatBlock = function(content, data) {
        this.creatLine(content, data);
    }


    this.creatLine = function(content, data) {
        if (!data.lines) return;
        let lines = data.lines;
        let block = Elem.creat('table', content, 'block');
        for (let z in lines) {
            let line = lines[z];

            //BLOCK
            let flex = Elem.creat('tr', block, 'row', 'lines['+z+']');	
            let left = Elem.creat('td', flex, 'col', 'left');
            let stamp = Elem.creat('td', flex, 'col', 'stamp');
            let right = Elem.creat('td', flex, 'col', 'right');

            if (z == 0) {
                left.innerHTML = line.left;
                stamp.innerHTML = line.stamp;
                right.innerHTML = line.right;
            } else {
                left.innerHTML = line.left ? data.left.replace('#0', Parse.sub4Num(line.left)) : '';
                stamp.innerHTML = line.stamp;
                right.innerHTML = line.right ?  data.right.replace('#0', Parse.sub4Num(line.right)) : '';
            }
        }
    }





    this.getjson = function() {
        var sort = cfg.sort;
        var json = Storage.get('recd-json') || [];
        json = json.reverse();
        for (let x in json) {
            for (let y in sort) {
                if (json[x].type == sort[y].type) {
                    this.pushdata(json[x], sort, y);
                    break;
                }
            }
        }
        console.log(items);
    }

    this.pushdata = function(json, sort, y) {
        var data = {
            stamp: json.date.split('年')[1] + '<h3>' + json.time,
            left: json.value * sort[y].left,
            right: json.value * sort[y].right
        };
        var order = cfg.order;
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


}

