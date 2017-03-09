function $(s) {
    return document.querySelector(s);
}

function $$(s) {
    return document.querySelectorAll(s);
}

function delegate(pSel, type, cSel, fn) {
    const p = $(pSel);
    p.addEventListener(type, function (e) {
        let t;
        for (t = e.target;
             t !== p && !t.matches(cSel);
             t = t.parentNode);
        if (t === p) { return; }
        e.delegatedTarget = t;
        fn.call(t, e);
    }, false);
}

let imageList = [];
let currentImage = undefined;

function addClick(e) {
}

function prevClick(e) {
}

function nextClick(e) {
}
