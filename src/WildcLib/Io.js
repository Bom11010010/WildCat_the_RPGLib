export let io = (function(){

    let keyCode = {};
    window.addEventListener('keydown', (e)=>{
        keyCode[e.code] = true;
    }, false);
    window.addEventListener('keyup', (e)=>{
        keyCode[e.code] = false;
    }, false);

    
    let mousePos = {};
    window.addEventListener('mousemove', (e)=>{
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
    }, false)

    let mousePlessing = [];

    window.onmousedown = (e)=>{
        io.mouseCode[e.button] = true;
    }
    window.onmouseup = (e)=>{
        io.mouseCode[e.button] = false;
    }

    return {
        keyCode: keyCode,
        mousePos: mousePos,
        mouseCode: mousePlessing,
    }
})();