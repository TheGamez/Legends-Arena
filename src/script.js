import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';

import * as CANNON from 'cannon-es'

// CommonJS
const { threeToCannon, ShapeType } = require('three-to-cannon');
import { CharacterController } from './CharacterController'
import { CollisionBodies } from './CollisionBodies'
import { COLLISION_TYPES } from 'cannon-es'

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
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.01, 10000)
camera.position.set(0, 105, -101)
camera.rotation.set(-2.3, 0.32, 2.8)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 80
controls.maxDistance = 180
controls.enableZoom = true
controls.enableRotate = false
controls.enablePan = true

// --BEGIN: Models ------------------------------------------------------------------------------
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


var characterController
var characterPhysicsBody
var mixer
var monster
var monsterBody

gltfLoader.load('/models/monster.glb', (gltf) => {
  monster = gltf.scene
  monster.position.y = 30
  monster.position.x = 10
  monster.position.z = -30
  scene.add(monster)

  // console.log("is monster scene an object 3D", monster.isObject3D)
  // console.log("is monster scene an object 3D", monsterAsset.isObject3D)
  // console.log('is monster body a cannon object ?', monsterBody)
  
  // let monsterShape = threeToCannon(monster, {type: ShapeType.BOX});
  // console.log("monster sahpe", monsterShape)
  // monsterBody = new CANNON.Body({mass: 5})
  // monsterBody.addShape(monsterShape)
  
// BEGIN --- Physics -----> characterPhysicsBody = new CollisionBodies(monster)

  const monsterShape = new CANNON.Box(new CANNON.Vec3(9.7,8.5 ,6.1))
  monsterBody = new CANNON.Body({mass: 10})
  monsterBody.addShape(monsterShape)

  monsterBody.position.x = monster.position.x
  monsterBody.position.y = monster.position.y
  monsterBody.position.z = monster.position.z
  world.addBody(monsterBody)

  function animateMonster() {
    requestAnimationFrame(animateMonster)
  
    //Animation Physics For Monster Model
      monster.position.set(
      monsterBody.position.x,
      monsterBody.position.y,
      monsterBody.position.z
  )}

  renderer.setAnimationLoop(animateMonster)

 // END --- Physics -----

  mixer = new THREE.AnimationMixer(monster)
  mixer.clipAction(gltf.animations[1]).play()

  characterController = new CharacterController(monster, camera, controls)
 // characterPhysicsBody = new CollisionBodies(monster)
})

gltfLoader.load('/models/robot.glb', (gltf) => {
  let robot = gltf.scene
  // // Adding body to 3d model
  // const robot_body = threeToCannon(robot, {type: ShapeType.BOX});
  robot.position.x = 5
  robot.position.z = 10
  robot.position.y = 30
  scene.add(robot)
  
 // BEGIN --- Physics -----> characterPhysicsBody = new CollisionBodies(robot)

  const robotShape = new CANNON.Box(new CANNON.Vec3(10,3 ,2))
  const robotBody = new CANNON.Body({mass: 10})
  robotBody.addShape(robotShape)

  robotBody.position.x = robot.position.x
  robotBody.position.y = robot.position.y
  robotBody.position.z = robot.position.z
  world.addBody(robotBody)

  function animateRobot() {
    requestAnimationFrame(animateRobot)
  
    //Animation Physics For robot Model
      robot.position.set(
      robotBody.position.x,
      robotBody.position.y,
      robotBody.position.z
  )}

  renderer.setAnimationLoop(animateRobot)

  // END --- Physics -----

})

gltfLoader.load('/models/demon.glb', (gltf) => {
  let demon = gltf.scene
  demon.position.x = 8
  demon.position.z = 5
  demon.position.y = 6
  scene.add(demon)

  // BEGIN --- Physics -----> characterPhysicsBody = new CollisionBodies(demon)

  const demonShape = new CANNON.Box(new CANNON.Vec3(9.2,8.73 ,2.9))
  const demonBody = new CANNON.Body({mass: 10})
  demonBody.addShape(demonShape)

  demonBody.position.x = demon.position.x
  demonBody.position.y = demon.position.y
  demonBody.position.z = demon.position.z
  world.addBody(demonBody)

  function animateDemon() {
    requestAnimationFrame(animateDemon)
  
    //Animation Physics For demon Model
      demon.position.set(
      demonBody.position.x,
      demonBody.position.y,
      demonBody.position.z
  )}

  renderer.setAnimationLoop(animateDemon)

  // END --- Physics -----

})

gltfLoader.load('/models/map.glb', (gltf) => {
  let map = gltf.scene
  map.position.x = 0
  map.position.y = -13
  map.position.z = 0
  //scene.add(map) 

  const planeGeometry = new THREE.PlaneGeometry(100, 100)
  const planeMesh = new THREE.Mesh(planeGeometry)
  planeMesh.wireframe =  true
  planeMesh.rotateX(-Math.PI / 2)
  planeMesh.receiveShadow = true

  planeMesh.position.x = -10
  planeMesh.position.y = -13
  planeMesh.position.z = 0
  scene.add(planeMesh)

  
  // BEGIN --- Physics -----> characterPhysicsBody = new CollisionBodies(map)
  
  const planeShape = new CANNON.Plane()
  const planeBody = new CANNON.Body({ mass: 0 })
  planeBody.addShape(planeShape)
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.addBody(planeBody)

  function animateMap() {
    requestAnimationFrame(animateMap)
  
    //Animation Physics For demon Model
      planeMesh.position.set(
      planeBody.position.x,
      planeBody.position.y,
      planeBody.position.z
  )}

  renderer.setAnimationLoop(animateMap)
  
  // END --- Physics -----

})


// --END: Models ------------------------------------------------------------------------------

// --BEGIN: Physics World------------------------------------------------------------------------------

// Create World with gravity of the earth 
// (negative number, so that objects are attracted towards the bottom)
const world = new CANNON.World()
world.gravity.set(0, -9.81, 0)

// --END: Physics  World------------------------------------------------------------------------------

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
var isPressed = false
window.addEventListener('keydown', (e) => {
  e.preventDefault();
  switch (e.keyCode) {
    case 87: // w
     key[e.keyCode] = true;
     isPressed = true
      break;
    case 83: // s
      key[e.keyCode] = true;
      isPressed = true
      break;
    case 65: // a
      key[e.keyCode] = true;
      isPressed = true
      break;
    case 68: // d
      key[e.keyCode] = true;
      isPressed = true
      break;
  }
})

document.addEventListener('keyup', (e) => {
  e.preventDefault();
  key[e.keyCode] = false;
  isPressed = false
})

const clock = new THREE.Clock();
const tick = () => {

  let deltaTime = clock.getDelta();
  if (characterController && isPressed) {
    characterController.update(deltaTime, key);
    mixer.update(deltaTime);
  }

  world.fixedStep() // default: 1 / 60 meaning 60fps
  // characterPhysicsBody.animate()
  // characterPhysicsBody.setWorldChange(deltaTime)


  // Update controls
  controls.update()

  // Render
  //new OutlineEffect(renderer).render(scene, camera)
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

// --END: Rendering ------------------------------------------------------------------------------