
let wc_image = Wildcat.image;
let wc_layer = Wildcat.layer;

let src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"



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
    }
)

test = Wildcat.gameObject.create(1, 0, 0)

spriteObj = Wildcat.gameObject.list[test]

spriteObj.addComponent(sprite);

spriteObj.setArgument(sprite, [imageID])

spriteObj.addComponent(mover);

spriteObj.remove(test);

function main(){
    spriteObj.work();
}

Wildcat.gameData.startGame(main);

