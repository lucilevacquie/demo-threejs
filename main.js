import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Scene = container
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//OBJECTS
//Cube
const geometry = new THREE.TorusGeometry(15, 1, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
//this is the object = geometry(shape) + material(skin)
const cube = new THREE.Mesh(geometry, material);
//add the object to the scene
scene.add(cube);

//Stars - add some randomly positioned stars
function addStar() {
  //create the star object
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  //positioned randomly the star
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

//how mane star do we want and apply addStar method to each of them
Array(200).fill().forEach(addStar);

//Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
  })
)
scene.add(moon);


//LIGHTS
//create a point light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(50, 50, 50);
//create an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff);
//add the lights to the scene
scene.add(pointLight, ambientLight);


//HELPERS
//shows the position of the pointLight
const lightHelper = new THREE.PointLightHelper(pointLight);
//shows a 2D grid that represent the scene
const gridHelper = new THREE.GridHelper(200, 50);
//add the helpers to the scene
scene.add(lightHelper, gridHelper);

//add the mouse controls to move around the camera
const controls = new OrbitControls(camera, renderer.domElement);


//BACKGROUND TEXTURE
//add a sky texture
const skyTexture = new THREE.TextureLoader().load('night.jpg');
scene.background = skyTexture;



//CAMERA JOURNEY WHEN SCROLLING
function moveCamera() {
  //get the scrolling position from the top of the page
  const t = document.body.getBoundingClientRect().top;
  //moon's journey
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.005;
  //camera's journey
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
//set the scrolling to the created journey
document.body.onscroll = moveCamera;



//RENDER
//always at the end - infinite loop that render the whole scene
function animate() {
  requestAnimationFrame(animate);

  //add animation here
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.005;
  cube.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
