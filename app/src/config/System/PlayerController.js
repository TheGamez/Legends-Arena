import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default class PlayerController {

    constructor(_scene, _camera) {
        this.scene = _scene
        this.camera = _camera
        this.playerModel
        this.impulseForce
        this.attack = false

        this.cameraLook = new THREE.Vector3(0, 0, 0)
        this.cameraPosition = new THREE.Vector3()

        this.collisionBox = new THREE.Box3()

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

        window.addEventListener('keydown', (e) => {
            e.preventDefault()
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
          
          window.addEventListener('keyup', (e) => {
            e.preventDefault()
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

        document.addEventListener('mousedown', (e) => {
          switch (e.button) {
            case 0:
                this.attack = true
              break;
          }
        })

        document.addEventListener('mouseup', (e) => {
          switch (e.button) {
            case 0:
                this.attack = false
              break;
          }
        })
    }

    isIntersecting(box) {
        if (this.collisionBox.intersectsBox(box) && this.attack) {
            return true
        }
    }

    forceImpulse() {
        return this.impulseForce
    }

    /**
     * 
     * @param {*} modelFilePath model file path
     * @param {*} modelPostion position of the model
     * @param {*} modelOpacity opacity of the model
     */
    loadModel(modelFilePath, modelPostion, modelOpacity) {
        this.gltfLoader.load(modelFilePath, (gltf) => {
            this.gltfObject = gltf.scene
            this.gltfObject.position.set(modelPostion.x, modelPostion.y, modelPostion.z)

            this.gltfObject.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true
                    child.material.opacity = modelOpacity
                }
            })
            
            this.scene.add(this.gltfObject)
            this.playerModel = new gltfObject(this.gltfObject)

            this.collisionBox.setFromObject(this.gltfObject)
            //this.scene.add(new THREE.Box3Helper(this.collisionBox, 0xff0000))
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
        
        this.cameraForwardVector = this.cameraLook.multiplyScalar(100).normalize()
        this.impulseForce = new THREE.Vector3(this.cameraForwardVector.x, 0, this.cameraForwardVector.z)

       if (this.playerModel) {
            this.playerModelObject = this.playerModel.getGltfObject()

            this.collisionBox.setFromObject(this.playerModelObject)

            this.playerModelObject.position.x = this.cameraPosition.x
            this.playerModelObject.position.z = this.cameraPosition.z

            this.cameraLook.add(new THREE.Vector3(
                this.playerModelObject.position.x, 0, this.playerModelObject.position.z)
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