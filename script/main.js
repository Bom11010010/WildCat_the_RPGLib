
let wc_image = Wildcat.image;
let wc_layer = Wildcat.layer;

let src = "https://i.ytimg.com/an_webp/GjwnXLYi7KY/mqdefault_6s.webp?du=3000&sqp=CKyAhoEG&rs=AOn4CLCYyyZBrU-8euK1fFSmGVOKbi66_A"

Wildcat.gameData.chipSize = 16;
let imageID = wc_image.create(src, 'atlas');
wc_image.targetLayer = Wildcat.layer.create();
function main(){
    let nf = Wildcat.gameData.nowFrame;
    if(nf === 0){
        console.log("is first frame!!");
    }
    v = (wc_image.list[imageID].element.width / Wildcat.gameData.chipSize) || 0;
    a = [
        (((nf-1) % v) || 0) * Wildcat.gameData.chipSize,
        Math.floor(((nf-1) / v) || 0) * Wildcat.gameData.chipSize,
        ((nf-1) % v) || 0,
        Math.floor(((nf-1) / v) || 0)
    ];
    wc_image.draw(imageID,...a);
}

Wildcat.gameData.startGame(main);