/** webgl中的3D 24个点画一个立方体 */

import initShaders from './initShaders.js';


const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

// 顶点着色器
const vsSource = `
  attribute vec4 aPosition;
  attribute vec4 aColor;
  uniform mat4 uModelMatrix;    // 模型矩阵
  uniform mat4 uViewMatrix;     // 视图矩阵
  uniform mat4 uProjectionMatrix; // 投影矩阵
  varying vec4 vColor;
  
  void main() {
    // MVP变换的应用顺序
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
    vColor = aColor;
  }
`;

// 片元着色器
const fsSource = `
  precision mediump float;
  varying vec4 vColor;
  
  void main() {
    gl_FragColor = vColor;
  }
`;

// 初始化着色器
const program = initShaders(gl, vsSource, fsSource);
gl.useProgram(program);

// 创建立方体顶点
const vertices = new Float32Array([
  // 前面 (z = -0.5)
  -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  // 后面 (z = 0.5)
  -0.5, -0.5, 0.5,   0.5, -0.5, 0.5,   0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,
  // 顶面 (y = 0.5)
  -0.5, 0.5, -0.5,   0.5, 0.5, -0.5,   0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,
  // 底面 (y = -0.5)
  -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
  // 右面 (x = 0.5)
  0.5, -0.5, -0.5,   0.5, 0.5, -0.5,   0.5, 0.5, 0.5,  0.5, -0.5, 0.5,
  // 左面 (x = -0.5)
  -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,  -0.5, 0.5, 0.5, -0.5, -0.5, 0.5
]);

// 创建颜色数据
const colors = new Float32Array([
  // 前面 - 红色
  1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
  // 后面 - 绿色
  0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0,
  // 顶面 - 蓝色
  0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0,
  // 底面 - 黄色
  1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0,
  // 右面 - 紫色
  1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
  // 左面 - 青色
  0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0
]);

// 顶点索引
const indices = new Uint8Array([
  0, 1, 2,   0, 2, 3,    // 前面
  4, 5, 6,   4, 6, 7,    // 后面
  8, 9, 10,  8, 10, 11,  // 顶面
  12, 13, 14, 12, 14, 15, // 底面
  16, 17, 18, 16, 18, 19, // 右面
  20, 21, 22, 20, 22, 23  // 左面
]);

// 将顶点坐标写入缓冲区
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
const aPosition = gl.getAttribLocation(program, 'aPosition');
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

// 将颜色数据写入缓冲区
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
const aColor = gl.getAttribLocation(program, 'aColor');
gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aColor);

// 将顶点索引写入缓冲区
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// 获取uniform变量位置
const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');

// 开启深度测试
gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.0, 0.0, 0.0, 1.0);


function createRotationMatrixY(angle) {
  // 计算旋转角度的三角函数值
  const c = Math.cos(angle);  // 余弦值
  const s = Math.sin(angle);  // 正弦值
  // 创建绕Y轴旋转的矩阵
  return new Float32Array([
    c, 0, s, 0,   // 第一行: [cos(θ), 0, sin(θ), 0]
    0, 1, 0, 0,   // 第二行: [0, 1, 0, 0] - Y轴保持不变
    -s, 0, c, 0,  // 第三行: [-sin(θ), 0, cos(θ), 0]
    0, 0, 0, 1    // 第四行: [0, 0, 0, 1]
  ]);
}

function createRotationMatrixX(angle) {
  // 计算旋转角度的三角函数值
  const c = Math.cos(angle);  // 余弦值
  const s = Math.sin(angle);  // 正弦值
  // 创建绕X轴旋转的矩阵
  return new Float32Array([
    1, 0, 0, 0,    // 第一行: [1, 0, 0, 0] - X轴保持不变
    0, c, -s, 0,   // 第二行: [0, cos(θ), -sin(θ), 0]
    0, s, c, 0,    // 第三行: [0, sin(θ), cos(θ), 0]
    0, 0, 0, 1     // 第四行: [0, 0, 0, 1]
  ]);
}

function createTranslationMatrix(tx, ty, tz) {
  // 创建平移变换矩阵
  return new Float32Array([
    1, 0, 0, 0,    // 第一行: [1, 0, 0, 0]
    0, 1, 0, 0,    // 第二行: [0, 1, 0, 0]
    0, 0, 1, 0,    // 第三行: [0, 0, 1, 0]
    tx, ty, tz, 1  // 第四行: [tx, ty, tz, 1] - 平移分量
  ]);
}

function createPerspectiveMatrix(fov, aspect, near, far) {
  // 计算视场角的一半的tan值的倒数
  const f = 1.0 / Math.tan(fov / 2);  // 焦距系数
  // 创建透视投影矩阵
  return new Float32Array([
    f / aspect, 0, 0, 0,                        // 第一行: [f/aspect, 0, 0, 0] - X轴缩放
    0, f, 0, 0,                                // 第二行: [0, f, 0, 0] - Y轴缩放
    0, 0, (far + near) / (near - far), -1,     // 第三行: [0, 0, (far+near)/(near-far), -1] - Z变换和透视除法标志
    0, 0, (2 * far * near) / (near - far), 0  // 第四行: [0, 0, 2*far*near/(near-far), 0] - 深度信息
  ]);
}

