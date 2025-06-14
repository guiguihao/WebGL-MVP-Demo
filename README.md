![WebGL MVP矩阵控制演示](jp.png)

在线预览：https://guiguihao.github.io/WebGL-MVP-Demo/

# MVP矩阵键盘控制说明

本示例展示了如何通过键盘控制WebGL中的MVP（Model-View-Projection）矩阵，实现交互式3D场景控制。

## 控制方式

### 模型矩阵(M)控制

模型矩阵定义了物体在世界空间中的位置、旋转和缩放。

| 按键 | 功能 |
|------|------|
| W | 模型上移 |
| S | 模型下移 |
| A | 模型左移 |
| D | 模型右移 |
| Q | 模型顺时针旋转 |
| E | 模型逆时针旋转 |

### 视图矩阵(V)控制

视图矩阵定义了相机在世界空间中的位置和朝向。

| 按键 | 功能 |
|------|------|
| 方向键↑ | 相机上移（场景下移） |
| 方向键↓ | 相机下移（场景上移） |
| 方向键← | 相机左移（场景右移） |
| 方向键→ | 相机右移（场景左移） |
| Z | 相机向前移动（拉近） |
| X | 相机向后移动（推远） |

### 投影矩阵(P)控制

投影矩阵定义了如何将3D场景投影到2D屏幕上。

| 按键 | 功能 |
|------|------|
| C | 减小视场角(FOV)，产生望远效果 |
| V | 增大视场角(FOV)，产生广角效果 |

## 技术实现

1. **模型变换**：
   - 组合了旋转和平移变换
   - 先应用旋转，再应用平移

2. **视图变换**：
   - 通过移动相机位置实现场景观察角度的改变
   - 实质上是将世界坐标系中的点变换到相机坐标系中

3. **投影变换**：
   - 使用透视投影，产生近大远小的效果
   - 通过改变FOV（视场角）控制透视效果的强弱

## 矩阵变换顺序

在着色器中，顶点坐标的变换顺序为：

```
gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
```

这个顺序确保了：
- 先将顶点从局部坐标系变换到世界坐标系
- 再从世界坐标系变换到相机坐标系
- 最后从相机坐标系变换到裁剪空间
