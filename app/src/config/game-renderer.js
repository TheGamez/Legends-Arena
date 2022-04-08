/* MODULES */

import * as THREE from 'three'
import Experience from './Experience.js'

/* GAME RENDERER */

const initializeGameRenderer = () => {
  const canvas = document.querySelector('#webgl-canvas')
  const scene = new THREE.Scene()
  const experience = new Experience(canvas, scene)

  // Example of load models
  experience.controller.loadModel('./models/monster.glb', new THREE.Vector3(0, 0, 0), 0.0)

  // Example of loading maps
  experience.environment.loadEnvironmentMap('./models/map.glb')

  // Example of loading in audio and playing it (will auto play after 2 seconds)
  // To stop playing the audio, go into the GameAudio.js file and comment out the this.audio.play() line
  // To get the file path working you must put the audio file in build folder (ie. app/build/audio.mp3)
  experience.camera.audio.initializeAudio('./popcorn.mp3')




  // Testing -- BEGIN (can delete before release) ----------------------------------------------------
  const boxGeo = new THREE.BoxGeometry(5, 5, 5)
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const mesh = new THREE.Mesh(boxGeo, boxMaterial)
  mesh.position.set(0, 10, -10)
  scene.add(mesh)

  var collisionBox = new THREE.Box3().setFromObject(mesh)
  scene.add(new THREE.Box3Helper(collisionBox, 0x00ff00))

  var gridHelper = new THREE.GridHelper(100, 50)
  scene.add( gridHelper )
  scene.add(new THREE.AxesHelper())
  // Testing -- END -----------------------------------------------------------------------------------




  // Update Frames
  const clock = new THREE.Clock()
  var health = 100
  const tick = () => {
    let deltaTime = clock.getDelta()

    // Example of collision detection and Impulse for current player
    if (experience.controller && experience.controller.isIntersecting(collisionBox)) {
      console.log('hit')
      var impulse = experience.controller.forceImpulse()
      mesh.position.x += impulse.x
      mesh.position.z += impulse.z

      // Idk if this is the best way to do this
      // health -= 10 // this should be a random number
      // let html = `Health ` + health
      // document.querySelector('#root-screen').getElementsByClassName('heath-label').innerHTML = html

    }

    // Example of updating collsion box locRotScale for other Objects Collsion Boxes
    collisionBox.setFromObject(mesh)

    experience.update()
    
    experience.controller.playerControls(experience.camera.controls, deltaTime)
    experience.emitter.trigger('tick')

    window.requestAnimationFrame(tick)
  }

  tick()
}

export {
  initializeGameRenderer,
};

