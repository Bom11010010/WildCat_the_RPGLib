import { array } from "./Array.js";
export let inventory = (function(){
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
                    this.usabeObjects = array.removeElement(this.usabeObjects, i)
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
            let inv = inventory.list[invId];
            if(inv.tag === this.tag){
                if(this.find(id) == -1){
                    return;
                }else if(count < 0){
                    return;
                }else if(this.usabeObjects[this.find(id)].count <= count){
                    this.remove(id, this.usabeObjects[this.find(id)].count);
                    inventory.list[invId].add(id, this.usabeObjects[this.find(id)].count);
                }else{
                    this.remove(id, count);
                    inventory.list[invId].add(id, count);
                }
            }
        }
    }
    return {
        create: function(tag, id = array.getFirstEmpty(list)){
            list[id] = new Inventory(tag);
        },
        list: list
    }
})();