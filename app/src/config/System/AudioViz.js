import * as THREE from 'three'

import {math} from '../Utils/Math.js'
import {noise} from '../Utils/Noise.js'

export default class AudioViz {

    constructor(camera, scene) {

        this.camera_ = camera
        this.scene_ = scene

        this.createVisualization()
    } 

    initializeAudio(filePath) {
        this.listener = new THREE.AudioListener()
        this.camera_.add(this.listener)

        this.audio = new THREE.PositionalAudio(this.listener)
        this.audioLoader = new THREE.AudioLoader()

        this.speakerMesh.add(this.audio)
        
        this.audioLoader.load(filePath, (buffer) => {
            setTimeout(() => {
                this.audio.setBuffer(buffer)
                this.audio.setLoop(true)
                this.audio.setVolume(1)
                this.audio.setRefDistance(100)
                this.audio.play()
                this.analyzer = new THREE.AudioAnalyser(this.audio, 64)
                this.analyzerData = []
            }, 2000)
        })

        this.indexTimer_ = 0
        this.noise_ = new noise.Noise({
          octaves: 3,
          persistence: 0.5,
          lacunarity: 1.6,
          exponentiation: 1.0,
          height: 1.0,
          scale: 0.1,
          seed: 1
        })
    }

    createVisualization() {
        const platform = new THREE.Mesh(new THREE.PlaneGeometry(0, 0), new THREE.MeshBasicMaterial({color: 0x000000}))
        platform.position.set(0,-60, 0)
        platform.rotateX(-Math.PI / 2)
        this.scene_.add(platform)
    
        const platformGeo = new THREE.BoxGeometry(4, 4, 4)
        this.platformMeshes = []
        const speakerGroup = new THREE.Group()
        speakerGroup.rotation.set(-Math.PI / 2, 0, Math.PI / 2)
    
        for (let x = -25; x <= 25; ++x) {
          const row = []
          
          for (let y = 0; y < 32; ++y) {
            const speaker = new THREE.Mesh(platformGeo, new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0x000000}))
            speaker.position.set(0, y * 4, x * 4)
            speakerGroup.add(speaker)
            row.push(speaker)
          }

          this.platformMeshes.push(row)

        }

        platform.add(speakerGroup)
        this.speakerMesh = platform
    }

    update(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001
    
        if (this.analyzer) {
          this.indexTimer_ += timeElapsedS * 0.1
    
          this.analyzerData.push([...this.analyzer.getFrequencyData()])
          const rows = this.platformMeshes.length
          if (this.analyzerData.length > rows) {
            this.analyzerData.shift()
          }
    
          const colourSpline = new LinearSpline((t, a, b) => {
            const c = a.clone()
            return c.lerp(b, t)
          })

          colourSpline.AddPoint(0.0, new THREE.Color(0x0899AE))
          colourSpline.AddPoint(0.25, new THREE.Color(0x6F238F))
          colourSpline.AddPoint(0.5, new THREE.Color(0x01011D))
          colourSpline.AddPoint(0.75, new THREE.Color(0x05BCC4))
          colourSpline.AddPoint(1.0, new THREE.Color(0x873B7C))
    
          const remap = [
            31, 29, 27, 25, 23, 21 ,19, 17, 15, 13, 11, 9, 7, 5, 3, 1, 
            0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30
        ];

          for (let r = 0; r < this.analyzerData.length; ++r) {
            const data = this.analyzerData[r];
            const speakerRow = this.platformMeshes[r]

            for (let i = 0; i < data.length; ++i) {
              const freqScale = math.smootherstep((data[remap[i]]/255) ** 0.5, 0, 1)
              const source = 1 + 6 * freqScale + this.noise_.Get(this.indexTimer_, r * 0.42142, i * 0.3455)

              //speakerRow[i].scale.set(source, 1, source) // make it 1x32
              speakerRow[i].scale.set(source, 1, 1)
              speakerRow[i].material.color.copy(colourSpline.Get(freqScale))
              speakerRow[i].material.emissive.copy(colourSpline.Get(freqScale))
              speakerRow[i].material.emissive.multiplyScalar(freqScale ** 2)
            }  
          }
        }
    }

}

class LinearSpline {
    constructor(lerp) {
      this.points_ = []
      this._lerp = lerp
    }
  
    AddPoint(t, d) {
      this.points_.push([t, d])
    }
  
    Get(t) {
      let p1 = 0
  
      for (let i = 0; i < this.points_.length; i++) {
        if (this.points_[i][0] >= t) {
          break
        }
        p1 = i
      }
  
      const p2 = Math.min(this.points_.length - 1, p1 + 1)
  
      if (p1 == p2) {
        return this.points_[p1][1]
      }
  
      return this._lerp(
          (t - this.points_[p1][0]) / (this.points_[p2][0] - this.points_[p1][0]), this.points_[p1][1], this.points_[p2][1])
    }
  }