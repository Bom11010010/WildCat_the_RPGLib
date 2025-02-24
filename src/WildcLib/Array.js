export let array =  (function(){
    return {
        /**
         * 配列内のfalsyな値を全て0にした配列を返す。
         * @param {any} a
         */
        raplaceAllFalsyToZero: function(a){
            let result = a;
            if(!a){
                result = 0;
            }
            return result;
        },
        /**
         * 配列の最初の空の要素の番号を取得
         * @param {*[]} array 
         */
        getFirstEmpty: function(array){
            let i = 0;
            while(array[i]){
                i++;
            }
            return i
        },
        /**
         * 配列の配列（二次配列）の中の全ての要素を結合して配列を返す
         * @param {*[][]} array 
         */
        joinAll: function(array){
            return array.join().split(",");
        },
        /**
         * 配列の配列（二次配列）の中で一番長い要素の長さを返す
         * @param {*[][]} array 
         */
        getMostLonger: function(array){
            let result = 0;

            for(let i in array){
                if(array[i].length > result){
                    result = array[i].length
                }
            }

            return result;
        },
        /**
         * index番目を取り除いた配列を返す
         * @param {*[]} array
         * @param {number} index
         */
        removeElement: function(array, index){
            if(index === void 0){
                return array
            }
            let result = [];
            result = array.slice(0, index).concat(array.slice(index + 1));
            return result;
        },
        /**
         * 配列からランダムに要素を選ぶ
         * @param {*[]} array 
         */
        choose: function(array){return array[Math.floor(Math.random()*array.length)]}
    }
})()