function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);  
}


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function MouseToCoord(mouseX, mouseY) {
    return {
        x: Math.floor(mouseX / 85),
        y: Math.floor(mouseY / 85)
    }
}
/* GAME */

const canvas = $("#gameTable");
const ctx = canvas.getContext("2d");
const level1 = {
    map: [{
            x: 1,
            y: 1,
            type: "start",
            movable: false,
            rotatable: false,
            dir: "S",
            img: "./res/lezer.png"
        },
        {
            x: 3,
            y: 3,
            type: "endMirror",
            movable: false,
            rotatable: false,
            dir: "E",
            img: "./res/cel.png"
        }],
    objects: [{
            x: 0,
            y: 0,
            type: "doubleMirror",
            movable: true,
            rotatable: true,
            dir: "E",
            img: "./res/dupla.png"
        }],
    endPoints: 1
}

const level2 = {
    map: [{
            x: 0,
            y: 0,
            type: "start",
            movable: false,
            rotatable: true,
            dir: "W",
            img: "./res/lezer.png"
        },
        {
            x: 4,
            y: 0,
            type: "endMirror",
            movable: false,
            rotatable: true,
            dir: "W",
            img: "./res/cel.png"
        },
        {
            x: 3,
            y: 1,
            type: "doubleMirror",
            movable: false,
            rotatable: false,
            dir: "N",
            img: "./res/dupla.png"
        },
        {
            x: 2,
            y: 2,
            type: "block",
            movable: false,
            rotatable: true,
            dir: "E",
            img: "./res/blokkolo.png"
        }],
    objects: [{
            x: 0,
            y: 0,
            type: "endMirror",
            movable: true,
            rotatable: true,
            dir: "E",
            img: "./res/cel.png"
        },
        {
            x: 0,
            y: 1,
            type: "halfMirror",
            movable: true,
            rotatable: true,
            dir: "E",
            img: "./res/felig.png"
        }],
    endPoints: 2
}

const level3 = {
    map: [{
            x: 1,
            y: 2,
            type: "start",
            movable: false,
            rotatable: true,
            dir: "E",
            img: "./res/lezer.png"
        },
        {
            x: 2,
            y: 0,
            type: "mirror",
            movable: false,
            rotatable: true,
            dir: "E",
            img: "./res/tukor.png"
        },
        {
            x: 4,
            y: 0,
            type: "mirror",
            movable: false,
            rotatable: true,
            dir: "E",
            img: "./res/tukor.png"
        },
        {
            x: 3,
            y: 2,
            type: "mirror",
            movable: false,
            rotatable: false,
            dir: "E",
            img: "./res/tukor.png"
        },
        {
            x: 0,
            y: 4,
            type: "doubleMirror",
            movable: false,
            rotatable: false,
            dir: "E",
            img: "./res/dupla.png"
        },
        {
            x: 4,
            y: 3,
            type: "checkPoint",
            movable: false,
            rotatable: false,
            dir: "E",
            img: "./res/ellenorzo.png"
        }],
    objects: [{
            x: 0,
            y: 0,
            type: "mirror",
            movable: true,
            rotatable: true,
            dir: "E",
            img: "./res/tukor.png"
        },
        {
            x: 0,
            y: 1,
            type: "mirror",
            movable: true,
            rotatable: true,
            dir: "E",
            img: "./res/tukor.png"
        },
        {
            x: 0,
            y: 2,
            type: "halfMirror",
            movable: true,
            rotatable: true,
            dir: "E",
            img: "./res/felig.png"
        }],
    endPoints: 2
}

let currLevel = level1;

function setLevel(e) {
    switch(e.parent) {
        case 1: currLevel = level1; break;
        case 2: currLevel = level2; break;
        case 3: currLevel = level3; break;
    }
    init();
    console.log("lul");
    draw(currLevel);
}

$("#easy").addEventListener('click', function(e){
    currLevel = level1;
    init();
    draw(currLevel);
}, false);
$("#medium").addEventListener('click', function(e){
    currLevel = level2;
    init();
    draw(currLevel);
}, false);
$("#hard").addEventListener('click', function(e){
    currLevel = level3;
    init();
    draw(currLevel);
}, false);

