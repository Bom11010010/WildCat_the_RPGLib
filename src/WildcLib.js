if(typeof nw != 'undefined'){
    const { normalize } = require("path");
}

export let Wildcat = {}
/*------------------------------------------

ゲームデータ

------------------------------------------*/
import { gameData } from "./WildcLib/GameData.js";
Wildcat.gameData = gameData;
/*------------------------------------------

数値操作

------------------------------------------*/
import { number } from "./WildcLib/Number.js";
Wildcat.number = number;


/*------------------------------------------

配列操作

------------------------------------------*/
import { array } from "./WildcLib/Array.js";
Wildcat.array = array;

/*------------------------------------------

オブジェクト操作

------------------------------------------*/
import { object } from "./WildcLib/Object.js";
Wildcat.object = object

/*------------------------------------------

DOM操作

------------------------------------------*/
import { dom } from "./WildcLib/Dom.js";
Wildcat.dom = dom;

/*------------------------------------------

レイヤー

------------------------------------------*/
import { layer } from "./WildcLib/Layer.js";
Wildcat.layer = layer;


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
        create: function(src, type = 'se', id = Wildcat.array.getFirstEmpty(list)){
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
        create: function(src, type = 'image', actorSize = undefined, id = Wildcat.array.getFirstEmpty(list)){
            let imageType = 0;
            let element = new Image();
            element.src = src;
            if(type === 'image'){
                imageType = 0;
                if(actorSize === void 0){
                    element.onload = ()=>{
                        Wildcat.image.list[id].actorSize = element.width;
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

Wildcat.animation = (function(){
    let list = [];
    return {
        create: function(){

        },
        list: list
    }
})()

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
        constructor(dx, dy, show = 1, w, h, id){
            this.show = show;
            this.position = {dx: dx, dy: dy};
            this.size = {w: w, h: h}
            /**
             * @type {Array<{Start: (object: any, value: any)=>any, Update: (object: any, value: any)=>any, isStarted: boolean, name: string}>}
             */
            this.components = [];

            /**
             * @type {any[][]}
             */
            this.value = []

            this.id = id;
        }
        /**
         * 
         * @param {number} compId
         * @param {number} id 
         * @returns {number}
         */
        addComponent(compId, value = {}, id = Wildcat.array.getFirstEmpty(this.components)){
            this.components[id] = Wildcat.component.list[compId];
            this.value[this.components[id].name] = value;
            return id
        }
        /**
         * 
         * @param {number} compId 
         * @param {*[]} value 
         */
        setValue(compId, value){
            compName = Wildcat.component.list[compId].name;
            this.value[compName] = value;
        }

        work(){
            let components = this.components
            /**
             * @type {{Start: (object: any, value: any)=>any, Update: (object: any, value: any)=>any, isStarted: boolean}}
             */
            let component;

            for(let i in components){
                
                component = components[i];

                let value = this.value[component.name];


                if(!component.isStarted){
                    this.value[i] = component.Start(this, value);
                    component.isStarted = true;
                }
                this.value[i] = component.Update(this, value);
            }
        }

        remove(){
            if(Wildcat.gameObject.list[this.id]){
                list.splice(this.id, 1)
            }
        }
    }

    return {
        create: function(dx, dy, show = 1, w, h, id = Wildcat.array.getFirstEmpty(list)){
            
            list[id] = new GameObject(dx, dy, show = 1, w, h, id);

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
         * @param {(object: any, value: any)=>any} Start 
         * @param {(object: any, value: any)=>any} Update 
         */
        constructor(name, Start, Update){
            this.name = name;
            this.Start = Start;
            this.Update = Update;
            
            this.isStarted = false;

            this.values;
        }
    }

    return {
        /**
         * 
         * @param {string} name
         * @param {(object: any, value: any)=>any} Start 
         * @param {(object: any, value: any)=>any} Update 
         * @param {number} id 
         * @returns {number}
         */
        create: function(name, Start, Update, id = Wildcat.array.getFirstEmpty(list)){
            list[id] = new Component(name, Start, Update);
            return id
        },
        list: list
    }
})();

/*------------------------------------------

ファイル

------------------------------------------*/

Wildcat.file = (function(){
    /**
     * @type {string}
     */
    let dataStore = "";

    /**
     * @type {string}
     */
    let dataStoreName = "noname";

    /**
     * @type {(name: string)=>boolean}
     */
    let selectDataStore = function(name){
        dataStoreName = name;
    }

    /**
     * @type {()=>boolean}
     */
    let save = function(){
        document.cookie = `${dataStoreName}=${encodeURIComponent(dataStore)}`;
        return true;
    };

    /**
     * @type {()=>boolean}
     */
    let load = function(){
        let data

        let cookies = document.cookie.split(';')

        if(cookies[0] === ""){return false}
        cookies.forEach(function(value){
            let content = value.split("=")
            if(content[0] == dataStoreName){
                data = content[1]
            }
        })
        if(typeof data != "undefined"){
            dataStore = decodeURIComponent(data)
            return true
        }
        return false
    }

    /**
     * @type {()=>boolean}
     */
    let deleteData = function(){
        
        document.cookie = `${dataStoreName}=none; max-age=0`;
        return true;
    }

    if(typeof nw != 'undefined'){
        let path = require("path");
        let fs = require("fs");
        let execSync = require("child_process").execSync;

        let appDir;

        /**
         * アプリ（exeもしくはhtmlファイル）の場所。セーブデータ等の後から改変するファイルのディレクトリを取得するのに使う
         * @type {string}
         */
        appDir = process.cwd();
        if(!appDir.match(/src$/)){
            appDir = path.dirname(process.execPath);
        }
        
        //セーブディレクトリが無いなら作成する
        if (!fs.existsSync(appDir + `\\save`)) {
            fs.mkdirSync(appDir + `\\save`);
        }

        save = function(){
            fs.writeFileSync(appDir + `\\save\\${dataStoreName}.dat`, dataStore, function(err){})

            return true
        }
        load = function(){

            if(fs.existsSync(appDir + `\\save\\${dataStoreName}.dat`)){
                dataStore = fs.readFileSync(appDir + `\\save\\${dataStoreName}.dat`, 'utf8')
                return true
            }
            return false
        }
        deleteData = function(){
            fs.unlink(appDir + `\\save\\${dataStoreName}.dat`, function(err) {});
            return true
        }
    }

    return{
        selectDataStore: selectDataStore,
        save: save,
        load: load,
        deleteData: deleteData,
        get dataStore(){return dataStore},
        /**
         * 
         * @param {string} key 
         * @param {any} data 
         * @returns {boolean}
         */
        writeData: function(key, data){

            if(key.match(/[^A-Za-z0-9]+/)){
                //英数字でないならfalseを返して終了
                return false
            }else if(key[0].match(/[^A-Za-z]+/)){
                //先頭が数字ならfalseを返して終了
                return false
            }

            //非対応の型を弾く
            if(typeof data === 'bigint' || typeof data === 'function' || typeof data === 'symbol'){
                return false
            }
            

            //既にそのキーを持つ値があるか

            if(dataStore.match(`${key}=`)){
                let dataList = dataStore.split(";");
                let keyAndDataList = dataList.map(x=>{let value = x.split("="); return [value[0], value[1]]});



                let newDataList = keyAndDataList.map(x=>{
                    let newData = (x[1].split("|"))[0]; //型の部分のみ取り出す
                    if(x[0] == key){
                        if(typeof data == 'object'){
                            newData = encodeURIComponent(Wildcat.object.encodeToString(data))
                        }else{
                            newData = encodeURIComponent(data);
                        }
                    }
                    return `${x[0]}=${newData}|${typeof data}`
                })

                dataStore = newDataList.join(";");

                return true
            }

            if(dataStore !== ""){
                dataStore += ";";
            }
            dataStore += `${key}=${encodeURIComponent(data)}|${typeof data}`;

            return true;
        },
        readData: function(key){
            let dataList = dataStore.split(";");
            let keyAndDataList = dataList.map(x=>{let data = x.split("="); return [data[0], data[1]]});
            
            let result = undefined;

            for(let i in keyAndDataList){
                if(keyAndDataList[i][0] == key){
                    let value
                    /**
                     * @type {'undefined'|'boolean'|'number'|'string'|'object'}
                     */
                    let type
                    [value, type] = keyAndDataList[i][1].split("|");

                    value = decodeURIComponent(value);
                    
                    if(type == 'string'){
                        result = value
                    }else if(type == 'number'){
                        result = +value   //値の前に+を付けることでnumber型に変えられる
                    }else if(type == 'boolean'){
                        if(value === "false"){
                            result = false;
                        }else{
                            result = true;
                        }
                    }else if(type === 'undefined'){
                        result = undefined;
                    }else if(type == 'object'){
                        result = Wildcat.object.decodeFromString(value)
                    }
                }
            }
            return result
        },
        removeData: function(key){
            let dataList = dataStore.split(";");
            let keyAndDataList = dataList.map(x=>{let data = x.split("="); return [data[0], data[1]]});

            for(let i in keyAndDataList){
                if(keyAndDataList[i][0] == key){
                    target = i;
                }
            }
            keyAndDataList.splice(target, 1);
            let newDataList = keyAndDataList.map(x=>{return x.join("=")});
            
            dataStore = newDataList.join(";");
        }
    }
})();

/*------------------------------------------

Usableオブジェクト

------------------------------------------*/

///
// note: ここで記述するのはインベントリのアイテム、呪文等のユーザーやNPCが使用可能なモノとその情報
///

Wildcat.usable = (function(){
    /**
     * @type any[][]
     */
    let lists = {};

    let Usable = class{
        /**
         * 
         * @param {function()} effect 効果
         * @param {number} cost コスト。どのように消費する物かは決めていないが、アイテムなら金額、スキルならクールタイムや消費MPとすることを想定している
         * @param {string} name 名前
         * @param {string} comment 説明やフレーバーテキスト
         * @param {boolean} isPassive 所持するだけで効果を発動するか
         */
        constructor(effect, cost, name, comment, isPassive){
            this.cost = cost
            this.isPassive = isPassive
            this.name = name
            this.comment = comment
            this.effect = effect
        }
    }
    return {
        /**
         * 
         * @param {string} tag 使用可能オブジェクトの種類。「アイテム」や「呪文」等（半角英数推奨）
         * @param {function()} effect 効果
         * @param {number} cost コスト。どのように消費する物かは決めていないが、アイテムなら金額、スキルならクールタイムや消費MPとすることを想定している
         * @param {string} name 名前
         * @param {string} comment 説明やフレーバーテキスト
         * @param {boolean} isPassive 所持するだけで効果を発動するか
         * @param {number} id tagごとの使用可能オブジェクトID。tagが違うならIDが同じでも構わない
         * @returns {number} 
         */
        create: function(tag, effect, cost, name, comment, isPassive = false, id = Wildcat.array.getFirstEmpty(lists[tag])){
            lists[tag][id] = new Usable(effect, cost, name, comment, isPassive)
            return id
        },
        lists: lists
    }
})();

/*------------------------------------------

インベントリ

------------------------------------------*/

Wildcat.inventory = (function(){
    let list = [];
    let Inventory = class {
        constructor(tag){
            this.tag = tag
            /**
             * 実体ではなくIDと個数を入れる
             * @type {any[]}
             */
            this.usabeObjects = [] //{id, count}
            this.selecting = 0
        }

        get selectingObjId(){return this.usabeObjects[this.selecting].id}

        
        /**
         * インベントリ内を探し、インデックスを返す
         * @param {number} usableId 
         * @returns {number} index
         */
        find(usableId){
            let result = -1

            this.usabeObjects.forEach((v, index)=>{if(v.id === usableId){result = index}})

            return result
        }

        add(usableId = this.selectingObjId, count = 1){
            let index = this.find(usableId)
            if(index == -1){
                //インベントリにusableIdのIDを持つオブジェクトが無い場合
                this.usabeObjects.push({id: usableId, count: count})
            }else{
                //ある場合
                this.usabeObjects[index].count += count
            }
            this.normalize()
        }

        remove(usableId = this.selectingObjId, count = 1){
            let index = this.find(usableId)

            this.usabeObjects[index].count -= count
            this.normalize()
        }
        /**
         * インベントリを整理する
         */
        normalize(){

            for(let i in this.usabeObjects){
                //一つも存在しないオブジェクトをインベントリから取り除く
                if(this.usabeObjects[i].count <= 0){
                    this.usabeObjects = Wildcat.array.removeElement(this.usabeObjects, i)
                }
            }
        }
        swap(index_1, index_2){
            let _temp;
            _temp = this.usabeObjects[index_1];

            this.usabeObjects[index_1] = this.usabeObjects[index_2];

            this.usabeObjects[index_2] = _temp;
        }
        sendTo(invId, id = this.selectingObjId, count = 1){
            let inv = Wildcat.inventory.list[invId];
            if(inv.tag === this.tag){
                if(this.find(id) == -1){
                    return;
                }else if(count < 0){
                    return;
                }else if(this.usabeObjects[this.find(id)].count <= count){
                    this.remove(id, this.usabeObjects[this.find(id)].count);
                    Wildcat.inventory.list[invId].add(id, this.usabeObjects[this.find(id)].count);
                }else{
                    this.remove(id, count);
                    Wildcat.inventory.list[invId].add(id, count);
                }
            }
        }
    }
    return {
        create: function(tag, id = Wildcat.array.getFirstEmpty(list)){
            list[id] = new Inventory(tag);
        },
        list: list
    }
})();