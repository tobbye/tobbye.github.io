function setElems() {
	setOuterTop();
	setOuterCenter();
	setAlert();
}


function setOuterTop() {
	var outerTop = Elem.get("outer-top");
	for (let x in items) {
		var btn = Elem.set("div", outerTop, "button-top");
		btn.innerHTML = items[x].title;
		btn.idx = x;
		elems[x].btntop = btn;
		btn.onclick = function() {
			values.innerIdx = this.idx;
			setInner();
		}
	}
}

function setOuterCenter() {
	var outerCenter = Elem.get("outer-center");
	for (let x in items) {
		var inner = Elem.set("div", outerCenter, "inner", x);
		elems[x].inner = inner;
		setContent(inner, x);
	}
}

function setContent(inner, x) {
	var list = items[x].list;
	for (let y in list) {
		var content = Elem.set("div", inner, "content", x+y);
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
    var title = Elem.set("div", content, "title");
    title.innerHTML = data.title;
    title.x = x;
    //VICE
    var vice = Elem.set("div", content, "vice");
    vice.innerHTML = data.vice;
    vice.x = x;
}

function setDetail(content, data) {
	var block = Elem.set("div", content, "block");
	var head = Elem.set("div", block, "head");
	var name = Elem.set("div", block, "name");
	var uid = Elem.set("div", block, "uid");
	var area = Elem.set("span", block, "area");
	var sex = Elem.set("span", block, "sex");
	var age = Elem.set("span", block, "age");
	var auth = Elem.set("span", block, "auth");
	var ladd = Elem.set("span", block, "ladd");
	var cls = Elem.set("span", block, "cls");

	block.id = "detail";
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

	var block = Elem.set("div", content, "block");
	//TIPS
	var tips = Elem.set("div", block, "tips");
	tips.innerHTML = data.tipsRank;
	var flex = Elem.set("div", block, "flex");
	//RANK-ALL
	var all = Elem.set("div", flex, "rank");
	var city = Elem.set("div", flex, "rank");
	var area = Elem.set("div", flex, "rank");
	all.innerHTML = "全国排名<br/><h3> " + data.rankAll;
	city.innerHTML = "全市排名<br/><h3> " + data.rankCity;
	area.innerHTML = "全区排名<br/><h3> " + data.rankArea;


	var flex = Elem.set("div", block, "flex");
	var all = Elem.set("div", flex, "value");
	var used = Elem.set("div", flex, "value");
	var surplus = Elem.set("div", flex, "value");
	all.innerHTML = "总权值<br/><h3>" + data.valueAll;
	used.innerHTML = "已分配<br/><h3>" + data.valueUsed;
	surplus.innerHTML = "未分配<br/><h3>" + data.valueSurplus;
}


function setTags(content, data) {
	var tags = data.tags;
	if (!tags) return;
	//TIPS
	var block = Elem.set("div", content, "block");
	var tips = Elem.set("div", block, "tips");
	tips.innerHTML = data.tipsTag;

	var flex1 = Elem.set("div", block, "flex", 1);
	var flex2 = Elem.set("div", block, "flex", 2);
	var flex3 = Elem.set("div", block, "flex", 3);
	var flex4 = Elem.set("div", block, "flex", 4);
	var flex5 = Elem.set("div", block, "flex", 5);

	for(let y in tags) {
		var data = tags[y];
		//BUTTON
		var button = Elem.set("div", flex1, "user-tag");
		button.innerHTML = data.text;
		button.btnIdx = y;
		button.onclick = function() {
			setSearch(this);
		}

		//VALUE
		var value = Elem.set("div", flex2, "value");
		value.innerHTML = "分配权值<br/><h3>" + data.value;

		//ALLOT
		var allot = Elem.set("div", flex3, "allot");
		allot.innerHTML = "分配策略<br/><h3>" + data.limit + "<br/>+" + data.allot * 100 + "%";

		//EDIT
		var edit = Elem.set("div", flex4, "button-min");
		edit.innerHTML = "编辑标签";
		Elem.color(edit, "white", "green");
		// Elem.style(edit, "fontSize", "3.3em");
	}

	//EDIT_DETAIL
	var edit = Elem.set("div", flex5, "button");
	edit.innerHTML = "编辑资料";
	edit.style.marginTop = "0px";
	edit.style.marginBottom = "15px";
	flex4.style.marginTop = "5px";
	Elem.color(edit, "white", "green");
}


function setAchieLine(content, lines, x, y) {
    var list = items[x].list[y];
    var block = Elem.set("div", content, "block", x);
    for (let z in lines) {
        var data = lines[z];

        //BLOCK
        var flex = Elem.set("div", block, "ach-flex", z);	
        var left = Elem.set("div", flex, "ach-cell ach-left");
        var right = Elem.set("div", flex, "ach-cell  ach-right");

        data.name = "<h4>" + data.name + "</h4>";
        data.prect = "<h4>" + data.prect + "</h4>";
        left.innerHTML = data.name + data.desc;
        right.innerHTML = data.prect + data.value;
    }
}

function setRecentLine(content, lines, x, y) {
	var list = items[x].list[y];
    var block = Elem.set("div", content, "block", x);
    for (let z in lines) {
        var data = lines[z];
        var title = {};
        if (z == 0)
       		title = Elem.set("div", block, "rec-title", z);	
        else if(lines[z].date != lines[z-1].date) {
       		title = Elem.set("div", block, "rec-title", z);	
        }
        title.innerHTML = data.date;
        //BLOCK
        var flex = Elem.set("div", block, "ach-flex", z);	
        var left = Elem.set("div", flex, "ach-cell rec-left");
        var right = Elem.set("div", flex, "ach-cell rec-right");
        data.time =  data.time.replace("日", "日<h4>");
        data.unit = "<h4>" + data.unit + "</h4>";
        left.innerHTML = data.time;
        right.innerHTML = data.unit + data.desc;
    }
}


function setAlert() {
	hideAlert();
    Elem.get("btn-close").onclick = function() {
        hideAlert();
    }
}

function setSearch(button) {
	var box = Elem.get("alert-box");
    var title = Elem.get("alert-title");
    var scroll = Elem.get("alert-scroll");
    Elem.color(box, "", getCurColor(1));
    title.innerHTML = "标签:" + button.innerHTML;
	for (let z in config.lines) {
		var line = Elem.set("div", scroll, "user-line", z);
		line.flex = Elem.set("div", line, "user-flex");
		line.head = Elem.set("div", line.flex, "user-head");
		line.left = Elem.set("div", line.flex, "user-left");
		line.name = Elem.set("div", line.left, "user-name");
		line.mark = Elem.set("div", line.left, "user-flex");
		line.right = Elem.set("div", line.flex, "user-right");
		line.ladd = Elem.set("div", line.right, "user-ladd");
		line.nexu = Elem.set("div", line.right, "user-nexu");
		var data = config.lines[z];
		setFlex(data, line);
	}
    showAlert();
}

function setFlex(data, line) {
	if (data.tag) {
		for (let i in data.tag) {
			var tag = Elem.set("div", line.tag, "user-tag");
			tag.innerHTML = data.tag[i];
		}
	}
	if (data.mark) {
		for (let i in data.mark) {
			var mark = Elem.set("div", line.mark, "user-mark");
			mark.innerHTML = data.mark[i];
			mark.style.borderColor = getCurColor(1);
		}
	}
	line.name.innerHTML = data.name;
	line.nexu.innerHTML = data.nexu;
	line.ladd.innerHTML = data.ladd + "阶";
}

//显示弹窗
function showAlert() {
    Style.display("alert-bg", "inline");
    Style.display("alert-box", "inline");
    Style.display("alert-block", "inline");
}


//隐藏弹窗
function hideAlert() {
    Style.display("alert-bg", "none");
    Style.display("alert-box", "none");
    Style.display("alert-block", "none");
}



