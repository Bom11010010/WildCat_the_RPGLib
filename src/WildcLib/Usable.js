import { array } from "./Array.js";
export let usable = (function(){
    /**
     * @type any[][]
     */
    let lists = {};

    let Usable = class{
        /**
         * 
         * @param {function()} effect 効果
         * @param {number} cost コスト。どのように消費する物かは決めていないが、アイテムなら金額、スキルならクールタイムや消費MPとすることを想定している
         * @param {string} name 名前
         * @param {string} comment 説明やフレーバーテキスト
         * @param {boolean} isPassive 所持するだけで効果を発動するか
         */
        constructor(effect, cost, name, comment, isPassive){
            this.cost = cost
            this.isPassive = isPassive
            this.name = name
            this.comment = comment
            this.effect = effect
        }
    }
    return {
        /**
         * 
         * @param {string} tag 使用可能オブジェクトの種類。「アイテム」や「呪文」等（半角英数推奨）
         * @param {function()} effect 効果
         * @param {number} cost コスト。どのように消費する物かは決めていないが、アイテムなら金額、スキルならクールタイムや消費MPとすることを想定している
         * @param {string} name 名前
         * @param {string} comment 説明やフレーバーテキスト
         * @param {boolean} isPassive 所持するだけで効果を発動するか
         * @param {number} id tagごとの使用可能オブジェクトID。tagが違うならIDが同じでも構わない
         * @returns {number} 
         */
        create: function(tag, effect, cost, name, comment, isPassive = false, id = array.getFirstEmpty(lists[tag])){
            lists[tag][id] = new Usable(effect, cost, name, comment, isPassive)
            return id
        },
        lists: lists
    }
})();