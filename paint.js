// vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
    }
`

// fragment shader source
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`

// global vars
let canvas;
let a_Position;
let u_FragColor;
let u_Size;
let g_shapesList = [];

// constants
const POINT = 0;
const TRIANGLE = -1;
const CIRCLE = -2;

// global vars for UI
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegment = 5;

function setupWebGL() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders');
        return;
    }
    // get storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get storage location of a_Position');
        return;
    }
    // get storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get storage location of u_FragColor');
        return;
    }
    // get storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get storage location of u_Size');
        return;
    }
}

function addActionsUI() {
    console.log('!add UI JS functions!');
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsUI();
    // register function (event handler) to be called on mouse press
    canvas.onmousedown = cancelIdleCallback;
    canvas.onmousemove = function(ev) { if (ev.buttons == 1) {cancelIdleCallback(ev)} };
    // specify color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev) {
    // extract event click, return in webGL coords
    let [x, y] = convertCoordinatesEventToGL(ev);
    // create & store new point
    let point;
    if (g_selectedType == POINT) {
        point = new Point();
    } else if (g_selectedType == TRIANGLE) {
        point = new Triangle();
    } else if (g_selectedType == CIRCLE) {
        point = new Circle();
        point.segments = g_selectedSegment;
    }
    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);
    renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coord of mouse pointer
    var y = ev.clientY; // y coord of mouse pointer
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    return ([x,y]);
}

function renderAllShapes() {
    // check time at start of function
    var startTime = performance.now();
    // clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_shapesList.length;
    for (var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
    // check time at end of function & show on page
    var dur = performance.now() - startTime;
    sendTextToHTML("numdot: " + len + " ms: " + Math.floor(dur) + " fps: " + Math.floor(10000 / dur) / 10, "numdot");
}

function sendTextToHTML(text, htmlID) {
    var element = document.getElementById(htmlID);
    if (!element) {
        console.log('failed to get ' + htmlID + ' from HTML');
        return;
    }
    element.innerHTML = text;
}