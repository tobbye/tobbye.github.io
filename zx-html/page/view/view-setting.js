window.onload = function() {
	initData();
}

function initData() {
	var viewConfig = [
		{viewType:"data", color:"#846", bgcolor:"#eac", jsonFunc: toText(jsonToView), csvFunc: toText(csvToView)},
		{viewType:"table", color:"#864", bgcolor:"#eca", jsonFunc: toText(jsonToTable), csvFunc: toText(csvToTable)},
		{viewType:"line", color:"#468", bgcolor:"#ace", jsonFunc: toText(jsonToLine), csvFunc: toText(csvToLine)},
		{viewType:"k&v", color:"#648", bgcolor:"#cae", jsonFunc: toText(jsonToValue), csvFunc: toText(csvToValue)},
		{viewType:"list", color:"#684", bgcolor:"#cea", jsonFunc: toText(jsonToList), csvFunc: toText(csvToList)},
	];

	var csvList = [
		{data: null, title: 'CSV DATA'},
		{data: equip, title: 'EquipData'},
		{data: inve, title: 'InveData'},
	];

	var jsonList = [
		{data: null, title: 'JSON DATA'},
		// {data: viewConfig, title: 'ViewFunction'},
		{data: fundValue, title: 'FundValue'},
		{data: logoText, title: 'LogoText'},
		{data: logoImage, title: 'LogoImage'},
		{data: inveLadd, title: 'InveLadd'},
		{data: inveItem, title: 'InveItem'},
		{data: rankItem, title: 'RankItem'},
		{data: nexuItem, title: 'NexuItem'},
		{data: statItem, title: 'StatItem'},
		{data: userItem, title: 'UserItem'},
	];
	dataListToView(csvList, "csv", viewConfig);
	dataListToView(jsonList, "json", viewConfig);
}


function dataListToView(dataList, dataType, viewConfig) {
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
			if (dataList[i].data == null) 
				break;
			btn.x = i;
			btn.title = title;
			btn.data = dataList[i];
			btn.color = viewConfig[j].color;
			btn.bgcolor = viewConfig[j].bgcolor;
			Elem.color(btn, btn.color, btn.bgcolor);
			btn.viewType = viewConfig[j].viewType;
			btn.onclick = function() {
				var view;
				var btn = Elem.btn;
				if (btn) {
					Elem.color(btn, btn.color, btn.bgcolor);
					var view = Elem.get('view_' + btn.title);
					Elem.remove(view);
				}
				if (btn &&  btn == this) {
					Elem.btn = null;
					return;
				}

				Elem.color(this, this.bgcolor, this.color);
				Elem.btn = this;

				if (dataType == "csv")
					csvToView(this.data, this.title, this.viewType);
				if (dataType == "json")
					jsonToView(this.data, this.title, this.viewType);
			}
		}
	}
}



function jsonToView(json, title, viewType) {
	var data = [];
	if (json instanceof Array)
		data = json;
	else
		data.push(json);
	if (viewType == 'data')
		dataToView(JSON.stringify(data), title);
	else if (viewType == 'table')
		jsonToTable(data, title);
	else if (viewType == 'line')
		jsonToLine(data, title);
	else if (viewType == 'list')
		jsonToList(data, title);
	else if (viewType == 'k&v')
		jsonToValue(data, title);
}

function jsonToTable(data, title) {
	var val = "";
	for (let x in data) {
		if (data[x] instanceof Object) {
			val += "</tr><tr>";
			for (let y in data[x]) {
				var str = JSON.stringify(data[x][y]);
				str = toMatch(str, title);
				val += "<td><h3>" + y + "</h3>" + str + "</td>";
			}
		} else{
			val += "<tr><td colspan='100' >" + data[x] + "</td></tr>";
		}
	}
	dataToView(val, title);
}


function jsonToLine(data, title) {
	var val = "";
	for (let x in data) {
		val += addTitle(title, x, data instanceof Array);
		if (data[x] instanceof Object) {
			for (let y in data[x]) {
				var str = JSON.stringify(data[x][y]);
				str = toMatch(str, title);
				val += "<td><h3>" + y + "</h3>" + str + "</td>";
			}
		} else{
			val += "<tr><td colspan='100' >" + data[x] + "</td></tr>";
		}
	}
	dataToView(val, title);
}


function jsonToValue(data, title) {
	var val = "";
	for (let x in data) {
		val += addTitle(title, x, data instanceof Array);
		if (data[x] instanceof Object) {
			for (let y in data[x]) {
				var str = JSON.stringify(data[x][y]);
				str = toMatch(str, title);
				val += "<tr><th>" + y + "</th><td>" + str + "</td></tr>";
			}
		} else{
			val += "<tr><td colspan='100' >" + data[x] + "</td></tr>";
		}
	}
	dataToView(val, title);
}


