import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import GLOBAL_STATE from '../../global'

export default class PlayerController {

    constructor(_scene, _camera) {
        this.scene = _scene
        this.camera = _camera
        this.playerModel

        this.cameraLook = new THREE.Vector3(0, 0, 0)
        this.cameraPosition = new THREE.Vector3()

        this.canJump = false
        this.moveForward = false
        this.moveBackward = false
        this.moveLeft = false
        this.moveRight = false

        this.velocity = new THREE.Vector3()
        this.direction = new THREE.Vector3()

        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/') // ../../../build/draco/

        this.gltfLoader = new GLTFLoader()
        this.gltfLoader.setDRACOLoader(this.dracoLoader)

        window.addEventListener('keydown', (event) => {
            event.preventDefault()

            // GLOBAL_STATE.socket.emit('keydown', { keyInputCode: event.code });

            switch ( event.code ) {
        
                case 'KeyW':
                    this.moveForward = true
                    break
        
                case 'KeyA':
                    this.moveLeft = true
                    break
        
                case 'KeyS':
                    this.moveBackward = true
                    break
        
                case 'KeyD':
                    this.moveRight = true
                    break
        
                // case 'Space':
                //     if ( this.canJump === true ) this.velocity.y += 250
                //     this.canJump = false
                //     break
        
            }
        })
          
          window.addEventListener('keyup', (event) => {
            event.preventDefault()

            // GLOBAL_STATE.socket.emit('keyup', { keyInputCode: event.code });

            switch ( event.code ) {
        
                case 'KeyW':
                    this.moveForward = false
                    break
        
                case 'KeyA':
                    this.moveLeft = false
                    break
        
                case 'KeyS':
                    this.moveBackward = false
                    break
        
                case 'KeyD':
                    this.moveRight = false
                    break
        
            }
        })
    }

    loadModel(modelFilePath, modelPostion, modelOpacity, modelObjectName) {
        this.gltfLoader.load(modelFilePath, (gltf) => {
            this.gltfObject = gltf.scene
            this.gltfObject.position.set(modelPostion.x, modelPostion.y, modelPostion.z)
            this.gltfObject.name = modelObjectName;

            this.gltfObject.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true
                    child.material.opacity = modelOpacity
                }
            })
            
            this.scene.add(this.gltfObject)
            this.playerModel = new gltfObject(this.gltfObject)
        })
    }

    playerControls(controls, deltaTime) {
        this.velocity.x -= this.velocity.x * 5.0 * deltaTime
        this.velocity.z -= this.velocity.z * 5.0 * deltaTime
    
        this.velocity.y -= 9.8 * 100.0 * deltaTime // 100.0 = mass
    
        this.direction.z = Number( this.moveForward ) - Number( this.moveBackward )
        this.direction.x = Number( this.moveRight ) - Number( this.moveLeft )
        this.direction.normalize() // this ensures consistent movements in all directions
    
        if ( this.moveForward || this.moveBackward ) {
            this.velocity.z -= this.direction.z * 400.0 * deltaTime
        }
        
        if ( this.moveLeft || this.moveRight ) {
            this.velocity.x -= this.direction.x * 400.0 * deltaTime
        }
    
        controls.moveRight( - this.velocity.x * deltaTime )
        controls.moveForward( - this.velocity.z * deltaTime )
    
        controls.getObject().position.y += ( this.velocity.y * deltaTime ) // new behavior
        
        this.cameraInstance = this.camera.getCameraInstance()
        this.cameraInstance.getWorldDirection(this.cameraLook)
        this.cameraInstance.getWorldPosition(this.cameraPosition)

        this.playerCameraControls = this.camera.getControls()


       if (this.playerModel) {
            this.playerModelPosition = this.playerModel.getGltfObject().position

            //this.playerModelPosition.x = (this.cameraPosition.x + this.cameraPosition.z - 15) * Math.cos(this.cameraLook.x + this.cameraLook.z)
            //this.playerModelPosition.z = (this.cameraPosition.x + this.cameraPosition.z - 15) * Math.cos(this.cameraLook.x + this.cameraLook.z)

            this.playerModelPosition.x = this.cameraPosition.x
            this.playerModelPosition.z = this.cameraPosition.z

            this.cameraLook.add(new THREE.Vector3(
                this.playerModelPosition.x, 0, this.playerModelPosition.z)
            )

            this.playerModel.getGltfObject().lookAt(new THREE.Vector3(
                this.cameraLook.x, 0, this.cameraLook.z)
            )

       }
    
        if ( controls.getObject().position.y < 10 ) {
    
            this.velocity.y = 0
            controls.getObject().position.y = 10
    
            this.canJump = true
        }
    }

}

class gltfObject {
    constructor(_gltfObject) {
        this.gltfObject = _gltfObject
    }

    getGltfObject() {
        return this.gltfObject
    }
}