function init() {
    canvas.width = 720;
    canvas.height = 480;

    for(let i = 0; i < 5; ++i) {
        for(let j = 0; j < 5; ++j) {
            ctx.strokeStlye = "#000";
            ctx.strokeRect(i * 80, j * 80, 80, 80);
        }
    }

    for(let i = 0; i < 5; ++i) {
        ctx.strokeStlye = "#000";
        ctx.strokeRect(480, i * 80, 80, 80);
    }

    ctx.strokeStlye = "#000";
    ctx.strokeRect(640, 0, 80, 80);
}

function checkIfWon() {
    let s = [];
    currLevel.map.forEach(function(tile){
        if(tile.type == "start") {
            let tmppush = {
                x: tile.x,
                y: tile.y,
                type: tile.type,
                dir: tile.dir
            }
            s.push(tmppush);
        }
    }, false);

    let l = false;
    let calc = 0;

    while(!l) {
        let tmp = s.shift();
        
        let moved = false;

        if(tmp.x >= 0 && tmp.x < 5 && tmp.y >= 0 && tmp.y < 5) {
            currLevel.map.forEach(function(tile){
                if(tile.y == tmp.y && tile.x == tmp.x) {
                    switch(tile.type){
                        case "endMirror":
                            calc++;
                        break;
                        case "doubleMirror":
                            let tmpAdd = {
                                x: tmp.x,
                                y: tmp.y,
                                dir: tmp.dir
                            };
                            let tmpAdd2 = {
                                x: tmp.x,
                                y: tmp.y,
                                dir: tmp.dir
                            };
                            switch(tmp.dir) {
                                case "S": 
                                case "N": 
                                    tmpAdd.dir = "E";
                                    tmpAdd.x++;
                                    tmpAdd2.dir = "W";
                                    tmpAdd2.x--;
                                break;
                                case "W": 
                                case "E": 
                                    tmpAdd.dir = "S"; 
                                    tmpAdd.y++;
                                    tmpAdd2.dir = "N";
                                    tmpAdd2.y--;
                                break;
                            }
                            s.push(tmpAdd);
                            s.push(tmpAdd2);
                            moved = true;
                        break;
                        case "mirror":
                            let tmpAdd = {
                                x: tmp.x,
                                y: tmp.y,
                                dir: tmp.dir
                            };
                            switch(tmp.dir) {
                                case "S": 
                                    tmpAdd.dir = "W";
                                    tmpAdd.x--;
                                case "N": 
                                    tmpAdd.dir = "E";
                                    tmpAdd.x++;
                                break;
                                case "W":  
                                    tmpAdd.dir = "N";
                                    tmpAdd.y--;
                                case "E": 
                                    tmpAdd.dir = "S"; 
                                    tmpAdd.y++;
                                break;
                            }
                            s.push(tmpAdd);
                            moved = true;
                        break;
                        case "halfMirror":
                            let tmpAdd = {
                                x: tmp.x,
                                y: tmp.y,
                                dir: tmp.dir
                            };
                            let tmpAdd2 = {
                                x: tmp.x,
                                y: tmp.y,
                                dir: tmp.dir
                            };
                            switch(tmp.dir) {
                                case "S": 
                                    tmpAdd.dir = "S";
                                    tmpAdd.y--;
                                    tmpAdd2.dir = "E";
                                    tmpAdd2.x++;
                                case "N": 
                                    tmpAdd.dir = "N";
                                    tmpAdd.y++;
                                    tmpAdd2.dir = "W";
                                    tmpAdd2.x--;
                                break;
                                case "W": 
                                    tmpAdd.dir = "W"; 
                                    tmpAdd.x--;
                                    tmpAdd2.dir = "N";
                                    tmpAdd2.y--;
                                case "E": 
                                    tmpAdd.dir = "E"; 
                                    tmpAdd.x++;
                                    tmpAdd2.dir = "S";
                                    tmpAdd2.y++;
                                break;
                            }
                            s.push(tmpAdd);
                            s.push(tmpAdd2);
                            moved = true;
                        break;
                        default:
                        break;
                    }
                    
                }
            }, false);

            if(!moved) {
                switch(tmp.dir) {
                    case "N": tmp.y -= 1; break;
                    case "S": tmp.y += 1; break;
                    case "E": tmp.x += 1; break;
                    case "W": tmp.x -= 1; break;
                }
                s.push(tmp);
            }
        }
        if(calc == currLevel.endPoints) {
            l = true;
            alert("A lézer célba ért!");
        }
    }


}

