import { array } from "./Array.js";
import { component } from "./Component.js";
export let gameObject = (function(){
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
        addComponent(compId, value = {}, id = array.getFirstEmpty(this.components)){
            this.components[id] = component.list[compId];
            this.value[this.components[id].name] = value;
            return id
        }
        /**
         * 
         * @param {number} compId 
         * @param {*[]} value 
         */
        setValue(compId, value){
            compName = component.list[compId].name;
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
            if(gameObject.list[this.id]){
                list.splice(this.id, 1)
            }
        }
    }

    return {
        create: function(dx, dy, show = 1, w, h, id = array.getFirstEmpty(list)){
            
            list[id] = new GameObject(dx, dy, show = 1, w, h, id);

            return id;
            
        },
        list: list
    }
})();