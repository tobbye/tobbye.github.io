function setElems() {
	getAgent();
	setOuterTop();
	setOuterCenter();
	setAgent();
	setInner();
}


function setOuterTop() {
	for (var i = 0;i<100;i++) {
	rollLadd = 1;
	var allCount = Math.pow(2, 10);
    var rollCount = Math.floor(Math.random() * allCount);
    getRoll(allCount, rollCount);
    console.log("allCount:" + allCount + ' rollCount:' + rollCount + " rollLadd:" + rollLadd);
	}
}

var rollLadd;

function getRoll(all, roll) {
	all = all / 2;
    if (roll > all) {
        rollLadd += 1;
         getRoll(all, roll - all);
    } else{
        return rollLadd;
    }
}

function setOuterCenter() {
	var outerCenter = Elem.get('outer-center');
	for (let x in items) {
		var inner = Elem.set('div', outerCenter, 'inner', x);
		setContent(inner, x);
	}
}

function setContent(inner, x) {
	var list = items[x].list;
	for (let y in list) {
		var content = Elem.set('div', inner, 'content', x+y);
		var data = list[y];
		if (data.title)
			setTitle(content, data, x);
		if (data.text)
			setText(content, data, x, y);
	}
}

function setTitle(content, data, x) {
    //TITLE
    var title = Elem.set('div', content, 'title');
    title.innerHTML = data.title;
    title.x = x;
    //VICE
    var vice = Elem.set('div', content, 'vice');
    vice.innerHTML = data.vice;
    vice.x = x;
}

function setText(content, data, x, y) {

	var block = Elem.set('div', content, 'block');
	var text = Elem.set('div', block, 'text');
	text.innerHTML = data.text;

}