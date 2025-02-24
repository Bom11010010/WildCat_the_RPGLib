import { array } from "./Array.js";
export let component = (function(){
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
        create: function(name, Start, Update, id = array.getFirstEmpty(list)){
            list[id] = new Component(name, Start, Update);
            return id
        },
        list: list
    }
})();