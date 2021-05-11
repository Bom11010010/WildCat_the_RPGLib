
let Wildcat = {}

/*------------------------------------------

ゲームデータ

------------------------------------------*/
Wildcat.gameData = {
    chipSize: 32,
    screenSize: {x: 640, y: 480},
    nowFrame: 0,
    set fps(a){fps = a},
    get fps(){return fps},
    startGame: function(main){
        /**
         * @type function
         */
        let fps = 30;
        let nowFrame = 0;
        (function mainloop(){
            nowFrame = nowFrame + 1;
            for(let i in Wildcat.layer.list){
                let targetLayer = Wildcat.layer.list[i];
                targetLayer.clearRect(0, 0, targetLayer.canvas.width, targetLayer.canvas.height);
            }
            main();
            Wildcat.gameData.nowFrame = nowFrame;
            setTimeout(mainloop, 1000 / fps)
        })();
    }
};



/*------------------------------------------

配列操作

------------------------------------------*/

Wildcat.array = (function(){
    return {
        /**
         * 配列の最初の空の要素の番号を取得
         * @param {*[]} array 
         */
        getEmpty: function(array){
            let i = 0;
            while(array[i]){
                i++;
            }
            return i
        },
        /**
         * 配列の配列（二次配列）の中の全ての要素を結合して配列を返す
         * @param {*[][]} array 
         */
        joinAll: function(array){
            return array.join().split(",");
        },
        /**
         * 配列の配列（二次配列）の中で一番長い要素の長さを返す
         * @param {*[][]} array 
         */
        getMostLonger: function(array){
            let result = 0;
            for(let i in array){
                if(array[i].length > result){
                    result = array[i].length
                }
            }
            return result;
        },
        /**
         * 配列内のfalsyな値を全て0にした配列を返す。
         * @param {*[]} array 
         */
        falsyToZeroAll: function(array){
            let result = [];
            for(let i in array){
                if(!array[i]){
                    result[i] = 0;
                }else{
                    result[i] = array[i];
                }
            }
            return result;
        },
        /**
         * 配列からランダムに要素を選ぶ
         * @param {*[]} array 
         */
        choose: function(array){return array[Math.floor(Math.random()*array.length)]}
    }
})()

/*------------------------------------------

DOM操作

------------------------------------------*/
Wildcat.html = (function(){
    let body = document.getElementsByTagName('body')[0];
    body.innerHTML +=
`
<div id="outer">
    <div id="layers"></div>
    <div id="contents"></div>
</div>
`
    let head = document.getElementsByTagName('head')[0];
    head.innerHTML +=
    
`
<style id="fontSetter">
</style>

<style>
    body {
        overflow: hidden;
        font-family: "GameFont";
    }
    #contents > *{
        word-wrap: break-word;
        display: inline;
        position: absolute;
    }
    #layers > *{
        position: absolute;
    }
    #layers{
        overflow: hidden;
    }
    #outer{
        transform: scale(1,1);
        transform-origin:0 0;
        margin: auto auto;
    }
</style>
`
    let outer = document.getElementById("outer");
    let layers = document.getElementById("layers");
    let contents = document.getElementById("contents");

    return {
        /**
         * @type HTMLBodyElement
         */
        body: body,
        /**
         * @type HTMLBodyElement
         */
        head: head,
        /**
         * @type HTMLDivElement
         */
        outer: outer,
        /**
         * @type HTMLDivElement
         */
        layers: layers,
        /**
         * @type HTMLDivElement
         */
        contents: contents,

        /**
         * HTMLを書き足す
         * @param {HTMLElement} target 
         * @param {string} html 
         */
        addHTML: function(target, html){
            target.innerHTML += html;
        },
        checkExistsByID: function(id){
            return document.getElementById(id) ? true : false;
        },
        getEmptyNumberedID: function(id){
            //連番IDのなかで存在しない数（最小）を調べる
            let i = 0;
            while(this.checkExistsByID(`${id}${i}`)){
                i++;
            }
            return i
        },
        setFontFile: function(fontFileSrc){
            let fontSetter = document.getElementById("fontSetter");
            let extension = fontFileSrc.slice(-4);

            let format;

            if(extension === ".otf"){
                format = "opentype"
            }else if(extension === ".ttf"){
                format = "truetype"
            }

            if(fontFileSrc){
                fontSetter.innerHTML = 
`
@font-face {
    font-family: "GameFont";
    src: url(${fontFileSrc}) format("${format}");
}
`
            }else{
                fontSetter.innerHTML = ""
            }
        }
    }
})();

