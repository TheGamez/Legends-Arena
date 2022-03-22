import * as THREE from 'three'


//class for character controller
export class CharacterController {

    constructor(model, camera, cameraControls) {
        this.model = model
        this.camera = camera
        this.cameraControls = cameraControls

        this.walkDirection = new THREE.Vector3(0, 0, 0)
        this.rotateAngle = new THREE.Vector3(0, 1, 0)
        this.rotateQuarternion = new THREE.Quaternion()
        this.cameraTarget = new THREE.Vector3()
        this.veclocity = 15

        this.updateCameraTarget(0,0)

    }

    updateCameraTarget(x, z) {
        this.camera.position.x += x
        this.camera.position.z += z

        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.z = this.model.position.z
        this.cameraControls.target = this.cameraTarget
    }

    update(tick, key) {

        this.model.quaternion.copy(this.rotateQuarternion)

        this.camera.getWorldDirection(this.walkDirection)
        this.walkDirection.y = 0
        this.walkDirection.normalize()
        
        var offest = this.move(key)
        this.walkDirection.applyAxisAngle(this.rotateAngle, offest)

        const moveX = this.walkDirection.x * this.veclocity * tick
        const moveZ = this.walkDirection.z * this.veclocity * tick
        this.model.position.x += moveX
        this.model.position.z += moveZ
        this.updateCameraTarget(moveX, moveZ)

    }

    move (keysPressed) {
        var directionOffset = 0
        const W = 87
        const A = 65
        const S = 83
        const D = 68

        if (keysPressed[W]) {
            
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4
            
            } else if (keysPressed[D]) {
                directionOffset = - Math.PI / 4
            }
        
        } else if (keysPressed[S]) {
            
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2
            
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2
            
            } else {
                directionOffset = Math.PI
            }
        
        } else if (keysPressed[A]) {
            directionOffset = Math.PI / 2
        
        } else if (keysPressed[D]) {
            directionOffset = - Math.PI / 2
        }

        this.model.rotation.y = directionOffset
        return directionOffset
    }

}