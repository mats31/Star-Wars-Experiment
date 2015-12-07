import THREE from 'three';

export default class Plane extends THREE.Object3D {
  constructor() {
    super();

    const glslify = require('glslify');

    this.modelGeometry = new THREE.PlaneGeometry( 20000, 20000, 32, 5000, 5000 );
    this.geometry = new THREE.BufferGeometry().fromGeometry( this.modelGeometry );

    const loader = new THREE.TextureLoader();

    loader.load(
      'textures/snow.jpg',
      ( texture ) => {
        const map = texture;
        loader.load(
          'textures/noise.jpg',
          ( noise ) => {
            console.log( noise );
            this.uniforms = {
              map: { type: 't', value: map },
              noise: { type: 't', value: noise }
            };
            this.material = new THREE.ShaderMaterial( {
              uniforms: this.uniforms,
              vertexShader: glslify( '../shaders/planeShader.vert' ),
              fragmentShader: glslify( '../shaders/planeShader.frag' ),
            });
            this.plane = new THREE.Mesh( this.geometry, this.material );
            this.plane.position.set(0, -800, 0);
            this.plane.rotation.x = 5;
            this.add( this.plane );
          }
        );
      }
    );
  }

  update() {
    this.rotation.x -= 0.01;
    this.rotation.z -= 0.01;
  }
}
