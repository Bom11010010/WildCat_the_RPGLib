import { layer } from "./Layer.js";

export let gameData = {
    chipSize: 32,
    screenSize: {x: 640, y: 480},
    nowFrame: 0,
    set fps(a){fps = a},
    get fps(){return fps},
    startGame: function(main){
        /**
         * @type function
         */
        let fps = 30;
        let nowFrame = 0;

        (function mainloop(){

            nowFrame = nowFrame + 1;

            for(let i in layer.list){
                let targetLayer = layer.list[i];

                targetLayer.clearRect(0, 0, targetLayer.canvas.width, targetLayer.canvas.height);
            }
            main();

            gameData.nowFrame = nowFrame;

            setTimeout(mainloop, 1000 / fps)
        })();
    }
};

