import { dom } from "./Dom.js";
import { gameData } from "./GameData.js";
export let layer = (function(){

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
		create: function(id = dom.getEmptyNumberedID("layer"), width = gameData.screenSize.x, height = gameData.screenSize.y){
			//idを強制的にnumberにする
			id = new Number(id);
			if(dom.checkExistsByID(`layer${id}`)){
				if(isNaN(id) || id === undefined){
					throw new Error(`そのLayerIDは使用出来ません`);
				}
				throw new Error(`${id}は使用中です`);
			}
			let layers = dom.layers;
			dom.addHTML(layers, `<canvas id="layer${id}" width="${width}" height="${height}" z-index="${id}"></canvas>`);
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