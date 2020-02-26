var tb = "";
var tk = "";
var tv = "";
var partList = [];

function dataListToView(dataList, dataType) {
	for(let i in dataList) {
		var title = dataList[i].title;
		var outer = Elem.get('outer');
		var inner = Elem.set('div', outer, 'inner', title);
		var line = Elem.set('div', inner, 'flex', title);
		var bg = Elem.set('div', inner, 'bg', title);
		for (let j in viewConfig) {
			var btn;
			if (j == 0) {
				btn = Elem.set('div', line, 'btnData', title);
				btn.innerHTML =  i > 0 ? i + '.' + title : title;
			} else {
				btn = Elem.set('div', line, 'btnView', title);
				btn.innerHTML = viewConfig[j].viewType;
			}
			if (dataList[i].data == null) break;
			btn.idx = i;
			btn.color = viewConfig[j].color;
			btn.bgcolor = viewConfig[j].bgcolor;
			Elem.color(btn, btn.color, btn.bgcolor);
			btn.viewType = viewConfig[j].viewType;
			btn.onclick = function() {
				var btn = Elem.btn;
				if (btn) 
					Elem.color(btn, btn.color, btn.bgcolor);
				Elem.color(this, this.bgcolor, this.color);
				Elem.btn = this;
				Elem.viewWidth = 100;
				var that = dataList[this.idx];
				if (that.width && this.viewType == "table" || this.viewType == "line")
					Elem.viewWidth = that.width;
				var view = Elem.get('view_' + that.title);
				if (view) {
					Elem.remove(view);
					if (that.viewType == this.viewType) 
						return;
				}
				that.viewType = this.viewType;
				if (dataType == "csv")
					csvToView(that.data, that.title, this.viewType);
				if (dataType == "json")
					jsonToView(that.data, that.title, this.viewType);
			}
		}
	}
}


function toText(text) {
	return text.toString().replace(/</g, "|").replace(/>/g, "|");
}


function jsonToView(data, title, viewType) {
	if (data instanceof Object) {
		if (viewType == 'data') {
			dataToView(JSON.stringify(data), title, 'div');
			return;
		}
		tb = '<table>';
		for (let idx in data) {
			if (data instanceof Array) {
				if (viewType != 'table')
					tk += addTH(title, idx, true);
				if (viewType == 'table')
					jsonToTable(data[idx], idx, null, idx);
				else if (viewType == 'line')
					jsonToLine(data[idx], idx, null, idx);
				else if (viewType == 'list')
					jsonToList(data[idx], idx, null, idx);
				else if (viewType == 'k&v')
					jsonToValue(data[idx], idx, null, idx);
			} else {
				jsonToList(data[idx], idx, null, idx);
			}
		}
		tb += '<tr></tr>';
		tb += '</table>';
		dataToView(tb, title, 'table');
	}
}

function jsonToTable(data, index, parent, org) {
	if (data instanceof Object) {
		for(let idx in data) {
			jsonToTable(data[idx], idx, index, org);
		}
		if (parent == null)
			addTB(true);
	} else {
		if (org == 0) 
			addTK(index, parent, true);
		addTV(data, false);
	}
}


function jsonToLine(data, index, parent, org) {
	if (data instanceof Object) {
		for(let idx in data) {
			jsonToLine(data[idx], idx, index, org);
		}
		if (parent == null)
			addTB(true);
	} else {
		addTK(index, parent, true);
		addTV(data, false);
	}
}


function jsonToValue(data, index, parent, org) {
	if (data instanceof Object) {
		if (data instanceof Array) {
			jsonToValue(data.join('<br/>'), null, index, org);
		} else {
			for(let idx in data)
				jsonToValue(data[idx], idx, index, org);
		}
	} else {
		addTK(index, parent, true);
		addTV(data, false);
	}
	addTB(false);
}


function jsonToList(data, index, parent, org) {
	if (data instanceof Object) {
		if (data instanceof Array) {
			jsonToList(data.join('<br/>'), null, index, org);
		} else {
			for(let idx in data) 
				jsonToList(data[idx], idx, index, org);
		}
	} else {
		addTK(index, parent, true);
		addTV(data, false);
	}
	addTB(true);
}


function addTK(index, parent, ispare) {
	tk += "<th>";
	if (ispare && parseInt(index)+5)
		tk += "" + parent + "[" + index + "]";
	else if (index == null)
		tk += "" + parent + "[]";
	else
		tk += index;
	tk += "</th>";
}

