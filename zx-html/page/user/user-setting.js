function setElems() {
	setOuterTop();
	setOuterCenter();
	setAlert();
}


function setOuterTop() {
	var outerTop = Elem.get("outer-top");
	for (let x in items) {
		var btn = Elem.creat("div", outerTop, "button-top");
		btn.innerHTML = items[x].title;
		btn.idx = x;
		btn.onclick = function() {
			setOuterCenter(this.idx);
		}
	}
}

function setOuterCenter(x) {
    var outerCenter = Elem.get("outer-center");
    outerCenter.innerHTML = "";
    var inner = Elem.creat("div", outerCenter, "inner", x);
    setContent(inner, x || 0);
    setInner(x);
}

function setContent(inner, x) {
	var list = items[x].list;
	for (let y in list) {
		var content = Elem.creat("div", inner, "content", x+y);
		var data = list[y];
		if (data.title)
			setTitle(content, data, x);

		if (x == 0) {
			setDetail(content, data);
			setRank(content, data);
			setTags(content, data);
		}
		if (x == 1) {
			var lines = data.lines;
			setRecentLine(content, lines, x, y);
		}
		if (x == 2) {
			var lines = data.lines;
			setAchieLine(content, lines, x, y);
		}
	}
}

function setTitle(content, data, x) {
    //TITLE
    var title = Elem.creat("div", content, "title");
    title.innerHTML = data.title;
    title.x = x;
    //VICE
    var vice = Elem.creat("div", content, "vice");
    vice.innerHTML = data.vice;
    vice.x = x;
}

function setDetail(content, data) {
	var block = Elem.creat("div", content, "block");
	var head = Elem.creat("div", block, "head");
	var name = Elem.creat("div", block, "name");
	var uid = Elem.creat("div", block, "uid");
	var area = Elem.creat("span", block, "area");
	var sex = Elem.creat("span", block, "sex");
	var age = Elem.creat("span", block, "age");
	var auth = Elem.creat("span", block, "auth");
	var ladd = Elem.creat("span", block, "ladd");
	var cls = Elem.creat("span", block, "cls");

	block.id = "bg";
	head.innerHTML = "zhongxin";
	name.innerHTML = data.name;
	uid.innerHTML = "ID: " + data.uid;
	area.innerHTML = data.area + " | ";
	sex.innerHTML = data.sex;
	age.innerHTML =" | " + data.age + "岁<br/>";
	auth.innerHTML = data.auth + " | ";
	ladd.innerHTML = data.ladd + "阶";
	cls.innerHTML =  " | " + data.cls;
}


function setRank(content, data) {

	var block = Elem.creat("div", content, "block");
	//TIPS
	var tips = Elem.creat("div", block, "tips");
	tips.innerHTML = data.tipsRank;
	var flex = Elem.creat("div", block, "flex");
	//RANK-ALL
	var all = Elem.creat("div", flex, "rank");
	var city = Elem.creat("div", flex, "rank");
	var area = Elem.creat("div", flex, "rank");
	all.innerHTML = "全国排名<br/><h2> " + data.rankAll;
	city.innerHTML = "全市排名<br/><h2> " + data.rankCity;
	area.innerHTML = "全区排名<br/><h2> " + data.rankArea;


	var flex = Elem.creat("div", block, "flex");
	var all = Elem.creat("div", flex, "value");
	var used = Elem.creat("div", flex, "value");
	var surplus = Elem.creat("div", flex, "value");
	all.innerHTML = "总权值<br/><h2>" + data.valueAll;
	used.innerHTML = "已分配<br/><h2>" + data.valueUsed;
	surplus.innerHTML = "未分配<br/><h2>" + data.valueSurplus;
}