/*------------------------------------------

レイヤー

------------------------------------------*/
Wildcat.layer = (function(){

    /**
     * @type CanvasRenderingContext2D[]
     */
    let list = [];

    let layerEdited = false;

    let getCtx = function(id){
        if(layerEdited){ 
            list[id] = document.getElementById(`layer${id}`).getContext("2d");
        }
        return list[id];
    }

    return {
        /**
         * レイヤーを作成
         * @param {number} id 
         * @param {number} width 
         * @param {number} height 
         */
        create: function(id = Wildcat.html.getEmptyNumberedID("layer"), width = Wildcat.gameData.screenSize.x, height = Wildcat.gameData.screenSize.y){
            //idを強制的にnumberにする
            id = new Number(id);
            if(Wildcat.html.checkExistsByID(`layer${id}`)){
                if(isNaN(id) || id === undefined){
                    throw new Error(`そのLayerIDは使用出来ません`);
                }
                throw new Error(`${id}は使用中です`);
            }
            let layers = Wildcat.html.layers;
            Wildcat.html.addHTML(layers, `<canvas id="layer${id}" width="${width}" height="${height}" z-index="${id}"></canvas>`);
            list[id] = document.getElementById(`layer${id}`).getContext("2d");
            layerEdited = true;

            return id;
        },
        /**
         * レイヤーを削除
         * @param {number} id 
         */
        remove: function(id){
            document.getElementById(`layer${id}`).remove();
            if(list[id]){
                list.splice(id, 1);
            }
        },
        /**
         * 全てのレイヤーを削除
         */
        removeAll: function(){
            for(let i in this.list){
                this.remove(i);
            }
        },
        /**
         * 位置を設定
         * @param {number} id 
         * @param {number} dx 
         * @param {number} dy 
         */
        setPosition: function(id, dx = list[id].style.left, dy = list[id].style.top){
            list[id].canvas.style.left = `${dx}px`;
            list[id].canvas.style.top = `${dy}px`;
        },
        /**
         * サイズを設定
         * @param {number} id 
         * @param {number} dw 
         * @param {number} dh 
         */
        setSize: function(id, dw = list[id].canvas.width, dh = list[id].canvas.height){
            list[id].canvas.width = `${dw}`;
            list[id].canvas.height = `${dh}`;
        },
        get list(){
            /**
             * @type CanvasRenderingContext2D[]
             */
            let result = []
            for(let i in list){
                result[i] = getCtx(i);
            }
            return result;
        },
        get canvasesList(){
            let result = []
            for(let i in list){
                result[i] = list[i].canvas;
            }
            return result;
        }
    }
})();





/*------------------------------------------------

HTMLコンテンツ（DOMをCanvasになじむように描画するシステム）

------------------------------------------------*/
Wildcat.htmlContents = (function(){
    let list = [];

    return {
        create: function(html, x = 0, y = 0, width = "auto", height = "auto", id = Wildcat.html.getEmptyNumberedID("content")){
            id = new Number(id);
            if(Wildcat.html.checkExistsByID(`content${id}`)){
                if(isNaN(id) || id === undefined){
                    throw new Error(`そのContentIDは使用出来ません`);
                }
                throw new Error(`${id}は使用中です`);
            }
            if(typeof width === 'number'){
                width = width + "px"
            }
            if(typeof height === 'number'){
                height = height + "px"
            }
            let contents = Wildcat.html.contents;
            Wildcat.html.addHTML(contents, `<div id="content${id}" style="width:${width}; height:${height}; top:${y}px; left:${x}px;">${html}</div>`);
            list[id] = document.getElementById(`content${id}`);

            return id;
        },
        
        /**
         * コンテンツを削除
         * @param {number} id 
         */
        remove: function(id){
            document.getElementById(`content${id}`).remove();
            if(list[id]){
                list.splice(id, 1);
            }
        },
        /**
         * 全てのコンテンツを削除
         */
        removeAll: function(){
            for(let i in this.list){
                this.remove(i);
            }
        },

        /**
         * 位置を設定
         * @param {number} id 
         * @param {number} dx 
         * @param {number} dy 
         */
        setPosition: function(id, dx = list[id].style.left, dy = list[id].style.top){
            if(typeof dx === 'number'){
                dx = dx + "px"
            }
            if(typeof dy === 'number'){
                dy = dy + "px"
            }
            list[id].style.left = `${dx}`;
            list[id].style.top = `${dy}`;
        },

        /**
         * サイズを設定
         * @param {number} id 
         * @param {number} dw 
         * @param {number} dh 
         */
        setSize: function(id, dw = list[id].width, dh = list[id].height){
            list[id].style.width = `${dw}`;
            list[id].style.height = `${dh}`;
        },
        list: list
    }
})();


