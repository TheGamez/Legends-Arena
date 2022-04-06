import * as THREE from 'three'

export default class Environment {
    
    constructor(_scene) {
        this.scene = _scene

        this.setEnvironmentLight()
        this.setEnvironmentMap()
    }

    setEnvironmentLight() {
        // const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
        // light.position.set(0.5, 1, 0.75)
        // scene.add(light)
        
        this.ambientLight = new THREE.AmbientLight(0xffffff, 3.0)
        this.scene.add(this.ambientLight)

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
        this.directionalLight.castShadow = false
        this.directionalLight.shadow.mapSize.set(1024, 1024)
        this.directionalLight.shadow.camera.far = 15
        this.directionalLight.shadow.camera.left = - 7
        this.directionalLight.shadow.camera.top = 7
        this.directionalLight.shadow.camera.right = 7
        this.directionalLight.shadow.camera.bottom = - 7
        this.directionalLight.position.set(5, 5, 5)
        this.scene.add(this.directionalLight)

        this.scene.background = new THREE.Color( 0xffffff );
    }

    setEnvironmentMap() {

    }
}