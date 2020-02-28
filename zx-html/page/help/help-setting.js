function setElems() {
	getAgent();
	setOuterTop();
	setOuterCenter();
	setAgent();
	setInner();
}


function setOuterTop() {
	return;
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