function jsonToList(data, title) {
	var val = "";
	for (let x in data) {
		val += addTitle(title, x, data instanceof Array);
		if (data[x] instanceof Object) {
			for (let y in data[x]) {
				var str = JSON.stringify(data[x][y]);
				str = toMatch(str, title);
				val += "<tr><th>" + y + "</th></tr><tr><td>" + str + "</td></tr>";
			}
		} else{
			val += "<tr><td colspan='100' >" + data[x] + "</td></tr>";
		}
	}
	dataToView(val, title);
}



function csvToView(data, title, viewType) {
	if (viewType == 'data')
		dataToView(data, title);
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
	data = data.replace(/,\n/g, '</td></tr><tr><th>');
	data = data.replace(/,/g, '</td><td>');
	var val = '<table>';
	val +='<tr><th></th><th>';
	val += data;
	val += '</td></tr><tr></tr>';
	val += '</table>';
	dataToView(val, title);
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
	dataToView(val, title);
};


function csvToLine(data, title) {
	var split = csvSplit(data);
	var values = split[1].split('\n');
	var val = '<table>';
	for (let i in values) {

		val += '<tr></tr>';
		val += addTitle(title, i, true);
		val += '<tr><th>';
		val += split[0].replace(/,/g, '</th><th>');
		val += '</th></tr>';
		val += '<tr><td>';
		val += values[i].replace(/,/g, '</td><td>');
		val += '</td></tr>';
	}
	val += '<tr></tr>';
	val += '</table>';
	dataToView(val, title);
};


function csvToValue(data, title) {
	var split = csvSplit(data);
	var keyList = split[0].split(',');
	var valuesList = split[1].split('\n');
	var val = '<table>';
	for (let i in valuesList) {
		val += '<tr></tr>';
		val += addTitle(title, i, true);
		for (let j in keyList) {
			key = keyList[j];
			value = valuesList[i].split(',')[j];
			val += '<tr><th>' + key + '</th>';
			val += '<td>' + value + '</td></tr>';
		}
	}
	val += '</td></tr><tr></tr>';
	val += '</table>';
	dataToView(val, title);
};


function csvToList(data, title) {
	var split = csvSplit(data);
	var keyList = split[0].split(',');
	var valuesList = split[1].split('\n');
	var val = '<table>';
	for (let i in valuesList) {
		val += '<tr></tr>';
		val += addTitle(title, i, true);
		for (let j in keyList) {
			key = keyList[j];
			value = valuesList[i].split(',')[j];
			val += '<tr><th>' + key + '</th></tr>';
			val += '<tr><td>' + value + '</td></tr>';
		}
	}
	val += '</td></tr><tr></tr>';
	val += '</table>';
	dataToView(val, title);
};


function dataToView(val, title, type) {
	var bg = Elem.get('bg_' + title);
	var view = Elem.set("table", bg, 'view', title);
	view.innerHTML = val;
}



function addTitle(title, x, isArr) {
	var val = "<tr><td colspan='3' class='td-title'>" + title;
	if (isArr)
		val += "[" + x + "]" + "</td></tr>";
	else
		val += "." + x + "</td></tr>";
	return val;
}


function toText(text) {
	text = text.toString().replace(/</g, "|").replace(/>/g, "|");
	return text.replace(/\n/g, '<br/>').replace(/\t/g, '    ').replace(/\r/g, '');
}

function toMatch(str, title) {
	if (title == "ViewFunction")
		return str;
	str = str.replace(/'/g, '').replace(/"/g, '').replace(/},/g, '}');
	str = str.replace(/\[{/g, '<table><tr><td><h3>').replace(/}]/g, ']');
	str = str.replace(/\[/g, '<table><tr><td>').replace(/]/g, '</td></tr></table>');
	str = str.replace(/{/g, '<tr><td><h3>').replace(/}/g, '</td></tr>');
	str = str.replace(/,/g, '</td><td><h3>').replace(/:/g, '</h3>');
	return str;
}


var Elem = {
	get: function (name) {
		return document.getElementById(name);
	},
	set: function (type, parent, className, idx) {
		var item = document.createElement(type);
		if (className)
			item.className = className;
		if (parent)
			parent.appendChild(item);
		if (idx && className)
			item.id = className + "_" + idx;
		return item;
	},
	color: function(elem, color, bgcolor) {
		if (elem) {
			elem.style.color = color;
			elem.style.backgroundColor = bgcolor;
		}
	},
	align: function(elem, align, width) {
	    if (elem) {
	        elem.style.textAlign = align;
	        elem.style.width = width + "%";
	    }
	},
	remove: function (elem) {
	    if(elem)
	        elem.parentNode.removeChild(elem);
	    return !!elem;
	},
}