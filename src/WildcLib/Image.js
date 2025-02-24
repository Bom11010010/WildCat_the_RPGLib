import { layer } from "./Layer.js";
import { gameData } from "./GameData.js";
import { array } from "./Array.js";
export let image = (function(){
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
        create: function(src, type = 'image', actorSize = undefined, id = array.getFirstEmpty(list)){
            let imageType = 0;
            let element = new Image();
            element.src = src;
            if(type === 'image'){
                imageType = 0;
                if(actorSize === void 0){
                    element.onload = ()=>{
                        image.list[id].actorSize = element.width;
                    }
                }
            }
            if(type === 'atlas'){
                imageType = 1;
                if(actorSize === void 0){
                    actorSize = gameData.chipSize;
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
            let targetCtx = layer.list[targetLayer];
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