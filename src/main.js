
let wc_image = Wildcat.image;
let wc_layer = Wildcat.layer;

let src = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Red_Circle%28small%29.svg/44px-Red_Circle%28small%29.svg.png"


Wildcat.gameData.chipSize = 16;

wc_image.targetLayer = Wildcat.layer.create();

let imageID = wc_image.create(src, 'image');

sprite = Wildcat.component.create(
    "sprite",
    (object, value)=>{

    },
    (object, value)=>{
        let v = value

        wc_image.draw(v.imageID, object.position.dx, object.position.dy, object.size.w, object.size.h);

        let image = Wildcat.image.list[v.imageID]

        return v
    }
);

mover = Wildcat.component.create(
    "move",
    (object, value)=>{
        let v = value;

        object.size = v.size;

        if(Wildcat.file.load()){
            object.position = Wildcat.file.readData("position")
    
            v.speed = Wildcat.file.readData("speed")
        }

        return v
    },
    (object, value)=>{
        let v = value;

        object.position.dx = object.position.dx + v.speed.x;
        object.position.dy = object.position.dy + v.speed.y;

        if(object.position.dx + object.size.w >= Wildcat.gameData.screenSize.x || object.position.dx < 0){
            v.speed.x = -v.speed.x
        }
        if(object.position.dy + object.size.h >= Wildcat.gameData.screenSize.y || object.position.dy < 0){
            v.speed.y = -v.speed.y
        }
        Wildcat.file.writeData("position", object.position)

        Wildcat.file.writeData("speed", v.speed)

        return v
    }
)

test = Wildcat.gameObject.create(1, 0, 0)

spriteObj = Wildcat.gameObject.list[test]

spriteObj.addComponent(sprite, {imageID: imageID});
spriteObj.addComponent(mover, {speed:{x:5, y:5}, size:{w:50, h:50}});


spriteObj.remove(test);

function main(){
    spriteObj.work();
}

Wildcat.gameData.startGame(main);

if(typeof nw == 'undefined'){
    window.addEventListener('focusout', function(){

        Wildcat.file.save();

    });
}else{
    nw.Window.get().on('close', function () {

        Wildcat.file.save();

        this.close(true);
    });
}