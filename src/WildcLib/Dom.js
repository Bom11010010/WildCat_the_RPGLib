export let dom = (function(){
	let body = document.getElementsByTagName('body')[0];
	body.innerHTML +=
`
<div id="outer">
	<div id="layers"></div>
	<div id="contents"></div>
</div>
`
	let head = document.getElementsByTagName('head')[0];
	head.innerHTML +=
	
`
<style id="fontSetter">
</style>

<style>
	body {
		overflow: hidden;
		font-family: "GameFont";
	}
	#contents > *{
		word-wrap: break-word;
		display: inline;
		position: absolute;
	}
	#layers > *{
		position: absolute;
	}
	#layers{
		overflow: hidden;
	}
	#outer{
		transform: scale(1,1);
		transform-origin:0 0;
		margin: auto auto;
	}
</style>
`
	let outer = document.getElementById("outer");
	let layers = document.getElementById("layers");
	let contents = document.getElementById("contents");

	return {
		/**
		 * @type HTMLBodyElement
		 */
		body: body,
		/**
		 * @type HTMLBodyElement
		 */
		head: head,
		/**
		 * @type HTMLDivElement
		 */
		outer: outer,
		/**
		 * @type HTMLDivElement
		 */
		layers: layers,
		/**
		 * @type HTMLDivElement
		 */
		contents: contents,

		/**
		 * HTMLを書き足す
		 * @param {HTMLElement} target 
		 * @param {string} html 
		 */
		addHTML: function(target, html){
			target.innerHTML += html;
		},
		checkExistsByID: function(id){
			return document.getElementById(id) ? true : false;
		},
		getEmptyNumberedID: function(id){
			//連番IDのなかで存在しない数（最小）を調べる
			let i = 0;
			while(this.checkExistsByID(`${id}${i}`)){
				i++;
			}
			return i
		},
		setFontFile: function(fontFileSrc){
			let fontSetter = document.getElementById("fontSetter");
			let extension = fontFileSrc.slice(-4);

			let format;

			if(extension === ".otf"){
				format = "opentype"
			}else if(extension === ".ttf"){
				format = "truetype"
			}

			if(fontFileSrc){
				fontSetter.innerHTML = 
`
@font-face {
	font-family: "GameFont";
	src: url(${fontFileSrc}) format("${format}");
}
`
			}else{
				fontSetter.innerHTML = ""
			}
		}
	}
})();