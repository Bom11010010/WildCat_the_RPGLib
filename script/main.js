
let wc_image = Wildcat.image;
let wc_layer = Wildcat.layer;

let src = "https://lh3.googleusercontent.com/proxy/2ocnAnZUAbr2qMPdPx1Ti86Fxymjs5tZKJSZ8lptKOSmaZM0cqX7PzagWKmdq5V7LOFS3879AMfNWR0Qq2ksyri4YF053TeI0ghvwOyZfS2pfzFqbMHDx1TDZyvflGX9RGKKmpoQ2dJM5K9reKoUmFA5"

Wildcat.gameData.chipSize = 16;

wc_image.targetLayer = Wildcat.layer.create();

let imageID = wc_image.create(src, 'image');

sprite = Wildcat.component.create(
    (object, imageId)=>{

    },
    (object, imageId)=>{
        wc_image.draw(imageId, object.position.dx, object.position.dy, object.size.w, object.size.h)
    }
);

mover = Wildcat.component.create(
    (object)=>{
    },
    (object)=>{
        object.position.dx = object.position.dx + 0.1;
        console.log(object)
    }
)

test = Wildcat.gameObject.create(1, 0, 0)

spriteObj = Wildcat.gameObject.list[test]

spriteObj.addComponent(sprite);

spriteObj.setArgument(sprite, [imageID])

spriteObj.addComponent(mover);

function main(){
    spriteObj.work();
}

Wildcat.gameData.startGame(main);

