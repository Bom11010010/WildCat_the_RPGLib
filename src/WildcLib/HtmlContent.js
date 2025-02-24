import { dom } from "./Dom.js";
export let htmlContent = (function(){
    let list = [];

    return {
        create: function(html, x = 0, y = 0, width = "auto", height = "auto", id = dom.getEmptyNumberedID("content")){
            id = new Number(id);
            if(dom.checkExistsByID(`content${id}`)){
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
            let contents = dom.contents;
            dom.addHTML(contents, `<div id="content${id}" style="width:${width}; height:${height}; top:${y}px; left:${x}px;">${html}</div>`);
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
