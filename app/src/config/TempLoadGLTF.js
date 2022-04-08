import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


export default class TempLoadGLTF {
    constructor(_scene) {
        this.scene = _scene
        this.playerModel
        this.collisionBox = new THREE.Box3()

        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/') // ../../../build/draco/

        this.gltfLoader = new GLTFLoader()
        this.gltfLoader.setDRACOLoader(this.dracoLoader)
    }

    loadModel(modelFilePath, modelPostion) {
        this.gltfLoader.load(modelFilePath, (gltf) => {
            this.gltfObject = gltf.scene
            this.gltfObject.position.set(modelPostion.x, modelPostion.y, modelPostion.z)

            this.scene.add(this.gltfObject)
            this.playerModel = new TempGltfObject(this.gltfObject)
            
            this.collisionBox.setFromObject(this.gltfObject)
            this.scene.add(new THREE.Box3Helper(this.collisionBox, 0xff0000))
        })
    }

    getPlayerCollisionBox() {
        return this.collisionBox
    }

    update() {
        if (this.playerModel) {
            this.collisionBox.setFromObject(this.playerModel.getGltfObject())
        }
    }

    getPlayerObject() {
        if (this.playerModel) {
            return this.playerModel.getGltfObject()
        }
    }
}

class TempGltfObject {
    constructor(_gltfObject) {
        this.object = _gltfObject
    }

    getGltfObject() {
        return this.object
    }
}