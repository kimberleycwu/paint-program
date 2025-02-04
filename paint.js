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
    document.getElementById('clear').onclick =  function() { g_shapesList = []; renderAllShapes(); };
    // CHANGE TO -- eraser = canvas color
    document.getElementById('erase').onclick = function() {
        g_selectedColor = [0.0, 0.0, 0.0, 1.0];
        // g_selectedType = CIRCLE;
        console.log('eraser selected');
    };
    // colors
    document.getElementById('white').onclick =  function() { g_selectedColor = [1.0, 1.0, 1.0, 1.0]; };
    document.getElementById('green').onclick =  function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById('red').onclick =    function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById('blue').onclick =   function() { g_selectedColor = [0.0, 0.0, 1.0, 1.0]; };
    document.getElementById('yellow').onclick = function() { g_selectedColor = [1.00, 0.852, 0.0100, 1.0]; };
    // shapes
    document.getElementById('pointButton').onclick =    function() { g_selectedType = POINT };
    document.getElementById('triangleButton').onclick = function() { g_selectedType = TRIANGLE };
    document.getElementById('circleButton').onclick =   function() { g_selectedType = CIRCLE };
    // segment slider
    const segment_slider = document.getElementById('segmentSlide');
    const segmentLabel = document.getElementById('segmentLabel');
    segment_slider.addEventListener('input', function() { segmentLabel.textContent = `segments: ${this.value}`; });
    document.getElementById('segmentSlide').addEventListener('mouseup',  function() { g_selectedSegment = this.value; });
    // size slider
    const size_slider = document.getElementById('sizeSlide');
    const sizeLabel = document.getElementById('sizeLabel');
    size_slider.addEventListener('input', function() { sizeLabel.textContent = `size: ${this.value}`; });
    document.getElementById('sizeSlide').addEventListener('mouseup',  function() { g_selectedSize = this.value; });
}

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsUI();

    // NEW implementation
    let isDrawing = false;
    canvas.onmousedown = (ev) => { isDrawing = true; click(ev); };
    canvas.onmouseup = () => { isDrawing = false; };
    canvas.onmousemove = (ev) => { if (isDrawing) requestAnimationFrame(() => click(ev)); };
    // specify color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev) {
    let [x, y] = convertCoordinatesEventToGL(ev);
    let shape;
    if (g_selectedType == POINT) {
        shape = new Point(x, y, g_selectedColor.slice(), g_selectedSize); // pass color and size from global variables
    } else if (g_selectedType == TRIANGLE) {
        shape = new Triangle(x, y, g_selectedColor.slice(), g_selectedSize); // same for triangle
    } else if (g_selectedType == CIRCLE) {
        shape = new Circle(x, y, g_selectedColor.slice(), g_selectedSize, g_selectedSegment); // include segment for circle
    }
    g_shapesList.push(shape);
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
    sendTextToHTML("num shapes: " + len + " ms: " + Math.floor(dur) + " fps: " + Math.floor(10000 / dur) / 10, "numdot");
}

function sendTextToHTML(text, htmlID) {
    var element = document.getElementById(htmlID);
    if (!element) {
        console.log('failed to get ' + htmlID + ' from HTML');
        return;
    }
    element.innerHTML = text;
}