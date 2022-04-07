/* MODULES */

import * as THREE from 'three';
import GLOBAL_STATE from '../global.js';
import Experience from './Experience.js'
import PlayerController from './System/PlayerController.js'

/* GAME RENDERER */

const initializeGameRenderer = (roomPlayers) => {
  const canvas = document.querySelector('#webgl-canvas')
  const scene = new THREE.Scene()
  const experience = new Experience(canvas, scene);



  // Testing -- BEGIN (can delete before release)
  const geometry = new THREE.BoxGeometry(5, 5, 5)
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0, 10, -10)
  scene.add(mesh)

  var gridHelper = new THREE.GridHelper(100, 50)
  scene.add( gridHelper )
  scene.add(new THREE.AxesHelper())
  // Testing -- END



  // load model like this
  roomPlayers.forEach((roomPlayer, index) => {
    // const previousModelObject = scene.getObjectByName(roomPlayer.name);

    // if (previousModelObject) scene.remove(previousModelObject);

    const modelObjectName = roomPlayer.name;
    let characterOpacity = 1;
    const characterVector3 = { x: roomPlayer.roomGameState.x*(index+1), y: roomPlayer.roomGameState.y, z: roomPlayer.roomGameState.z*(index+1) };
    const characterId = roomPlayer.characterId;

    let characterModelPath = '';
    if (characterId === 1) {
      characterModelPath = './models/monster.glb';
    } else if (characterId === 2) {
      characterModelPath = './models/demon.glb';
    } else if (characterId === 3) {
      characterModelPath = './models/robot.glb';
    }

    // if (GLOBAL_STATE.socket.id === roomPlayer.socketId) characterOpacity = 0;

    // if (GLOBAL_STATE.socket.id === roomPlayer.socketId) {
      experience.controller.loadModel(
        characterModelPath, 
        new THREE.Vector3(characterVector3.x, characterVector3.y, characterVector3.z), 
        characterOpacity,
        modelObjectName,
      );
    // }

    // experience.controller.moveForward = roomPlayer.roomGameState.movement.moveForward;
    // experience.controller.moveBackward = roomPlayer.roomGameState.movement.moveBackward;
    // experience.controller.moveLeft = roomPlayer.roomGameState.movement.moveLeft;
    // experience.controller.moveRight = roomPlayer.roomGameState.movement.moveRight;

    // if (GLOBAL_STATE.socket.id !== roomPlayer.socketId) experience.controller = undefined;
  });

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


























// let scene, canvas, experience;

// /* 
//   PROBLEMS:
//   - robot and demon do not cause memory crash
//   - monster causes memory crash
//   - why are there 2 models being spawned instead of 1
//   - ghosting?
//   - need to adjust controls

// */

// const animateGame = (roomPlayers) => {
//   // load model like this
//   roomPlayers.forEach((roomPlayer, index) => {
//     const previousModelObject = scene.getObjectByName(roomPlayer.name);

//     if (previousModelObject) {
//       console.log(previousModelObject.name);
//       scene.remove(previousModelObject);
//     }

//     const modelObjectName = roomPlayer.name;
//     const characterOpacity = 1;
//     const characterVector3 = { x: roomPlayer.roomGameState.x*(index+2), y: roomPlayer.roomGameState.y, z: roomPlayer.roomGameState.z*(index+2) };
//     const characterId = roomPlayer.characterId;

//     let characterModelPath = '';
//     if (characterId === 1) characterModelPath = './models/monster.glb';
//     else if (characterId === 2) characterModelPath = './models/demon.glb';
//     else if (characterId === 3) characterModelPath = './models/robot.glb';

//     experience.controller.loadModel(
//       characterModelPath, 
//       new THREE.Vector3(characterVector3.x, characterVector3.y, characterVector3.z), 
//       characterOpacity,
//       modelObjectName,
//     );
//   });

//   // Update Frames
//   const clock = new THREE.Clock();
//   const tick = () => {
//     let deltaTime = clock.getDelta();

//     experience.update()
    
//     experience.controller.playerControls(experience.camera.controls, deltaTime)
//     experience.emitter.trigger('tick')

//     // window.requestAnimationFrame(tick)
//   }

//   tick()
// }

// const initializeGameRenderer = () => {
//   canvas = document.querySelector('#webgl-canvas')
//   scene = new THREE.Scene()
//   experience = new Experience(canvas, scene)
// }

// export {
//   initializeGameRenderer,
//   animateGame,
// };