/*------------------------------------------

I/O

------------------------------------------*/

Wildcat.io = (function(){

    let keyCode = {};
    window.addEventListener('keydown', (e)=>{
        keyCode[e.code] = true;
    }, false);
    window.addEventListener('keyup', (e)=>{
        keyCode[e.code] = false;
    }, false);

    
    let mousePos = {};
    window.addEventListener('mousemove', (e)=>{
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
    }, false)

    let mousePlessing = [];

    return {
        keyCode: keyCode,
        mousePos: mousePos,
        mouseCode: mousePlessing,
    }
})();

window.onmousedown = (e)=>{
    Wildcat.io.mouseCode[e.button] = true;
}
window.onmouseup = (e)=>{
    Wildcat.io.mouseCode[e.button] = false;
}



/*------------------------------------------

音声

------------------------------------------*/
Wildcat.sound = (function(){
    /**
     * @type HTMLAudioElement[]
     */
    let list = [];
    return {
        /**
         * 
         * @param {string} src 
         * @param {'se' | 'bgm'} type 
         * @param {number} id 
         */
        create: function(src, type = 'se', id = Wildcat.array.getEmpty(list)){
            list[id] = new Audio(src);
            if(type === 'bgm'){
                list[id].onload = ()=>{list[id].loop = true}
            }

            return id;
        },
        remove: function(id){
            if(list[id]){
                list.splice(id, 1);
            }
        },
        list: list,
    }
})();


/*------------------------------------------

画像

------------------------------------------*/

Wildcat.image = (function(){
    /**
     * @type {{element: HTMLImageElement, type: number, actorSize: number}[]}
     */
    let list = [];

    /**
     * @type number
     */
    let targetLayer;
    return {
        /**
         * 画像データを作成する
         * @param {string} src 
         * @param {'image' | 'atlas' | number} type 
         * @param {number} actorSize
         * @param {number} id 
         */
        create: function(src, type = 'image', actorSize = undefined, id = Wildcat.array.getEmpty(list)){
            let imageType = 0;
            let element = new Image();
            element.src = src;
            if(type === 'image'){
                imageType = 0;
                if(actorSize === void 0){
                    element.onload = ()=>{
                        Wildcat.image.list[id].actorSize = element.width;
                        console.log(actorSize);
                    }
                }
            }
            if(type === 'atlas'){
                imageType = 1;
                if(actorSize === void 0){
                    actorSize = Wildcat.gameData.chipSize;
                }
            }
            if(typeof type === 'number'){
                imageType = type;
            }
            list[id] = {element: element, type: imageType, actorSize: actorSize};

            return id;
        },


        remove: function(id){
            if(list[id]){
                list.splice(id, 1);
            }
        },


        /**
         * 
         * @param {number} id 
         * @param {number} dx 
         * @param {number} dy 
         * @param {number} whatX 画像タイプがimageならサイズ。atrusならチップ位置
         * @param {number} whatY 画像タイプがimageならサイズ。atrusならチップ位置
         */
        draw: function(id, dx = 0, dy = 0, whatX, whatY){
            let targetCtx = Wildcat.layer.list[targetLayer];
            let actorSize = list[id].actorSize;
            if(list[id].type === 0){
                if(whatX === void 0){
                    whatX = actorSize;
                }
                if(whatY === void 0){
                    whatY = list[id].element.height * (whatX / list[id].element.width);
                }
                let image = list[id].element;
                if(whatX || whatY){
                    if(dx > -whatX && dy > -whatY && dx < targetCtx.canvas.width && dy < targetCtx.canvas.height){
                        targetCtx.drawImage(image, dx, dy, whatX, whatY);
                    }
                }
            }else if(list[id].type === 1){
                targetCtx.drawImage(list[id].element, whatX * actorSize, whatY * actorSize, actorSize, actorSize, dx, dy, actorSize, actorSize)
            }
        },


        set targetLayer(a){
            targetLayer = a
        },
        get targetLayer(){
            return targetLayer
        },


        list: list
    }
})();


