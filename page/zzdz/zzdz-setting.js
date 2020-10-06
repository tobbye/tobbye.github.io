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
        this.worldScale = 60;
        this.isLarge = 1;
        this.isBattle = 1;
        this.isFront = 0;
        this.initCfg();
        this.initScene();
    }



    this.initCfg = function() {
        this.cfgSmallBattle = {
            name: '小型地图 | 战斗',
            map: 'mapSmall',
            scale: .17, 
            camSize: 1.0,
            camMinScale: .6,
            camMaxScale: 2.5,
            camPos:[3, 3, 6],
            offset: -2.0,
        };

        this.cfgSmallDevelop = {
            name: '小型地图 | 发展',
            map: 'mapSmall',
            scale: .10, 
            camSize: 1.2,
            camMinScale: .4,
            camMaxScale: 2.4,
            camPos:[3, 3, 6],
            offset: -2.0,
        };

        this.cfgLargeBattle = {
            name: '大型地图 | 战斗',
            map: 'mapLarge',
            scale: .17, 
            camSize: 1.8,
            camMinScale: .6,
            camMaxScale: 2.3,
            camPos:[5, 5, 9],
            offset: .2,
        };
        this.cfgLargeDevelop = {
            name: '大型地图 | 发展',
            map: 'mapLarge',
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
        if (this.isFront) {
            this.camPos[0] = 0;
            // this.camPos[1] = 0;
        }
        this.camSize = this.cfg.camSize;
        this.camMinScale = this.cfg.camMinScale;
        this.camMaxScale = this.cfg.camMaxScale;
        mapRes = eval(this.cfg.map);
        document.title += ' | ' + this.cfg.name;
    }

    this.getCfg = function() {
        if (this.isLarge && this.isBattle) return this.cfgLargeBattle;
        if (this.isLarge && !this.isBattle) return this.cfgLargeDevelop;
        if (!this.isLarge && !this.isBattle) return this.cfgSmallDevelop;
        if (!this.isLarge && this.isBattle) return this.cfgSmallBattle;
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
        this.setZoom(1);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        console.log(mapRes);
        console.log(this);
    }





    this.setPosition = function(obj, P3) {
        obj.position.set(P3[0], P3[2], P3[1]);
    }


    this.creatGeometry = function(obj) {
        let geometry;
        switch(obj.shape) {
            case 1:
                geometry = new THREE.BoxGeometry(
                    obj.size[0], 
                    obj.size[2], 
                    obj.size[1]);
                break;
            case 2:
                geometry = new THREE.CylinderGeometry(
                    obj.size[0], 
                    obj.size[1], 
                    obj.size[2]);
                break;
        }
        
        return geometry;
    }

    this.creatMesh = function(obj, parent) {
        parent = parent || this.scene;
        let geometry = this.creatGeometry(obj);
        let material = new THREE.MeshLambertMaterial({color: obj.mater[0]});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            obj.pos[0], 
            obj.pos[2], 
            obj.pos[1]);
        if (obj.rotate && obj.rotate.length == 3) {
            mesh.rotateX(Math.PI/180*obj.rotate[0]);
            mesh.rotateY(Math.PI/180*obj.rotate[2]);
            mesh.rotateZ(Math.PI/180*obj.rotate[1]);
        };
        mesh.name = obj.name;
        mesh.castShadow = obj.mater[2];
        mesh.receiveShadow = obj.mater[3];
        this.scene.add(mesh);

        if (!obj.mater[1]) return mesh;
        let __material = new THREE.ShadowMaterial({opacity: obj.mater[1]});
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
        this.light = new THREE.AmbientLight(0xFFFFFF,.5);

        this.shadowLight = new THREE.DirectionalLight(0xFFFFFF, .4);
        this.shadowLight.position.set(200, 200, 200);
        this.shadowLight.castShadow = true;

        this.backLight = new THREE.DirectionalLight(0xFFFFFF, .3);
        this.backLight.position.set(-100, 200, 50);
        this.backLight.castShadow = true;
        this.scene.add(this.backLight);
        this.scene.add(this.light);
        this.scene.add(this.shadowLight);
    }


    this.getMap = function(A, name) {
        let $ = {
            modelId:  A[0][0] || 1,
            materId:  A[0][1] || 0,
            colorId:  A[0][2] || 0,
            name:   A[0][3] || name,
            count:  A[0][4] || 1,
            offset: A[1] || [0, 0, 0],
            pos:    A[2] || [0, 0, 0],
            size:   A[3] || [1, 1, 1],
            rotate: A[4] || 0,
        } 
        $.modelId = name + $.modelId;
        $.materId = name + $.materId;
        $.colorId = name + $.colorId;
        $.model = modelRes[$.modelId];
        $.color = colorRes[$.colorId] || [];
        return $;
    }

    this.getModel = function(A) {
        return {
            shape:  A[0][0] || 0,
            pos:    A[1] || [0, 0, 0],
            size:   A[2] || [1, 1, 1],
            rotate: A[3] || 0,
            mater:  A[4] || [0x888888,.00,0,0],
        }   
    }


    //多个Mesh
    this.creatJoint = function(name) {
        for (let x in mapRes[name]) {
            let A = this.getMap(mapRes[name][x], name);
            console.log(A);
            for (let y in A.model) {
                let $ = this.getModel(A.model[y]);
                console.log($);
                if (A.rotate) {
                    $.pos = Util.v3tranXY($.pos);
                    $.size = Util.v3tranXY($.size);
                }
                $.pos = Util.v3cross($.pos, A.size);
                $.pos = Util.v3plus($.pos, A.pos);
                $.size = Util.v3cross($.size, A.size);

                $.name =  A.name;
                $.mater[0] = A.color[y] || $.mater[0];
                for (let z=0; z<A.count; z++) {
                    if (z>0)
                        $.pos = Util.v3plus($.pos, A.offset);
                    this.creatMesh($);
                }
            }
        }
    }


    this.inMap = function(name, x, y) {
        for (let i in mapRes[name]) {
            let $ = mapRes[name][i];
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
        this.creatJoint('land');
        this.creatJoint('hill');
        this.creatJoint('river');
        this.creatJoint('bridge');
        this.creatJoint('tower');
        this.creatJoint('tree');
        // this.creatIsland();

        this.render(); 
    }


    this.setCameraPos = function(x, y, z) {
        this.camera.position.set(
            this.camPos[0]*this.camScale + (x || 0), 
            this.camPos[2]*this.camScale + (y || 0), 
            this.camPos[1]*this.camScale + (z || 0)
        ); 
    }

    this.setZoom = function(scale) {
        this.camScale *= scale;
        if (this.camScale < this.camMinScale) {
            this.camScale = this.camMinScale;
            return;
        }
        if (this.camScale > this.camMaxScale) {
            this.camScale = this.camMaxScale;
            return;
        }
        
        this.setCameraPos();
        this.camera.lookAt(new THREE.Vector3(
            this.camPos[0] * (this.camScale - 1),
            this.camSize,
            this.camPos[1] * (this.camScale - 1)
        ));
        this.render();
    }


    this.setDrag = function(x, y) {
        this.startX = this.startX || this.clientX;
        this.startY = this.startY || this.clientY;
        x = (x-this.startX)/20;
        y = (y-this.startY)/20;
        let dx = this.isFront ? x : .707*(y+x);
        let dy = this.isFront ? y : .707*(y-x);
        this.setCameraPos(-dx, this.camSize, -dy);
        this.render();
    }
}

