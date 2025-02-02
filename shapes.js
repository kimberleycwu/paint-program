// POINT CLASS
// NEW implementation
class Point {
    constructor(x, y, color = [1.0, 1.0, 1.0, 1.0], size = 5.0) {
        this.type = 'point';
        this.position = [x, y];
        this.color = color; // Color passed in constructor
        this.size = size;
        // Buffer for storing point vertex data
        this.vertexBuffer = gl.createBuffer();
        this.updateVertexBuffer();
    }
    updateVertexBuffer() {
        const xy = this.position;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([xy[0], xy[1]]), gl.DYNAMIC_DRAW);
    }
    render() {
        const rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, this.size);
        // Bind the buffer once
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

// TRIANGLE CLASS
// NEW implementation
class Triangle {
    constructor(x, y, color = [1.0, 1.0, 1.0, 1.0], size = 5.0) {
        this.type = 'triangle';
        this.position = [x, y];
        this.color = color; // Color passed in constructor
        this.size = size;
        
        // Buffer for triangle vertex data
        this.vertexBuffer = gl.createBuffer();
        this.updateVertexBuffer();
    }
    updateVertexBuffer() {
        const xy = this.position;
        const d = this.size / 200.0; // delta
        const vertices = [
            xy[0], xy[1], 
            xy[0] + d, xy[1], 
            xy[0], xy[1] + d
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    }
    render() {
        const rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, this.size);
        // Bind the buffer once
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

function drawTriangle(vertices) {
    var n = vertices.length / 2;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

// CIRCLE CLASS
// NEW implementation
class Circle {
    constructor(x, y, color = [1.0, 1.0, 1.0, 1.0], size = 5.0, segments = 10) {
        this.type = 'circle';
        this.position = [x, y];
        this.color = color; // Color passed in constructor
        this.size = size;
        this.segments = segments;
        // Buffer for circle vertex data
        this.vertexBuffer = gl.createBuffer();
        this.updateVertexBuffer();
    }
    updateVertexBuffer() {
        const xy = this.position;
        const d = this.size / 200.0;
        const angleStep = 360 / this.segments;
        const vertices = [];
        for (let angle = 0; angle < 360; angle += angleStep) {
            const angle1 = angle * Math.PI / 180;
            const angle2 = (angle + angleStep) * Math.PI / 180;
            const pt1 = [xy[0] + Math.cos(angle1) * d, xy[1] + Math.sin(angle1) * d];
            const pt2 = [xy[0] + Math.cos(angle2) * d, xy[1] + Math.sin(angle2) * d];
            vertices.push(xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    }
    render() {
        const rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, this.size);
        // Bind the buffer once
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        const n = this.segments * 3; // 3 vertices per segment
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }
}
