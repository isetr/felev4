function $(s) {
    return document.querySelector(s);
}

let state;
let timer;

function init() {
    let newState = {
        p1: {
            y: Math.round(screen.availHeight / 2),
            score: 0
        },
        p2: {
            y: Math.round(screen.availHeight / 2),
            score: 0
        },
        ball: {
            y: Math.round(screen.availHeight / 2),
            x: Math.round(screen.availWidth / 2),
            v: {
                x: screen.availWidth / 50,
                y: Math.round((Math.random() * screen.availHeight - screen.availHeight / 2) / 10)
            }
        }
    };

    return newState;
}

function draw(state) {
    let p1 = $('#p1');
    let p2 = $('#p2');
    let ball = $('#ball');

    p1.style.top = state.p1.y + 'px';
    p2.style.top = state.p2.y + 'px';
    ball.style.top = state.ball.y + 'px';
    ball.style.left = state.ball.x + 'px';
}

function step(state) {
    state.ball.x += state.ball.v.x;
    state.ball.y += state.ball.v.y;

    state.ball.v.y *= state.ball.v.y <= 0? -1 : 1;
    state.ball.v.y *= state.ball.v.y >= screen.availHeight - 30? -1 : 1;

    if(state.ball.x <= 0) {
        state.p2.score++;
        $('#p2score').innerHTML = state.p2.score;
        state = init();
    }

    if(state.ball.x >= screen.availWidth - 30) {
        state.p1.score++;
        $('#p1score').innerHTML = state.p2.score;
        state = init();
    }

    return state;
}

function pressEnter(e) {
    if(e.keyCode == 13) {
        state = init();
        draw(state);
        clearInterval(timer);
        timer = setInterval(function () {
            state = step(state);
            draw(state);
        }, 50);
    } else {
        pressMove(e);
    }
}

window.addEventListener("keydown", pressEnter, false);

function pressMove(e) {
    let speed = 15;
    if(e.key == "W") {
        state.p1.y -= speed;
    } else if(e.key == "S") {
        state.p1.y += speed;
    } else if(e.key == "I") {
        state.p2.y -= speed;
    } else if(e.key == "K") {
        state.p2.y += speed;
    }
}