/*------------------------------------------

ゲームオブジェクト

------------------------------------------*/

Wildcat.gameObject = (function(){
    let list = [];
    
    let GameObject = class{
        /**
         * @param {number} dx 
         * @param {number} dy 
         */
        constructor(dx, dy, show = 1, w, h){
            this.show = show;
            this.position = {dx: dx, dy: dy};
            this.size = {w: w, h: h}
            /**
             * @type {Array<{Start: (object: any, ...arg)=>null, Update: (object: any, ...arg)=>null, isStarted: boolean}>}
             */
            this.components = [];

            this.arguments = [];
        }
        /**
         * 
         * @param {num} compId
         * @param {number} id 
         */
        addComponent(compId, arg = [], id = Wildcat.array.getEmpty(this.components)){
            this.components[id] = Wildcat.component.list[compId];
            this.arguments[id] = arg;
            return id
        }
        /**
         * 
         * @param {number} id 
         * @param {*[]} arg 
         */
        setArgument(id, arg){
            this.arguments[id] = arg;
        }

        work(){
            let components = this.components
            /**
             * @type {{Start: (object: any, ...arg)=>null, Update: (object: any, ...arg)=>null, isStarted: boolean}}
             */
            let component;

            for(let i in components){
                let arg = this.arguments[i];

                component = components[i];

                if(!component.isStarted){
                    component.Start(this, ...arg);
                    component.isStarted = true;
                }
                component.Update(this, ...arg);
            }
        }
    }

    return {
        create: function(dx, dy, show = 1, w, h, id = Wildcat.array.getEmpty(list)){
            
            list[id] = new GameObject(dx, dy, show = 1, w, h);
            return id;
            
        },
        list: list
    }
})();
/*------------------------------------------

コンポーネント

------------------------------------------*/
Wildcat.component = (function(){
    let list = [];

    let Component = class {
        /**
         * 
         * @param {(object: any, ...arg)=>null} Start 
         * @param {(object: any, ...arg)=>null} Update 
         */
        constructor(Start, Update){
            this.Start = Start;
            this.Update = Update;
            
            this.isStarted = false;
        }
    }

    return {
        /**
         * 
         * @param {(object: any, ...arg)=>null} Start 
         * @param {(object: any, ...arg)=>null} Update 
         * @param {number} id 
         * @returns {number}
         */
        create: function(Start, Update, id = Wildcat.array.getEmpty(list)){
            list[id] = new Component(Start, Update);
            return id
        },
        list: list
    }
})();
/*------------------------------------------

マップ関連

------------------------------------------*/
Wildcat.map = {};


/*
マップチップ
-------------------------------*/
Wildcat.map.chip = (function(){
    return {

    }
})();
/*
チップセット
-------------------------------*/



/*
タイルマップ
-------------------------------*/
Wildcat.map.tileMap = (function(){
    let WCatArray = Wildcat.array;
    let list = [];

    let mapData = class{
        constructor(data){
            if(typeof data[0] === "object"){
                this.width = WCatArray.getMostLonger(data)
                for(let i in data){
                    data[i].length = this.width;
                    WCatArray.falsyToZeroAll(data[i]);
                }
            }else{
                throw new TypeError("data type is " + typeof data[0])
            }
            //joinAllすると文字列型になるのでもう一回nuber型に変える
            this.data = WCatArray.joinAll(data).map(x=>+x);
        }
    }

    return {
        create: function(data, id = WCatArray.getEmpty(list)){
            list[id] = new mapData(data);
            return id;
        },
        list: list
    }
})();