function addTV(data, isjoin) {
	tv += "<td>";
	if (isjoin == null)
		tv += data.join("<br/>");
	else if (isjoin)
		tv += data.join("</td></tr><tr><td>");
	else
		tv += data.toString();
	tv += "</td>";
}

function addTB(isbreak) {
	if (isbreak) {
		if (tk)
			tb += "<tr>" + tk + "</tr>";
		if (tv)
			tb += "<tr>" + tv + "</tr>";
	} else {
		if (tk || tv)
			tb += "<tr>" + tk + tv + "</tr>";
	}
	tk = "";
	tv = "";
}

function addTH(title, idx, ishead) {
	var val = "";
	if (ishead) {
		val += "<tr><td colspan='3' class='td-title'>" + title;
		val += "[" + idx + "]" + "</td></tr>";
	}
	return val;
}

function csvToView(data, title, viewType) {
	if (viewType == 'data')
		dataToView(data, title, 'div');
	else if (viewType == 'table')
		csvToTable(data, title);
	else if (viewType == 'k&v')
		csvToValue(data, title);
	else if (viewType == 'list')
		csvToList(data, title);
	else if (viewType == 'line')
		csvToLine(data, title);
}

function arrToTable(data, title) {
	data = data.substring(1, data.length-1);
	data = data.replace('#,\n', '</th></tr><tr><th>');
	data = data.replace(/,\n/g, '</td></tr><tr><th>');
	data = data.replace(/#,/g, '</th><th>');
	data = data.replace(/@,/g, '</th><td>');
	data = data.replace(/,/g, '</td><td>');
	var val = '<table>';
	val +='<tr><th></th><th>';
	val += data;
	val += '</td></tr><tr></tr>';
	val += '</table>';
	dataToView(val, title, 'table');
};

function csvSplit(data) {
	data = data.replace(/\n\n\n/g, '\n');
	data = data.replace(/\n\n/g, '\n');
	data = data.trim();
	return data.replace('\n', '~').split('~');
}

function csvToTable(data, title) {
	var split = csvSplit(data);
	var values = split[1].split('\n');
	var val = '<table>';
	val += '<tr><th>';
	val += split[0].replace(/,/g, '</th><th>');
	val += '</th></tr>';
	for (let i in values) {
		val += '<tr><td>';
		val += values[i].replace(/,/g, '</td><td>');
		val += '</td></tr>';
	}
	val += '<tr></tr>';
	val += '</table>';
	dataToView(val, title, 'table');
};


function csvToLine(data, title) {
	var split = csvSplit(data);
	var values = split[1].split('\n');
	var val = '<table>';
	for (let i in values) {

		val += '<tr></tr>';
		val += addTH(title, i, true);
		val += '<tr><th>';
		val += split[0].replace(/,/g, '</th><th>');
		val += '</th></tr>';
		val += '<tr><td>';
		val += values[i].replace(/,/g, '</td><td>');
		val += '</td></tr>';
	}
	val += '<tr></tr>';
	val += '</table>';
	dataToView(val, title, 'table');
};


function csvToValue(data, title) {
	var split = csvSplit(data);
	var keyList = split[0].split(',');
	var valuesList = split[1].split('\n');
	var val = '<table>';
	for (let i in valuesList) {
		val += '<tr></tr>';
		val += addTH(title, i, true);
		for (let j in keyList) {
			key = keyList[j];
			value = valuesList[i].split(',')[j];
			val += '<tr><th>' + key + '</th>';
			val += '<td>' + value + '</td></tr>';
		}
	}
	val += '</td></tr><tr></tr>';
	val += '</table>';
	dataToView(val, title, 'table');
};


function csvToList(data, title) {
	var split = csvSplit(data);
	var keyList = split[0].split(',');
	var valuesList = split[1].split('\n');
	var val = '<table>';
	for (let i in valuesList) {
		val += '<tr></tr>';
		val += addTH(title, i, true);
		for (let j in keyList) {
			key = keyList[j];
			value = valuesList[i].split(',')[j];
			val += '<tr><th>' + key + '</th></tr>';
			val += '<tr><td>' + value + '</td></tr>';
		}
	}
	val += '</td></tr><tr></tr>';
	val += '</table>';
	dataToView(val, title, 'table');
};


function dataToView(val, title, type) {
	var bg = Elem.get('bg_' + title);
	var view = Elem.set(type, bg, 'view', title);
	Elem.align(view, 'left', 99.8);
	view.innerHTML = val;
}
