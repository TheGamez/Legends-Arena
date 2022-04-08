import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default class Environment {
    
    constructor(_scene) {
        this.scene = _scene

        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')

        this.gltfLoader = new GLTFLoader()
        this.gltfLoader.setDRACOLoader(this.dracoLoader)

        this.setEnvironmentLight()
    }


    setEnvironmentLight() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 2.0)
        this.scene.add(this.ambientLight)

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
        this.directionalLight.position.set(5, 5, 5)
        this.scene.add(this.directionalLight)

        this.scene.background = new THREE.Color( 0x060E1A );
    }

    loadEnvironmentMap(modelFilePath) {
        this.gltfLoader.load(modelFilePath, (gltf) => { 
            this.environmentMap = gltf.scene
            this.environmentMap.position.set(0, 200, 0)
            this.scene.add(this.environmentMap)
        })
    }
}