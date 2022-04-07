import * as THREE from 'three'
import vertexShaderWave from '../Shaders/vertex.glsl'
import fragmentShaderWave from '../Shaders/fragment.glsl'

export default class WaveShader {
    constructor(_scene) {
        this.scene = _scene

        this.SEPARATION = 30
        this.AMOUNTX = 1000
        this.AMOUNTY = 1000
        this.numParticles = this.AMOUNTX * this.AMOUNTY
        this.particles
        this.count = 0
        this.i = 0 
        this.j = 0

        this.setup()
    }

    setup() {
        this.positionsArray = new Float32Array( this.numParticles * 3 )
        this.scalesArray = new Float32Array( this.numParticles )

        this.i = 0
        this.j = 0

        for ( let ix = 0; ix < this.AMOUNTX; ix ++ ) {
            for ( let iy = 0; iy < this.AMOUNTY; iy ++ ) {

                this.positionsArray[ this.i ] = ix * this.SEPARATION - ( ( this.AMOUNTX * this.SEPARATION ) / 2 ) // x
                this.positionsArray[ this.i + 1 ] = 0 // y
                this.positionsArray[ this.i + 2 ] = iy * this.SEPARATION - ( ( this.AMOUNTY * this.SEPARATION ) / 2 ) // z

                this.scalesArray[ this.j ] = 1

                this.i += 3
                this.j ++

            }

        }

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( this.positionsArray, 3 ) )
        this.geometry.setAttribute( 'scale', new THREE.BufferAttribute( this.scalesArray, 1 ) )

        this.material = new THREE.ShaderMaterial( {
            vertexShader: vertexShaderWave,
            fragmentShader: fragmentShaderWave,
            uniforms: {
                color: { value: new THREE.Color( 0xFDD3B1 ) },
            }
        })

        this.particles = new THREE.Points(  this.geometry, this.material )
        this.scene.add(  this.particles )
    }

    update() {
    this.positions = this.particles.geometry.attributes.position.array;
    this.scales = this.particles.geometry.attributes.scale.array;

    this.i = 0
    this.j = 0

    for ( let ix = 0; ix <  this.AMOUNTX; ix ++ ) {

      for ( let iy = 0; iy <  this.AMOUNTY; iy ++ ) {

        this.positions[ this.i + 1 ] = (( Math.sin( ( ix +  this.count ) * 0.3 ) * 5 ) + 
        ( Math.sin( ( iy +  this.count ) * 0.5 ) * 5 )) - 15

        this.scales[ this.j ] = ( Math.sin( ( ix +  this.count ) * 0.3 ) + 1 ) * 3 + 
        ( Math.sin( ( iy +  this.count ) * 0.5 ) + 1 ) * 2

        this.i += 3;
        this.j ++;

      }

    }

    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.geometry.attributes.scale.needsUpdate = true;

    this.count += 0.1;
    }
}