// 导入threejs
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
// 导入动画库
// import gsap from "gsap";
// 导入dat.gui
// import * as dat from "dat.gui";
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 目标：聚光灯

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
);

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, material);
// 投射阴影
sphere.castShadow = true;
scene.add(sphere);

// 创建平面
const planGeometry = new THREE.PlaneGeometry(50, 50);
const plane = new THREE.Mesh(planGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;
scene.add(plane);
// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
// 直线光源
const spotLight = new THREE.SpotLight(0xffffff, 1.0);
spotLight.position.set(10, 10, 10);
spotLight.castShadow = true;
spotLight.intensity = 2; // 设置聚光灯强度

// 设置阴影贴图模糊度
spotLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
spotLight.shadow.mapSize.set(4096, 4096);
// console.log(directionalLight.shadow);
spotLight.target = sphere;
spotLight.angle = Math.PI / 6; // 设置聚光灯的角度
spotLight.distance = 0; // 设置聚光灯的距离
spotLight.penumbra = 0; // 设置聚光灯的边缘
spotLight.decay = 0; // 设置聚光灯的衰减

// 设置透视相机的属性

scene.add(spotLight);
// 创建GUI
const gui = new GUI();
gui.add(sphere.position, "x").min(-5).max(5).step(0.1);
gui
  .add(spotLight, "angle")
  .min(0)
  .max(Math.PI / 2)
  .step(0.1);
gui.add(spotLight, "distance").min(0).max(10).step(0.01);
gui.add(spotLight, "penumbra").min(0).max(1).step(0.01);
gui.add(spotLight, "decay").min(0).max(5).step(0.01);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

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
