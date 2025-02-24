import { object } from "./Object.js";
export let file = (function(){
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
                            newData = encodeURIComponent(object.encodeToString(data))
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
                        result = object.decodeFromString(value)
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