document.onmousewheel = function(e) {
    e = e || window.event;
    e.wheelDelta = e.wheelDelta || 0;
    if (e.wheelDelta < 0) {
        WORLD.setZoom(1.1);
    } else if (e.wheelDelta > 0){
        WORLD.setZoom(0.9);
    }
}



document.ontouchstart = function(e) {
    e = e || window.event;
    e = e.touches ? e.touches[0] : e;
    WORLD.startX = e.clientX;
    WORLD.startY = e.clientY;
}



document.ontouchmove = function(e) {
    e = e || window.event;
    e = e.touches ? e.touches[0] : e;
    WORLD.setDrag(e.clientX, e.clientY);
    WORLD.clientX = e.clientX;
    WORLD.clientY = e.clientY;
}

document.ontouchend = function(e) {
    e = e || window.event;
    e = e.touches ? e.touches[0] : e;  
    // WORLD.setCameraPos();
    // WORLD.render();
}

document.onmousedown = function(e) {
    e = e || window.event;
    e = e.touches ? e.touches[0] : e;
    WORLD.startX = e.clientX;
    WORLD.startY = e.clientY;
    WORLD.onMove = 1;
}

document.onmouseup = function(e) {
    WORLD.onMove = 0;
    console.log(e);
}

document.onmousemove = function(e) {
    if (!WORLD.onMove) return;
    e = e || window.event;
    e = e.touches ? e.touches[0] : e;
    if (e.button > 0) return;
    WORLD.setDrag(e.clientX, e.clientY);
    WORLD.clientX = e.clientX;
    WORLD.clientY = e.clientY;
}

