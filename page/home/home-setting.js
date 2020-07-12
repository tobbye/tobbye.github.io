let Home = new __Home();

function __Home() {

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
        let block = Elem.creat('div', content, 'block');

    }

    this.creatLine = function(block, data) {
        let lines = data.lines;
        for (let z in lines) {

        }
    }

}