function draw(level) {
    init();
    level.map.forEach(function(tile){
        let imgObj = new Image();

        imgObj.onload = function() {
            ctx.save();
            switch(tile.dir) {
                case "N":
                    ctx.translate((tile.x*80), (tile.y*80));
                    ctx.rotate(270 * Math.PI/180);
                    ctx.drawImage(imgObj, -80, 0, 80, 80);
                    ctx.restore();
                break;
                case "S":
                    ctx.translate((tile.x*80), (tile.y*80));
                    ctx.rotate(90 * Math.PI/180);
                    ctx.drawImage(imgObj, 0, -80, 80, 80);
                    ctx.restore();
                break;
                case "W":
                    ctx.translate((tile.x*80), (tile.y*80));
                    ctx.rotate(180 * Math.PI/180);
                    ctx.drawImage(imgObj, -80, -80, 80, 80);
                    ctx.restore();
                break;
                default:
                    ctx.drawImage(imgObj, tile.x * 80, tile.y * 80, 80, 80);
                break;
            }
        }
        imgObj.src = tile.img;
    }, this);

    level.objects.forEach(function(tile) {
        let imgObj = new Image();

        imgObj.onload = function() {
            ctx.drawImage(imgObj, 480, tile.y * 80, 80, 80);
        }
        imgObj.src = tile.img;
    }, this);

    ctx.font = "70px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(level.endPoints,662,70);

    checkIfWon();
}

canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault()

    let mouse = getMousePos(canvas, e);
    let inCanvMouse = MouseToCoord(mouse.x, mouse.y);
    
    currLevel.map.forEach(function(tile){
        if(tile.x == inCanvMouse.x && tile.y == inCanvMouse.y && tile.rotatable) {
            switch(tile.dir) {
                case "N": tile.dir = "E"; break;
                case "E": tile.dir = "S"; break;
                case "S": tile.dir = "W"; break;
                case "W": tile.dir = "N"; break;
            }
        }
    }, this);
    draw(currLevel);

    return false;
}, false);

let hasSaved = false;
let savedTile = undefined;
canvas.addEventListener('click', function(e){
    let mouse = getMousePos(canvas, e);
    let inCanvMouse = MouseToCoord(mouse.x, mouse.y);
    
    if(!hasSaved) {
        if(inCanvMouse.x == 6) {
            currLevel.objects.forEach(function(tile){
                if(tile.y == inCanvMouse.y) {
                    savedTile = tile;
                    hasSaved = true;
                    currLevel.objects.splice(currLevel.objects.indexOf(tile), 1);
                }
            }, this);
        } else {
            currLevel.map.forEach(function(tile){
                if(tile.y == inCanvMouse.y && tile.x == inCanvMouse.x && tile.movable) {
                    savedTile = tile;
                    hasSaved = true;
                    map.objects.splice(map.objects.indexOf(tile), 1);
                }
            }, this);
        }
    } else {
        let setable = true;
        if(inCanvMouse.x >= 0 && inCanvMouse.x < 5 && inCanvMouse.y >= 0 && inCanvMouse.y < 5) {

            currLevel.map.forEach(function(tile){
                if(tile.y == inCanvMouse.y && tile.x == inCanvMouse.x && tile.movable) {
                    setable = false;
                }
            }, this);

            if(setable) {
                savedTile.x = inCanvMouse.x;
                savedTile.y = inCanvMouse.y;
                currLevel.map.push(savedTile);
                hasSaved = false;
                savedTile = undefined;
            }

        }
    }
    draw(currLevel);
}, false);