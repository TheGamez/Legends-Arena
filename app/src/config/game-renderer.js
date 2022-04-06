/* MODULES */

import * as THREE from 'three';
import Experience from './Experience.js'

/* GAME RENDERER */

const initializeGameRenderer = () => {
  const canvas = document.querySelector('#webgl-canvas')
  const scene = new THREE.Scene()
  const experience = new Experience(canvas, scene)

  // load model like this
  experience.controller.loadModel(
    './models/monster.glb', 
    new THREE.Vector3(0, 0, 0), 
    0.5
  )

  // Update Frames
  const clock = new THREE.Clock();
  const tick = () => {
    let deltaTime = clock.getDelta();

    experience.update()
    
    experience.controller.playerControls(experience.camera.controls, deltaTime)
    experience.emitter.trigger('tick')

    window.requestAnimationFrame(tick)
  }

  tick()

  // --BEGIN: Models ------------------------------------------------------------------------------
  // const dracoLoader = new DRACOLoader()
  // dracoLoader.setDecoderPath('./draco/');

  // const gltfLoader = new GLTFLoader()
  // gltfLoader.setDRACOLoader(dracoLoader)

  // gltfLoader.load('./models/monster.glb', (gltf) => {
  //   let monster = gltf.scene
  //   monster = gltf.scene
  //   monster.position.x = 5
  //   monster.position.z = -10
  //   scene.add(monster)

  //   mixer = new THREE.AnimationMixer(monster)
  //   mixer.clipAction(gltf.animations[1]).play()
    
  //   attackMixer = new THREE.AnimationMixer(monster)
  //   attackMixer.clipAction(gltf.animations[0]).play()
  //   attackTimer = gltf.animations[0].duration

  //   collisionBoxMonster.setFromObject(monster);
  //   scene.add( new THREE.Box3Helper(collisionBoxMonster, 0xff0000));

  //   monsterController = new CharacterController(monster, camera, controls, collisionBoxMonster)
  // })

  // gltfLoader.load('./models/robot.glb', (gltf) => {
  //   let robot = gltf.scene
  //   robot.position.x = -5
  //   robot.position.z = 10
  //   robot.position.y = -3
  //   scene.add(robot)

  //   collisionBoxRobot.setFromObject(robot);
  //   scene.add( new THREE.Box3Helper(collisionBoxRobot, 0xff0000));
  
  //   robotController = new CharacterController(robot, camera, controls, collisionBoxRobot)
  // })

  // gltfLoader.load('./models/demon.glb', (gltf) => {
  //   let demon = gltf.scene
  //   demon.position.x = -8
  //   demon.position.z = 5
  //   demon.position.y = -6
  //   scene.add(demon)
  // })

  // gltfLoader.load('./models/map.glb', (gltf) => {
  //   let map = gltf.scene
  //   map.position.x = 0
  //   map.position.y = -13
  //   map.position.z = 0
  //   scene.add(map)
  // })



  // var attack = false
  // document.addEventListener('mousedown', (e) => {
  //   switch (e.button) {
  //     case 0:
  //       attack = true
  //       break;
  //   }
  // })

  // document.addEventListener('mouseup', (e) => {
  //   switch (e.button) {
  //     case 0:
  //       attack = false
  //       break;
  //   }
  // })

  // const clock = new THREE.Clock();
  // const tick = () => {

  //   if (monsterController && attack) {
  //     attackMixer.update(deltaTime)
  //     console.log('attack')
      
  //     if (monsterController && monsterController.isIntersecting(collisionBoxRobot)) {
  //       console.log('hit')
  //     }
  //   }
  // }
  // tick()

  // --END: Rendering ------------------------------------------------------------------------------
}

export {
  initializeGameRenderer,
};
