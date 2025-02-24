export let object = (function(){
	return {
		/**
		 * 
		 * @param {any} obj 
		 * @returns 
		 */
		encodeToString: function encode(obj){
			let result = ""
			for(let i in obj){
				if(result !== ""){
					result += ";"
				}
				if(typeof obj[i] == 'object'){
					result += `${i}=${encodeURIComponent(encode(obj[i]))}|object`
				}else{
					//非対応の型を弾く
					if(typeof obj[i] !== 'bigint' && typeof obj[i] !== 'function' && typeof obj[i] !== 'symbol'){
						result += `${i}=${encodeURIComponent(obj[i])}|${typeof obj[i]}`
					}
				}
			}
			return result
		},
		/**
		 * 
		 * @param {string} str 
		 */
		decodeFromString: function decode(str){
			let result = {}
			
			let keyAndDataList = str.split(";")

			for(let i in keyAndDataList){
				let key
				/**
				 * @type {string}
				 */
				let dataAndType


				[key, dataAndTypeStr] = keyAndDataList[i].split("=");
				dataAndType = dataAndTypeStr.split("|");

				data = decodeURIComponent(dataAndType[0])
				if(dataAndType[1] == 'undefined'){
					result[key] = undefined;
				}else if(dataAndType[1] == 'string'){
					result[key] = data
				}else if(dataAndType[1] == 'number'){
					result[key] = +data
				}else if(dataAndType[1] == 'boolean'){
					if(data === 'false'){
						result[key] = false;
					}else{
						result[key] = true;
					}
				}else if(dataAndType[1] == 'object'){
					result[key] = decode(data);
				}
			}

			return result
		}
	}
})()