// Segédfüggvények
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);  
}

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function hexToRGB(h) {return "rgb(" + hexToR(h) + "," + hexToG(h) + "," + hexToB(h) + ")"}
function colorAlpha(c, a) {return "rgba" + c.substring(3, c.length - 1) + "," + a + ')'}

const canvas = $("#_map");
const ctx = canvas.getContext("2d");
const heights = {
    plains: 200,
    hills: 500,
    mountains: 1000
}

function draw() {
    let zoom = $("#_ratio").value;
    canvas.width = maxX * zoom;
    canvas.height = maxY * zoom;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, maxX * zoom, maxY * zoom);

    let baseColor;
    let alpha;
    let nextColor;

    mapData.forEach(function(point) {
        const z = point[2];
        if(z <= $('#waterlevel').value) {
            baseColor = $('#water').value;
            nextColor = "#000000";
            alpha = 1 - ( z / $('#waterlevel').value);
        } else if(z <= heights.plains) {
            baseColor = $('#plains').value;
            nextColor = $('#hills').value;
            alpha = z / heights.plains;
        } else if(z <= heights.hills) {
            baseColor = $('#hills').value;
            nextColor = $('#mountains').value;
            alpha = (z - heights.plains) / (heights.hills - heights.plains);
        } else if(z <= heights.mountains) {
            baseColor = $('#mountains').value;
            nextColor = $('#high').value;
            alpha = (z - heights.hills) / (heights.high - heights.hills);
        } else {
            baseColor = $('#high').value;
            nextColor = "#000000";
            alpha = (z - heights.mountains) / (maxZ - heights.mountains);
        }
        ctx.fillStyle = colorAlpha(hexToRGB(baseColor), 1);
        ctx.fillRect(point[0] * zoom, (maxY - point[1]) * zoom, zoom, zoom);
        ctx.fillStyle = colorAlpha(hexToRGB(nextColor), alpha);
        ctx.fillRect(point[0] * zoom, (maxY - point[1]) * zoom, zoom, zoom);
    }, this);
}

$('aside').addEventListener('click', draw, false);
draw();