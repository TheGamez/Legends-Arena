/* MODULES */

import * as THREE from 'three'
import Experience from './Experience.js'
import TempLoadGLTF from './TempLoadGLTF.js'

/* GAME RENDERER */

const initializeGameRenderer = () => {
  const canvas = document.querySelector('#webgl-canvas')
  const scene = new THREE.Scene()
  const experience = new Experience(canvas, scene)

  // Example of load player model
  experience.controller.loadModel('./models/monster.glb', new THREE.Vector3(0, 0, 0), 0.0)

  // Example of loading maps
  experience.environment.loadEnvironmentMap('./models/map.glb')

  // Example of loading in audio and playing it (will auto play after 2 seconds)
  // To stop playing the audio, go into the GameAudio.js file and comment out the this.audio.play() line
  // To get the file path working you must put the audio file in build folder (ie. app/build/audio.mp3)
  experience.camera.audio.initializeAudio('./popcorn.mp3')

  const changeHealth = () => {
    // Idk if this is the best way to do this
    health -= 10 // this should be a random number
    let html = `Health ` + health
    document.querySelector('#root-screen').getElementsByClassName('heath-label').innerHTML = html
  }



  // Testing -- BEGIN ---------------------------------------------------------------------------------
  const temp = new TempLoadGLTF(scene)
  temp.loadModel('./models/monster.glb', new THREE.Vector3(0, 0, 0), 1.0)

  const temp2 = new TempLoadGLTF(scene)
  temp2.loadModel('./models/demon.glb', new THREE.Vector3(40, -6, 0), 1.0)

  const temp3 = new TempLoadGLTF(scene)
  temp3.loadModel('./models/robot.glb', new THREE.Vector3(-40, 3, 0), 1.0)

  const testCollsion = () => {
    var impulse = experience.controller.forceImpulse()

    if (experience.controller && experience.controller.isIntersecting(temp.getPlayerCollisionBox()) ) {
      console.log('hit monster')
      temp.getPlayerObject().position.x += impulse.x
      temp.getPlayerObject().position.z += impulse.z
    }

    if (experience.controller && experience.controller.isIntersecting(temp2.getPlayerCollisionBox()) ) {
      console.log('hit demon')
      temp2.getPlayerObject().position.x += impulse.x
      temp2.getPlayerObject().position.z += impulse.z
    }

    if (experience.controller && experience.controller.isIntersecting(temp3.getPlayerCollisionBox()) ) {
      console.log('hit robot')
      temp3.getPlayerObject().position.x += impulse.x
      temp3.getPlayerObject().position.z += impulse.z
    }

    // Example of updating collsion box locRotScale for other Objects Collsion Boxes
    temp.update()
    temp2.update()
    temp3.update()
  }
  // Testing -- END -----------------------------------------------------------------------------------




  // Update Frames
  const clock = new THREE.Clock()
  var health = 100
  const tick = () => {
    let deltaTime = clock.getDelta()

    testCollsion()

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

