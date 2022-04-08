import * as THREE from 'three'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js'

import GameAudio from './GameAudio'

export default class Camera {
    constructor(_sizes, _scene, _canvas) {
        this.sizes = _sizes
        this.scene = _scene
        this.canvas = _canvas

        this.setInstance()
        this.setControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(50, this.sizes.width / this.sizes.height, 0.01, 100000)
        this.scene.add(this.instance)
        this.audio = new GameAudio(this.instance)
    }

    getCameraInstance() {
        return this.instance
    }

    setControls() {
        this.controls = new PointerLockControls(this.instance, this.canvas)
        window.addEventListener('click', () => {
            this.controls.lock()
        })
    }

    getControls() {
        return this.controls
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
}