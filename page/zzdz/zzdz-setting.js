window.onload = function() {
    WORLD.init();
    WORLD.instance();  
}


let WORLD = new __WORLD();
function __WORLD() {

    this.init = function() {
        this.scene = new THREE.Scene();
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.aspectRatio = this.canvasWidth / this.canvasHeight;
        this.fieldOfView = 25;
        this.nearPlane = 0.1;
        this.farPlane = 1000;
        this.camPos = [0, 0, 0];
        this.camScale = 1.0;
        this.isLargeMap = Math.random() < .5;
        this.isInBattle = Math.random() < .5;
        this.initCfg();
        this.initScene();
    }



    this.initCfg = function() {
        this.cfgSmallBattle = {
            name: '小型地图 | 战斗',
            terrain: 'terrainSmall',
            scale: .17, 
            camSize: 1.0,
            camMinScale: .6,
            camMaxScale: 2.5,
            camPos:[3, 3, 6],
            offset: -2.0,
        };

        this.cfgSmallDevelop = {
            name: '小型地图 | 发展',
            terrain: 'terrainSmall',
            scale: .10, 
            camSize: 1.2,
            camMinScale: .4,
            camMaxScale: 2.4,
            camPos:[3, 3, 6],
            offset: -2.0,
        };

        this.cfgLargeBattle = {
            name: '大型地图 | 战斗',
            terrain: 'terrainLarge',
            scale: .17, 
            camSize: 1.8,
            camMinScale: .6,
            camMaxScale: 2.3,
            camPos:[5, 5, 9],
            offset: .2,
        };
        this.cfgLargeDevelop = {
            name: '大型地图 | 发展',
            terrain: 'terrainLarge',
            scale: .10, 
            camSize: 1.5,
            camMinScale: .4,
            camMaxScale: 2.4,
            camPos:[5, 5, 7],
            offset: .2,
        };
        this.cfg = this.getCfg();
        this.scale = this.cfg.scale;
        this.offset = this.cfg.offset;
        this.camPos = this.cfg.camPos;
        this.camSize = this.cfg.camSize;
        this.camMinScale = this.cfg.camMinScale;
        this.camMaxScale = this.cfg.camMaxScale;
        this.terrainMap = eval(this.cfg.terrain);
        document.title += ' | ' + this.cfg.name;
    }

    this.getCfg = function() {
        if (this.isLargeMap && this.isInBattle) return this.cfgLargeBattle;
        if (this.isLargeMap && !this.isInBattle) return this.cfgLargeDevelop;
        if (!this.isLargeMap && !this.isInBattle) return this.cfgSmallDevelop;
        if (!this.isLargeMap && this.isInBattle) return this.cfgSmallBattle;
    }

    this.initScene = function() {
        this.scene.scale.set(this.scale, this.scale, this.scale);
        this.scene.translateX(this.offset);
        this.scene.translateZ(this.offset);
        this.canvas = document.getElementById('canvas');
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            this.aspectRatio,
            this.nearPlane,
            this.farPlane);
        this.renderer = new THREE.WebGLRenderer({
            alpha: true, 
            antialias: true,
            canvas: this.canvas, 
        });
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.creatLight();
        this.setCamera(1);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        console.log(this.terrainMap);
        console.log(this);
    }



    this.setCamera = function(scale) {
        this.camScale += scale - 1;
        if (this.camScale < this.camMinScale) {
            this.camScale = this.camMinScale;
            return;
        }
        if (this.camScale > this.camMaxScale) {
            this.camScale = this.camMaxScale;
            return;
        }
        this.camCurPos = Util.v3mult(this.camPos, this.camScale);

        this.setPosition(this.camera, this.camCurPos);
        this.camera.lookAt(new THREE.Vector3(
            this.camCurPos[0] - this.camPos[0],
            this.camSize,
            this.camCurPos[1] - this.camPos[1]));
        this.render();
    }



    this.setPosition = function(obj, P3) {
        obj.position.set(P3[0], P3[2], P3[1]);
    }


    this.creatGeometry = function(obj) {
        let geometry;
        switch(obj.type) {
            case 0:
                geometry = new THREE.BoxGeometry(obj.size[0], obj.size[2], obj.size[1]);
                break;
            case 1:
                geometry = new THREE.CylinderGeometry(obj.size[0], obj.size[1], obj.size[2]);
                break;
        }
        
        return geometry;
    }

    this.creatMesh = function(obj) {
        let geometry = this.creatGeometry(obj);
        let material = new THREE.MeshLambertMaterial({color: obj.color});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            obj.pos[0], 
            obj.pos[2], 
            obj.pos[1]);
        if (obj.rotate) mesh.rotateY(Math.PI/obj.rotate);
        if (obj.rotate == 9) mesh.rotateY(Math.PI/~~(Math.random()*100));
        mesh.name = obj.name;
        mesh.castShadow = obj.cast;
        mesh.receiveShadow = obj.receive;
        this.scene.add(mesh);

        if (!obj.opacity) return mesh;
        let __material = new THREE.ShadowMaterial({opacity: obj.opacity});
        let __mesh = new THREE.Mesh(mesh.geometry, __material);
        __mesh.position.set(
            mesh.position.x, 
            mesh.position.y, 
            mesh.position.z);
        __mesh.receiveShadow = true;
        this.scene.add(__mesh);
        return mesh;
    }

    this.creatLight = function() {
        this.light = new THREE.AmbientLight( 0xffffff ,.5);

        this.shadowLight = new THREE.DirectionalLight(0xffffff, .5);
        this.shadowLight.position.set(200, 200, 200);
        this.shadowLight.castShadow = true;

        this.backLight = new THREE.DirectionalLight(0xffffff, .2);
        this.backLight.position.set(-100, 200, 50);
        this.backLight.castShadow = true;
        this.scene.add(this.backLight);
        this.scene.add(this.light);
        this.scene.add(this.shadowLight);
    }

    this.creatTree = function(x, y){
        for (let i in modelRect.tree1) {
            let $ = this.getMap(modelRect.tree1[i]);
            $.pos = [$.pos[0]+x, $.pos[1]+y, $.pos[2]];
            this.creatMesh($);
        }
    }

    this.creatBridge = function(x, y, isRotate) {
        for (let i in modelRect.bridge1) {
            let $ = this.getMap(modelRect.bridge1[i]);
            if (!isRotate) {
                $.pos = [$.pos[0]+x, $.pos[1]+y, $.pos[2]];
                this.creatMesh($);
            } else {
                $.pos = [$.pos[1]+x, $.pos[0]+y, $.pos[2]];
                $.size = [$.size[1], $.size[0], $.size[2]];
                this.creatMesh($);
            }
        }
    }

    this.getMap = function(rect) {
        let $ = rect;
        return {
            type: $[0],
            pos: [$[1], $[2], $[3]],
            size: [$[4], $[5], $[6]],
            color: $[7], 
            opacity: $[8], 
            cast: $[9], 
            receive: $[10], 
            rotate: $[11]
        }
    }



    this.creatTerrain = function(type, isBridge) {
        for (let x in this.terrainMap[type]) {
            let $ = this.getMap(this.terrainMap[type][x]);

            if (isBridge) {
                this.creatBridge($.pos[0], $.pos[1], $.rotate);
            } else {
                this.creatMesh($);
            }
        }
    }

    this.creatIsland = function() {
        let $ = this.getMap(this.terrainMap.island[0]);
        let mesh = this.creatMesh($);
        mesh.rotateY(Math.PI/4);
    }

    this.creatShape = function() {
        var shape = new THREE.Shape();
        shape.moveTo(0,-.2,0);
        shape.lineTo(1,-.2,1);
        shape.lineTo(2,-.2,0);
        shape.lineTo(0,-.2,0);
        let settings = { 
            steps: 10, 
            depth: 10, 
            bevelSize: 10, 
            bevelEnabled: true, 
            bevelSegments: 10, 
            bevelThickness: 10 };

        let material = new THREE.MeshLambertMaterial({color: 0xABD66A});
        let mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, settings), material);
                mesh.position.set(0,0,0);
        mesh.castShadow = 1;
        mesh.receiveShadow = 0;
        this.scene.add(mesh);
    }

    this.inMap = function(name, x, y) {
        for (let i in this.terrainMap[name]) {
            let $ = this.terrainMap[name][i];
            if (x > $[1] - $[4]/2 + .00 && 
                x < $[1] + $[4]/2 - .00 && 
                y > $[2] - $[5]/2 + .00 && 
                y < $[2] + $[5]/2 - .00)
                return true;
        }
        return false;
    }

    this.render = function() {
        this.renderer.render(this.scene, this.camera);

    }

    this.instance = function() {
        this.creatTerrain('land');
        this.creatTerrain('hill');
        this.creatTerrain('river');
        this.creatTerrain('bridge', 1);
        // this.creatTerrain('cylinder');
        for (let i=0; i< 200; i++) {
            let x, y;
            if (!this.isLargeMap) {
                x = 50*Math.random()-6;
                y = 50*Math.random()-6;
            } else {
                x = 90*Math.random()-45;
                y = 90*Math.random()-45;
            }
            if (this.inMap('land', x, y) && !this.inMap('hill', x, y))
                this.creatTree(x, y);
        }
        // this.creatIsland();

        this.render(); 
    }

}

document.onmousewheel = function(e) {
    e = e || window.event;
    e.wheelDelta = e.wheelDelta || 0;
    if (e.wheelDelta < 0) {
        WORLD.setCamera(1.2);
    } else if (e.wheelDelta > 0){
        WORLD.setCamera(0.8);
    }
}
