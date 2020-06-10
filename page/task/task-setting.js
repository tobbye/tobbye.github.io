var Task = new __Task();

function __Task() {

    this.init = function(){
        this.curIdx = 0;
        this.idx = 0;
        this.ladd = 1; 
        this.roll = 1;
        this.isLog = 1;
        this.isTask = 0;
        this.body = {};
        Container(this);
    };


    this.creatElems = function() {
        Alert.creatOuterTop(this);
        Alert.creatOuterBot(this);
        Alert.showInner();
        this.showTask();
    }

    

    this.showTask = function() {
        Alert.showPanel('task');
        let block = Alert.panels.task.block;
        let list = items[0].list;
        for (let z=0; z<list.length; z++) {
            let btn = Elem.creat('div', block, 'line-flex', 'list['+z+']');
            let left = Elem.creat('div', btn, 'line-L');
            let right = Elem.creat('div', btn, 'line-R');
            left.innerHTML = '任务' + (~~z+1);
            right.innerHTML = list[z].name;
            btn.idx = z;
            btn.onclick = function() {
                let childs = this.parentNode.children;
                for (let i=0; i<childs.length; i++) {
                    if (this.innerHTML == childs[i].innerHTML)  {
                        Elem.color(childs[i], 'white', Alert.colorFont());
                    } else {
                        Elem.color(childs[i], Alert.colorFont(), 'white');
                    }               
                }
                Task.curIdx = btn.idx;
                Task.setTaskCfg(this.idx);
            } 

            if (this.curIdx == z)  {
                Elem.color(btn, 'white', Alert.colorFont());
            } else {
                Elem.color(btn, Alert.colorFont(), 'white');
            }  
        }
        this.setTaskCfg(this.curIdx);
    }

    this.setTask = function(idx) {
        this.clear();
        this.cfg = items[0].list[idx];
        this.block = Elem.get('block-game');
        this.block.innerHTML = '';
        this.curIdx = idx;
        this.showCfg = !false;
        this.isTask = 1;
        this.ladd = 1;
        this.logs.fail = '<h5>任务失败</h5>伐开心(ಥ﹏ಥ)!'
        this.logs.open = '<h5>任务完成</h5>棒棒哒\(^o^)/~!'
        this.types = [this.cfg.typef];
        this.typef = 'creat' + Parse.titleCase(this.cfg.typef);
        this.scale = Math.max(this.cfg.scale, 1);
        this.alertWidth = Math.max(Config.page.alertFillWidth, this.cfg.col* this.cfg.size);
        this.alertWidth = Math.min(Config.page.alertFullWidth, this.alertWidth*this.scale);
        this[this.typef]();
        Elem.width(this.block, this.alertWidth+'px');
        if (Config.page.isMobile) {
            this.isArrow = this.game.isArrow;
        } else {
            this.isArrow = false;
        } 
        if (this.isLog == null)
            this.togLog(true);
        else 
            this.togLog(this.isLog);
        this.checkState('going');
        console.log (this); 
    }


    this.setTaskCfg = function(idx) {
        let input = Alert.curPanel.input;
        let toggle = Alert.buttons.toggle;
        let submit = Alert.buttons.submit;
        let data = items[0].list[idx];
        input.value = JSON.stringify(data).replace(/,/g, ', ');
        input.onfocus = function() {
            Task.log(cfg.desc);
        }
        toggle.onclick = function() {
            Task.togLog(!Task.isLog);
        }
        submit.onclick = function() {
            let idx = Task.curIdx;
            items[0].list[idx] = JSON.parse(Alert.curPanel.input.value);
            Task.setTask(idx);
            Alert.hidePanel();
        }
    }




    this.togLog = function(isLog) {
        this.isLog = isLog;
        Elem.text(Alert.buttons.toggle, Task.isLog ? '已开启提醒':'已关闭提醒');
        Elem.state(Alert.buttons.toggle, Task.isLog ? 'permit':'danger');
    }



    this.logs = {
        detail:'此红包由 #inver 赞助<h5>完成的任务越多获得的#pack金额越大</h5>',
        ready:'<h5>任务#idx准备</h5>加油！奥里给!',
        pause:'<h5>任务#idx暂停</h5>加油！奥里给!奥里给!',
        going:'<h5>任务#idx进行中</h5>加油！奥里给!奥里给!',
        redo:'<h5>任务#idx已重置</h5>加油！奥里给!奥里给!',
        fail:'<h5>任务#idx失败</h5>请重置后再次尝试!',
        stop:'<h5>任务#idx中止</h5>请打开#pack',
        next:'<h5>任务#idx完成</h5>请进行下一任务',
        open:'<h5>任务全部完成</h5>您可以打开#pack啦!',
    };

    this.gameNames = {
        tetris:'俄罗斯方块', 
        labyrinth:'迷宫', 
        snake:'贪吃蛇', 
        puzzle:'文字解密', 
        jigsaw: '拼图',
    }

    this.creatTask = function(block, mix) {
        let data = document.body.data;
        let line = document.body.line;
        if (this.index != line.index)
            this.idx = 0;

        this.cfg = {
            src: line.src,
            word: line.word,
        };
        this.block = block;
        this.index = line.index;
        this.pack = data.packType;
        this.types = data.taskTypes;
        this.type = this.types[this.idx];
        this.typef = 'creat' + Parse.titleCase(this.type);
        this.alertWidth = Config.page.alertWidth;
        this[this.typef]();

        if (this.game && !mix) {
            this.initTask();
            this.checkState('going');
            console.log (this);
        }
    }

    this.mixAnim = function(block) {
        this.checkAction('redo');
        clearInterval(this.timer);
        clearInterval(this.clock);
        this.loop = Constant.clock.loop;
        this.clock = setInterval(function() {
            Task.mixLoop();
        }, 120);  
        if (!this.game.mixAnim && !this.isTask) {
            this.initTask();
            console.log (this); 
        }
    }

    this.mixLoop = function() {
        if (this.loop > 0) {
            this.block.innerHTML = '';
            if (this.game.mixAnim) {
                this.game.mixAnim();
            } else {
                if (this.isTask)
                    this.setTask(Task.curIdx);
                else
                    this.creatTask(this.block, true);
            }
            this.loop--;
        } else {
            this.checkState('going');
            clearInterval(this.clock);
            this.loop = Constant.clock.loop;
        }
    }


    this.initTask = function() {
        this.type = this.types[this.idx];
        this.ladd = this.idx + 1;
        this.title = this.text(this.game.title);
        this.isArrow = this.game.isArrow;
        Elem.text(Alert.curPanel.title, this.title);
    }

    this.checkState = function(state) {
        this.state = state;
        this.game.state = state;
        switch (state) {
            case 'ready':
                this.log (this.logs.ready);
                break;
            case 'pause':
                this.log (this.logs.pause);
                break;
            case 'going':
                this.checkAction('going');
                break;
            case 'succeed':
                if (this.ladd < this.types.length) {
                    this.initTask();  
                    this.checkAction('next');
                } else {
                    this.checkAction('open');
                }
                this.isArrow = false;
                this.idx ++;
                this.clear();
                break;
            case 'ending':
                clearInterval(this.game.timer);
                this.isArrow = false;
                if (this.idx > 1)
                    this.checkAction('stop');
                else
                    this.checkAction('fail');
                break;
        }
        this.showArrow();
    }


    this.checkAction = function(action) {
        this.game.action = action;
        Elem.hide(Alert.buttons.open);
        Elem.hide(Alert.buttons.next);
        Elem.hide(Alert.buttons.redo);
        Elem.hide(Alert.buttons.abon);
        switch (action) {
            case 'going':
                this.log (this.game.logTips);
                Elem.show(Alert.buttons.redo);
                Elem.show(Alert.buttons.abon);
                break;
            case 'redo':
                this.log (this.logs.redo);
                Elem.show(Alert.buttons.redo);
                Elem.show(Alert.buttons.abon);
                break;
            case 'open':
                this.log (this.logs.open);
                Elem.show(Alert.buttons.open);
                break;
            case 'next':
                this.log (this.logs.next);
                Elem.show(Alert.buttons.next);
                break;
            case 'stop':
                this.log (this.logs.stop);
                Elem.show(Alert.buttons.open);
                break;
            case 'fail':
                this.log (this.logs.fail);
                Elem.show(Alert.buttons.redo);
                Elem.show(Alert.buttons.abon);
                break;
        }
    }


    this.showArrow = function() {
        if (this.isArrow) {
            Elem.show(Alert.buttons.up);
            Elem.show(Alert.buttons.down);  
            Elem.show(Alert.buttons.left);
            Elem.show(Alert.buttons.right);
        } else {
            Elem.hide(Alert.buttons.up);
            Elem.hide(Alert.buttons.down);
            Elem.hide(Alert.buttons.left);
            Elem.hide(Alert.buttons.right);
        }
    }

    this.clear = function() {
        if (this.game) {
            clearInterval(this.game.timer);
            // this.game = null;
        }
    }


    this.initRoll = function(line) {
        this.roll = 1;
        this.rollMax = Math.pow(2, line.ladd);
        this.rollNum = Math.floor(Math.random() * this.rollMax);
        this.getRoll(this.rollMax, this.rollNum); 
    }

    this.getRoll = function(all, roll) {
        all = all / 2;
        if (roll > all) {
            this.roll += 1;
            this.getRoll(all, roll - all);
        } else{
            return this.roll;
        }
    }

    this.text = function(text) {
        return text
        .replace('#idx', this.ladd)
        .replace('#pack', this.pack)
        .replace('#remain', this.remain);
    }

    this.log = function(log) {
        if (this.isLog) {
            this.cur = this.text(log);
            Alert.log (this.cur);  
        } else {
            console.log (this.cur);
        }
    }


    this.alert = function(log) {
        setTimeout(function() {alert(log)}, 200);
    }


    this.setArrow = function(idx) {
        if (!this.game) return;
        if (!this.game.control) return;
        this.game.control(idx);
    };

    document.onkeydown = function(evt) { 
        if (!Task.game) return;
        if (!Task.game.control) return;
        let idx = evt.keyCode - 37;
        Task.game.control(idx);
    };

}










