function $(s) {
    return document.querySelector(s);
}

function delegate(psel, type, csel, fn) {
    const parent = $(psel);
    
    function handler(event) {
        let target = event.target;
        while(target !== parent && !target.matches(csel)) {
            target = target.parentNode;
        }
        if(target === parent) return;
        event.delegetedTarget = target;
        fn.call(parent, event);
    }

    parent.addEventListener(type, handler, false);
}

let o1, o2, op;
let isLastOp = false;

function calc(o1, o2, op) {
    switch (op) {
        case "+":
            return o1 + o2;
        break;
        case "-":
            return o1 - o2;
        break;
        case "/":
            return o1 / o2;
        break;
        case "*":
            return o1 * o2;
        break;
    }
}

function clickButton(event) {
    let btn = event.delegetedTarget.getAttribute('data-value');
    if(!isNaN(parseInt(btn))) {
        if(isLastOp) {
            isLastOp = false;
            $('output').innerHTML = btn;
        } else {
            $('output').innerHTML += btn;
        }
    } else if(btn === "=") {
        isLastOp = true;
        o2 = parseInt($('output').innerHTML);
        let result = calc(o1, o2, op);
        $('output').innerHTML = result;
        o1 = undefined;
        o2 = undefined;
        op = undefined;
    } else {
        isLastOp = true;
        if(o1 !== undefined && op !== undefined) {
            o2 = parseInt($('output').innerHTML);
            $('output').innerHTML = calc(o1, o2, op);
            op = btn;
            o1 = parseInt($('output').innerHTML);
            o2 = undefined;
        } else {
            op = btn;
            o1 = parseInt($('output').innerHTML);
            $('output').innerHTML = "";
        }
    }
    console.log(o1, o2, op);
}

delegate('table', 'click', 'button', clickButton);