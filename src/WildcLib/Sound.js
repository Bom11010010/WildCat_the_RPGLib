import { array } from "./Array.js";
export let sound = (function(){
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
        create: function(src, type = 'se', id = array.getFirstEmpty(list)){
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