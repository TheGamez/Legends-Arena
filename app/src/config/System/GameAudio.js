import * as THREE from 'three'

export default class GameAudio {

    constructor(_camera) {
        this.camera = _camera
        this.timer = 2000
    } 

    initializeAudio(filePath) {
      this.listener = new THREE.AudioListener()
      this.camera.add(this.listener)

      this.audio = new THREE.Audio(this.listener)
      this.audioLoader = new THREE.AudioLoader()
      
      this.audioLoader.load(filePath, (buffer) => {
        setTimeout(() => {
          this.audio.setBuffer(buffer)
          this.audio.setLoop(true)
          this.audio.setVolume(1)
          this.audio.play()
        }, this.timer)
      })
    }

   /**
    * @param {*} timer default 2000
    */
    setPlayStartTimer(timer) {
      this.timer = timer
    }

  }