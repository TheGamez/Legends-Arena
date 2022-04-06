
import PlayerController from './System/PlayerController.js'
import Camera from './System/Camera.js'
import Renderer from './System/Renderer.js'
import Sizes from './Utils/Sizes.js'
import EventEmitter from './Utils/EventEmitter.js'
import Environment from './World/Environment.js'

let instance = null

export default class Experience {

    constructor(_canvas, _scene) {
        
        if(instance) {
            return instance
        }
        instance = this
        
        window.experience = this
        this.canvas = _canvas
        this.scene = _scene

        this.sizes = new Sizes()
        this.camera = new Camera(this.sizes, this.scene, this.canvas)
        this.renderer = new Renderer()
        this.emitter = new EventEmitter()
        this.controller = new PlayerController(this.scene, this.camera)
        this.environment = new Environment(this.scene)

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.renderer.update()
    }

    destroy() {
        this.sizes.off('resize')
        this.emitter.off('tick')
        this.camera.controls.dispose()
        this.renderer.instance.dispose()
    }
} 