/**
 * 初始化着色器程序
 * 
 * @param {*} gl 
 * @param {*} vertexShaderSource 
 * @param {*} fragmentShaderSource 
 * @returns
*/
export default function initShaders(gl, vertexShaderSource, fragmentShaderSource) {
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource); // 创建顶点着色器对象
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource); // 创建片元着色器对象

    let program = createProgram(gl, vertexShader, fragmentShader); // 创建着色器程序对象
    if (!program) {
        console.error('无法初始化着色器程序: ' + gl.getProgramInfoLog(program));
        return null;
    }
    gl.useProgram(program); // 使用着色器程序
    gl.program = program; // 将程序对象存储在gl对象中
    return program; // 返回程序对象
}

/**
 * 创建着色器
 * @param {WebGLRenderingContext} gl WebGL上下文
 * @param {number} type 着色器类型
 * @param {string} source 着色器源码
 * @return {WebGLShader} 着色器对象
 */
function createShader(gl, type, source) {
    // 创建着色器对象
    const shader = gl.createShader(type);

    // 设置着色器源码
    gl.shaderSource(shader, source);

    // 编译着色器
    gl.compileShader(shader);

    // 检查编译状态
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('编译着色器出错: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}


/**
 * 创建着色器程序
 * @param {*} gl
 * @param {*} vertexShader
 * @param {*} fragmentShader
 * @returns
 */
function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram(); // 创建着色器程序对象
    gl.attachShader(program, vertexShader); // 将顶点着色器附加到程序对象
    gl.attachShader(program, fragmentShader); // 将片元着色器附加到程序对象
    gl.linkProgram(program); // 链接着色器程序
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log('Program linked successfully');
    } else {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

