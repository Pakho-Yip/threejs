// 导入threejs
import * as THREE from "three";
import { DoubleSide } from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 导入顶点法向量辅助器
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";
// 导入gltf加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.01, // 近平面
  1000 // 远平面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加轨道控制器
// const controls = new OrbitControls(camera, document.body);
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置旋转速度
// controls.autoRotate = true;

// 渲染函数
function animation() {
  controls.update();
  requestAnimationFrame(animation);
  // 旋转
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  // 渲染
  renderer.render(scene, camera);
}
animation();

// 监听窗口变化
window.addEventListener("resize", () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 重置相机宽高比
  renderer.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
});

let eventObj = {
  fullScreen: function () {
    document.body.requestFullscreen();
    console.log("全屏");
  },
  exitFullScreen: function () {
    document.exitFullscreen();
    console.log("退出全屏");
  },
};

// 创建GUI
const gui = new GUI();
// 添加按钮
gui.add(eventObj, "fullScreen").name("全屏");
gui.add(eventObj, "exitFullScreen").name("退出全屏");
// 控制立方体的位置
// gui.add(cube.position, "x", -5, 5).name("立方体x轴位置");

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  // 设置环境贴图
  scene.background = envMap;
  // 设置环境贴图
  scene.environment = envMap;
  // 设置plane的环境贴图
  // planeMaterial.envMap = envMap;
  // 设置plane的环境贴图
  // material.envMap = envMap;
});

// 实例化加载器gltf
const gltfLoader = new GLTFLoader();
// 加载模型
gltfLoader.load(
  // 模型路径
  "./model/Duck.glb",
  // 加载完成回调
  (gltf) => {
    console.log(gltf);
    scene.add(gltf.scene);

    let duckMesh = gltf.scene.getObjectByName("LOD3spShape");
    let duckGeometry = duckMesh.geometry;
    // 计算包围盒
    duckGeometry.computeBoundingBox();
    // 获取duck包围盒
    let duckBox = duckGeometry.boundingBox;
    // 更新世界矩阵
    duckMesh.updateWorldMatrix(true, true);
    // 更新包围盒
    duckBox.applyMatrix4(duckMesh.matrixWorld);
    // 创建包围盒辅助器
    let boxHelper = new THREE.Box3Helper(duckBox, 0xffff00);
    // 添加包围盒辅助器
    scene.add(boxHelper);
    console.log(duckBox);
    console.log(duckMesh);
  }
);
