window.onload = function() {
	var data = localStorage.getItem('json-data');
	jsonToTable(data);
	window.onresize();
}


function back() {
	var page = JSON.parse(localStorage.getItem('json-page'));
    window.location.href = page;
}

window.onresize = function() {
    var outer = Elem.get('outer');
    if (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent)) {
        document.body.style.zoom =  2;
        document.body.style.height = window.innerHeight * 0.5 + "px";
        outer.style.height = (window.innerHeight * 0.5 - 72) + 'px';
    } else {
        outer.style.height = (window.innerHeight - 72) + 'px';
    }
}



function jsonToTable(data) {
	var str = data.replace(/\\n/g, '<br/>').replace(/\\/g, '');
	str = str.replace(/\[{/g, '<table><tr><td><h3>').replace(/}]/g, ']').replace(/},/g, '}');
	str = str.replace(/\[/g, '<table><tr><td>').replace(/]/g, '</td></tr></table>');
	str = str.replace(/{/g, '<tr><td><h3>').replace(/}/g, '</td></tr>');
	str = str.replace(/,/g, '</td><td><h3>').replace(/,/g, '</td><td>');
	str = str.replace(/":/g, '</h3>').replace(/"/g, '');
	var outer = Elem.get('outer');
	var view = Elem.creat("table", outer, 'view');
	view.innerHTML = str;
}

function setAgent() {

}



var Elem = {
    get: function (name) {
        return document.getElementById(name);
    },
    creat: function (type, parent, className, idx) {
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
    }
}
