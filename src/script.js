import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';

import { CharacterController } from './CharacterController'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// --BEIGN: Texture ------------------------------------------------------------------------------
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

// const view = textureLoader.load('/background/bg.jpg')
// const backgroundView = new THREE.Mesh(
//     new THREE.PlaneGeometry(75, 62.5),
//     new THREE.MeshStandardMaterial({
//         map: view
//     })
// )

// backgroundView.position.x = 10
// backgroundView.position.y = 17
// backgroundView.position.z = -30
// scene.add(backgroundView)

// Floor
// const colourTexture = textureLoader.load('/dirt/color.jpg')
// const normalTexture = textureLoader.load('/dirt/normal.jpg')
// const floor = new THREE.Mesh(
//     new THREE.CircleGeometry(25, 100),
//     new THREE.MeshStandardMaterial({
//         map: colourTexture, 
//         normalMap: normalTexture
//     })
// )
// floor.receiveShadow = false
// floor.rotation.x = - Math.PI * 0.5
// floor.position.y = - Math.PI * 1.85
// scene.add(floor)

// --END: Texture ------------------------------------------------------------------------------

// --BEGIN: Lights ------------------------------------------------------------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 3.0)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = false
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// --END: Lights ------------------------------------------------------------------------------


// --BEGIN: Rendering ------------------------------------------------------------------------------
var characterController
var mixer

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.01, 10000)
camera.position.set(0, 105, -101)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 80
controls.maxDistance = 180
controls.enableZoom = true
controls.enableRotate = false
controls.enablePan = false

//must enable panning first
// controls.addEventListener('change', function() {
//   this.target.y = 0
//   camera.position.y = 105
// })

// --BEGIN: Models ------------------------------------------------------------------------------
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('/models/monster.glb', (gltf) => {
  let monster = gltf.scene
  monster = gltf.scene
  monster.position.x = 5
  monster.position.z = -10
  scene.add(monster)

  mixer = new THREE.AnimationMixer(monster)
  mixer.clipAction(gltf.animations[1]).play()

  characterController = new CharacterController(monster, camera, controls)
})

gltfLoader.load('/models/robot.glb', (gltf) => {
  let robot = gltf.scene
  robot.position.x = -5
  robot.position.z = 10
  robot.position.y = -3
  scene.add(robot)
})

gltfLoader.load('/models/robot.glb', (gltf) => {
  let robot = gltf.scene
  robot.position.x = -5
  robot.position.z = 10
  robot.position.y = -3
  scene.add(robot)
})

gltfLoader.load('/models/demon.glb', (gltf) => {
  let demon = gltf.scene
  demon.position.x = -8
  demon.position.z = 5
  demon.position.y = -6
  scene.add(demon)
})

gltfLoader.load('/models/map.glb', (gltf) => {
  let map = gltf.scene
  map.position.x = 0
  map.position.y = -13
  map.position.z = 0
  scene.add(map)
})


// --END: Models ------------------------------------------------------------------------------



// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

var key = {};
var isPressedW = false
var isPressedA = false
var isPressedS = false
var isPressedD = false

window.addEventListener('keydown', (e) => {
  e.preventDefault();
  switch (e.keyCode) {
    case 87: // w
     key[e.keyCode] = true;
     isPressedW = true
      break;
    case 83: // s
      key[e.keyCode] = true;
      isPressedA = true
      break;
    case 65: // a
      key[e.keyCode] = true;
      isPressedS = true
      break;
    case 68: // d
      key[e.keyCode] = true;
      isPressedD = true
      break;
  }
})

document.addEventListener('keyup', (e) => {
  e.preventDefault();
  switch (e.keyCode) {
    case 87: // w
     key[e.keyCode] = false;
     isPressedW = false
      break;
    case 83: // s
      key[e.keyCode] = false;
      isPressedA = false
      break;
    case 65: // a
      key[e.keyCode] = false;
      isPressedS = false
      break;
    case 68: // d
      key[e.keyCode] = false;
      isPressedD = false
      break;
  }
})

const clock = new THREE.Clock();
const tick = () => {

  let deltaTime = clock.getDelta();
  if (characterController && (isPressedW || isPressedA || isPressedS || isPressedD)) {
    characterController.update(deltaTime, key);
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update()

  // Render
  new OutlineEffect(renderer).render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

// --END: Rendering ------------------------------------------------------------------------------