function setTags(content, data) {
	var tags = data.tags;
	if (!tags) return;
	//TIPS
	var block = Elem.creat("div", content, "block");
	var tips = Elem.creat("div", block, "tips");
	tips.innerHTML = data.tipsTag;

	var flex1 = Elem.creat("div", block, "flex", 1);
	var flex2 = Elem.creat("div", block, "flex", 2);
	var flex3 = Elem.creat("div", block, "flex", 3);
	var flex4 = Elem.creat("div", block, "flex", 4);
	var flex5 = Elem.creat("div", block, "flex", 5);

	for(let y in tags) {
		var _data = tags[y];
		//TAG
		var tag = Elem.creat("div", flex1, "user-tag", y);
		tag.innerHTML = _data.tag;
		tag.btnIdx = y;
		tag.onclick = function() {
			setSearchAlert(this);
		}

		//VALUE
		var value = Elem.creat("div", flex2, "value", y);
		value.innerHTML = data.valueStr.replace("#1", _data.value);

		//ALLOT
		var allot = Elem.creat("div", flex3, "allot", y);
		allot.innerHTML = data.allotStr.replace("#2", _data.allot);

		//EDIT
		var edit = Elem.creat("div", flex4, "button-min", y);
		edit.setAttribute("btype", "permit");
		edit.innerHTML = "编辑标签";
		edit.data = _data;
		edit.idx = y;
		edit.onclick = function() {
			config.tagData = this.data;
			config.tagIdx = this.idx;
			setEditAlert(this);
		}
	}

	//EDIT_DETAIL
	var edit = Elem.creat("div", flex5, "button");
	edit.setAttribute("btype", "permit");
	edit.innerHTML = "编辑资料";
	flex4.style.padding = "5px";
	flex5.style.padding = "10px 5px";
	flex5.style.marginTop = "5px";
}


function setEditAlert(button) {
	hideAlert();
	var data = config.tagData;
	var box = Elem.get("alert-box");
    var title = Elem.get("edit-title");
    var block = Elem.get("edit-block");
    block.innerHTML = block.innerHTML.replace("#0", data.tag).replace("#1", data.value).replace("#2", data.allot);
    block.style.maxHeight = config.alertHeight + "px";
    Elem.color(box, "", getColorLight());
    showAlert("edit-bg");
}


function setAchieLine(content, lines, x, y) {
    var list = items[x].list[y];
    var block = Elem.creat("div", content, "block", x);
    for (let z in lines) {
        var data = lines[z];

        //BLOCK
        var flex = Elem.creat("div", block, "ach-flex", z);	
        var left = Elem.creat("div", flex, "ach-cell ach-left");
        var right = Elem.creat("div", flex, "ach-cell  ach-right");

        data.name = "<h3>" + data.name + "</h3>";
        data.prect = "<h3>" + data.prect + "</h3>";
        left.innerHTML = data.name + data.desc;
        right.innerHTML = data.prect + data.value;
    }
}

function setRecentLine(content, lines, x, y) {
	var list = items[x].list[y];
    var block = Elem.creat("div", content, "block", x);
    for (let z in lines) {
        var data = lines[z];
        var title = {};
        if (z == 0)
       		title = Elem.creat("div", block, "rec-title", z);	
        else if(lines[z].date != lines[z-1].date) {
       		title = Elem.creat("div", block, "rec-title", z);	
        }
        title.innerHTML = data.date;
        //BLOCK
        var flex = Elem.creat("div", block, "ach-flex", z);	
        var left = Elem.creat("div", flex, "ach-cell rec-left");
        var right = Elem.creat("div", flex, "ach-cell rec-right");
        data.time =  data.time.replace("日", "日<h3>");
        data.unit = "<h3>" + data.unit + "</h3>";
        left.innerHTML = data.time;
        right.innerHTML = data.unit + data.desc;
    }
}


function setAlert() {
    Elem.get("btn-doit").onclick = function() {
        refresh();
        hideAlert();
    }
}

function refresh() {
	var data = items[0].list[0];
	var idx = config.tagIdx;
	var tag = Elem.get("input-tag");
	var value = Elem.get("input-value");
	var allot = Elem.get("input-allot");

	data.tags[idx] = {
		tag: tag.value,
		value: data.valueStr.replace("#1", value.value),
		allot: data.allotStr.replace("#2", allot.value)
	}
	console.log(data.tags);
	if (tag.value)
		Elem.get("user-tag_" + idx).innerHTML = tag.value;
	if (value.value)
		Elem.get("value_" + idx).innerHTML = data.valueStr.replace("#1", value.value);
	if (allot.value)
		Elem.get("allot_" + idx).innerHTML = data.allotStr.replace("#2", allot.value);
}





function onInputTag() {

}

function onInputValue() {

}

function onInputAllot() {

}