// const initializeGameRenderer = (roomPlayers) => {
//   const canvas = document.querySelector('#webgl-canvas')
//   const scene = new THREE.Scene()
//   const experience = new Experience(canvas, scene)

//   // load model like this
//   roomPlayers.forEach((roomPlayer, index) => {
//     const previousModelObject = scene.getObjectByName(roomPlayer.name);

//     if (previousModelObject) {
//       console.log(previousModelObject.name);
//       scene.remove(previousModelObject);
//     }

//     const modelObjectName = roomPlayer.name;
//     const characterOpacity = 1;
//     const characterVector3 = { x: roomPlayer.roomGameState.x, y: roomPlayer.roomGameState.y, z: roomPlayer.roomGameState.z };
//     const characterId = roomPlayer.characterId;

//     let characterModelPath = '';
//     if (characterId === 1) characterModelPath = './models/monster.glb';
//     else if (characterId === 2) characterModelPath = './models/demon.glb';
//     else if (characterId === 3) characterModelPath = './models/robot.glb';

//     experience.controller.loadModel(
//       characterModelPath, 
//       new THREE.Vector3(characterVector3.x, characterVector3.y, characterVector3.z), 
//       characterOpacity,
//       modelObjectName,
//     );
//   });

//   // Update Frames
//   const clock = new THREE.Clock();
//   const tick = () => {
//     let deltaTime = clock.getDelta();

//     experience.update()
    
//     experience.controller.playerControls(experience.camera.controls, deltaTime)
//     experience.emitter.trigger('tick')

//     window.requestAnimationFrame(tick)
//   }

//   tick()

//   // --BEGIN: Models ------------------------------------------------------------------------------
//   // const dracoLoader = new DRACOLoader()
//   // dracoLoader.setDecoderPath('./draco/');

//   // const gltfLoader = new GLTFLoader()
//   // gltfLoader.setDRACOLoader(dracoLoader)

//   // gltfLoader.load('./models/monster.glb', (gltf) => {
//   //   let monster = gltf.scene
//   //   monster = gltf.scene
//   //   monster.position.x = 5
//   //   monster.position.z = -10
//   //   scene.add(monster)

//   //   mixer = new THREE.AnimationMixer(monster)
//   //   mixer.clipAction(gltf.animations[1]).play()
    
//   //   attackMixer = new THREE.AnimationMixer(monster)
//   //   attackMixer.clipAction(gltf.animations[0]).play()
//   //   attackTimer = gltf.animations[0].duration

//   //   collisionBoxMonster.setFromObject(monster);
//   //   scene.add( new THREE.Box3Helper(collisionBoxMonster, 0xff0000));

//   //   monsterController = new CharacterController(monster, camera, controls, collisionBoxMonster)
//   // })

//   // gltfLoader.load('./models/robot.glb', (gltf) => {
//   //   let robot = gltf.scene
//   //   robot.position.x = -5
//   //   robot.position.z = 10
//   //   robot.position.y = -3
//   //   scene.add(robot)

//   //   collisionBoxRobot.setFromObject(robot);
//   //   scene.add( new THREE.Box3Helper(collisionBoxRobot, 0xff0000));
  
//   //   robotController = new CharacterController(robot, camera, controls, collisionBoxRobot)
//   // })

//   // gltfLoader.load('./models/demon.glb', (gltf) => {
//   //   let demon = gltf.scene
//   //   demon.position.x = -8
//   //   demon.position.z = 5
//   //   demon.position.y = -6
//   //   scene.add(demon)
//   // })

//   // gltfLoader.load('./models/map.glb', (gltf) => {
//   //   let map = gltf.scene
//   //   map.position.x = 0
//   //   map.position.y = -13
//   //   map.position.z = 0
//   //   scene.add(map)
//   // })



//   // var attack = false
//   // document.addEventListener('mousedown', (e) => {
//   //   switch (e.button) {
//   //     case 0:
//   //       attack = true
//   //       break;
//   //   }
//   // })

//   // document.addEventListener('mouseup', (e) => {
//   //   switch (e.button) {
//   //     case 0:
//   //       attack = false
//   //       break;
//   //   }
//   // })

//   // const clock = new THREE.Clock();
//   // const tick = () => {

//   //   if (monsterController && attack) {
//   //     attackMixer.update(deltaTime)
//   //     console.log('attack')
      
//   //     if (monsterController && monsterController.isIntersecting(collisionBoxRobot)) {
//   //       console.log('hit')
//   //     }
//   //   }
//   // }
//   // tick()

//   // --END: Rendering ------------------------------------------------------------------------------
// }

// export {
//   initializeGameRenderer,
// };
