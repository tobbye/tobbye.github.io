let Help = new __Help();

function __Help() {


    this.init = function() {
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
        this.setHelp(content, data);
        this.setFeed(content, data);
    }


    this.setHelp = function(content, data) {
        if (!data.summary) return; 
        let details = Elem.creat('details', content);
        let summary = Elem.creat('summary', details);
        let detail = Elem.creat('div', details);
        summary.innerHTML = data.summary;
        detail.innerHTML = data.detail;
    }

    this.setSlect = function() {

    }

    this.setFeed = function(content, data) {
        if (!data.opts) return; 
        let block = Elem.creat('div', content, 'block');
        let select = Elem.creat('div', block, 'alert-flex');
        for (let x in data.opts) {
            let option = Elem.creat('div', select, 'option');
            // button.value = data.opts[x];
            option.innerHTML = data.opts[x];
            option.onclick = function() {
                let childs = this.parentNode.children;
                for (let i=0; i<childs.length; i++) {
                    if (this.innerHTML == childs[i].innerHTML)  {
                        childs[i].setAttribute('state', 'live');
                    } else {
                        childs[i].setAttribute('state', 'dead');
                    }               
                }
            }
        }
        select.children[0].onclick();
        let form = Elem.creat('form', block, 'feedback');
        form.action = Config.setAction('feedback', data.type);
        form.method = "POST";
        let textarea = Elem.creat('textarea', form, 'textarea');
        textarea.name = 'feed';
        textarea.placeholder = data.remind;
        textarea.style.color = Alert.colorFont();

        let flex = Elem.creat('div', form, 'flex');
        let button = Elem.creat('input', flex, 'button');
        button.data = data;
        button.type = 'submit';
        button.textarea = textarea;
        button.value = data.btnText;
        button.innerHTML = data.btnText;
        button.setAttribute('state', 'permit');
        button.onclick = function() {
            Help.setSend(this);
        }
    }

    this.setSend = function(btn) {
        let value = btn.textarea.value;
        if (value == 'fun' || value == 'funny') {
            config.sett.isFun = true;
            Storage.set('config', config);
            Alert.log('<h4>特别提醒</h4>隐藏模式开启！');
        } else if (value == 'ghost') {
            config.sett.modeType = 'ghost';
            Storage.set('config', config);
            Alert.log('<h4>特别提醒</h4>修仙模式开启！');
        } else if (!value || value == btn.data.remind) {
            Alert.log('<h4>反馈失败</h4>' + btn.data.remind);
        } else {
            Alert.log('<h4>反馈成功</h4>' + btn.data.vice);
        }  
    }

}