function multiplyMatrices(a, b) {
  // 创建结果矩阵
  const result = new Float32Array(16);  // 创建4x4矩阵的空间
  
  // 执行矩阵乘法 result = a * b
  for (let i = 0; i < 4; i++) {         // 遍历结果矩阵的行
    for (let j = 0; j < 4; j++) {       // 遍历结果矩阵的列
      let sum = 0;                      // 初始化当前元素的累加值
      for (let k = 0; k < 4; k++) {     // 计算点积
        sum += a[i*4+k] * b[k*4+j];    // a的第i行和b的第j列的点积
      }
      result[i*4+j] = sum;             // 将计算结果存入结果矩阵
    }
  }
  
  return result;  // 返回相乘后的矩阵
}

// 动画和控制相关变量
let rotationAngle = 0;
let modelPosition = [0, 0, 0];
let cameraPosition = [0, 0, -5];
let fov = Math.PI/4; // 45度视角

// 键盘控制状态
const keys = {};

// 添加键盘事件监听
window.addEventListener('keydown', (event) => {
  keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
  keys[event.key] = false;
});

// 处理键盘输入
function handleKeyboardInput() {
  // 模型控制 - WASD控制模型位置
  if (keys['a']) modelPosition[0] -= 0.05; // 左移
  if (keys['d']) modelPosition[0] += 0.05; // 右移
  if (keys['w']) modelPosition[1] += 0.05; // 上移
  if (keys['s']) modelPosition[1] -= 0.05; // 下移
  if (keys['q']) rotationAngle += 0.05;    // 顺时针旋转
  if (keys['e']) rotationAngle -= 0.05;    // 逆时针旋转
  
  // 相机控制 - 方向键控制相机位置
  if (keys['ArrowLeft']) cameraPosition[0] += 0.05;  // 相机左移
  if (keys['ArrowRight']) cameraPosition[0] -= 0.05; // 相机右移
  if (keys['ArrowUp']) cameraPosition[1] -= 0.05;    // 相机上移
  if (keys['ArrowDown']) cameraPosition[1] += 0.05;  // 相机下移
  
  // 视距控制 - Z和X控制相机前后移动
  if (keys['z'] && cameraPosition[2] < -2) cameraPosition[2] += 0.1; // 拉近
  if (keys['x']) cameraPosition[2] -= 0.1;                           // 推远
  
  // 视场角控制 - C和V控制FOV
  if (keys['c'] && fov > 0.1) fov -= 0.01;  // 减小FOV (放大)
  if (keys['v'] && fov < Math.PI/2) fov += 0.01; // 增大FOV (缩小)
}

// 创建平移和旋转组合的模型矩阵
function createModelMatrix(position, rotationAngle) {
  // 先创建旋转矩阵
  const rotationMatrix = multiplyMatrices(
    createRotationMatrixY(rotationAngle),
    createRotationMatrixX(rotationAngle * 0.7)
  );
  
  // 再创建平移矩阵
  const translationMatrix = createTranslationMatrix(
    position[0], position[1], position[2]
  );
  
  // 组合变换（先旋转后平移）
  return multiplyMatrices(translationMatrix, rotationMatrix);
}

// 渲染函数
function render() {
  // 处理键盘输入
  handleKeyboardInput();
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // 1. 模型矩阵 - 组合旋转和平移
  const modelMatrix = createModelMatrix(modelPosition, rotationAngle);
  
  // 2. 视图矩阵 - 相机位置可控
  const viewMatrix = createTranslationMatrix(
    cameraPosition[0], cameraPosition[1], cameraPosition[2]
  );
  
  // 3. 投影矩阵 - 可变FOV
  const aspect = canvas.width / canvas.height;
  const projectionMatrix = createPerspectiveMatrix(fov, aspect, 1, 100);
  
  // 传递MVP矩阵给着色器
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);
  gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
  gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
  
  // 绘制立方体
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
  
  requestAnimationFrame(render);
}

// 显示控制说明
function displayControls() {
  const controlsInfo = document.createElement('div');
  controlsInfo.style.position = 'absolute';
  controlsInfo.style.top = '10px';
  controlsInfo.style.left = '10px';
  controlsInfo.style.color = 'white';
  controlsInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  controlsInfo.style.padding = '10px';
  controlsInfo.style.fontFamily = 'Arial, sans-serif';
  controlsInfo.style.fontSize = '14px';
  controlsInfo.innerHTML = `
    <h3>键盘控制说明:</h3>
    <p><b>模型控制:</b> WASD - 移动模型 | Q/E - 旋转模型</p>
    <p><b>相机控制:</b> 方向键 - 移动视角 | Z/X - 拉近/推远</p>
    <p><b>透视控制:</b> C/V - 增大/减小视场角</p>
  `;
  document.body.appendChild(controlsInfo);
}

// 显示控制说明并开始渲染
displayControls();
render();


