import THREE from 'three';
import clone from 'clone';
import SpriteCanvasMaterial from '../renderers/CanvasRenderer.js';
import OBJLoader from '../loaders/OBJLoader';

export default class Saber extends THREE.Object3D {
  constructor() {
    super();

    this.active = false;

    const manager = new THREE.LoadingManager();
    const loader = new THREE.OBJLoader( manager );
    loader.load( 'model/saber.obj', ( object ) => {
      this.add( object );
    });

    const geometry = new THREE.CylinderGeometry( 5, 12, 1000, 32 );
    this.geometry = new THREE.BufferGeometry().fromGeometry( geometry );
    this.positions = clone(this.geometry.attributes.position.array);

    this.uniforms = {
      color: { type: 'c', value: new THREE.Color( 'blue' ) },
    };

    this.material = new THREE.ShaderMaterial( {
      uniforms: this.uniforms,
      vertexShader: document.getElementById( 'vertexshader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
    });

    this.cylinder = new THREE.Mesh( this.geometry, this.material );
    this.cylinder.position.y = 575;

    this.lights = [];
    this.lightPositions = [
      [0, 1050, 0],
      [0, 950, 0],
      [0, 850, 0],
      [0, 750, 0],
      [0, 650, 0],
      [0, 550, 0],
      [0, 450, 0],
      [0, 350, 0],
      [0, 250, 0],
    ];
    this.activeLight = false;

    const PI2 = Math.PI * 2;
    const program = function program( context ) {
      context.beginPath();
      context.arc( 0, 0, 0.5, 0, PI2, true );
      context.fill();
    };

    for (let i = 0; i < 9; i++) {
      const light = new THREE.PointLight( 'blue', 1000000, 700 );
      light.position.set( this.lightPositions[i][0], this.lightPositions[i][1], this.lightPositions[i][2]);
      this.lights.push( light );
      this.add( light );
    }
    this.add( this.cylinder );

    window.addEventListener('click', () => {
      if (!this.active) {
        document.getElementById('degaine').pause();
        document.getElementById('degaine').currentTime = 0;
        document.getElementById('degaine').play();

        document.getElementById('on').pause();
        document.getElementById('on').currentTime = 0;
        document.getElementById('on').loop = true;
        document.getElementById('on').volume = 0.1;
        document.getElementById('on').play();
        this.activeLight = true;
      } else {
        document.getElementById('degaine').currentTime = 0;
        document.getElementById('degaine').pause();

        document.getElementById('on').currentTime = 0;
        document.getElementById('on').pause();

        document.getElementById('off').pause();
        document.getElementById('off').currentTime = 0;
        document.getElementById('off').play();
        this.activeLight = false;
      }
      this.active = !this.active;
    });
  }

  update() {
    if (!this.active) {
      for (let i = 0, i3 = 0; i < this.cylinder.geometry.attributes.position.array.length; i++, i3 += 3) {
        this.cylinder.geometry.attributes.position.array[i3 + 1] += (-500 - this.cylinder.geometry.attributes.position.array[i3 + 1]) * 0.1;
      }
    } else {
      for (let i = 0, i3 = 0; i < this.cylinder.geometry.attributes.position.array.length; i++, i3 += 3) {
        this.cylinder.geometry.attributes.position.array[i3 + 1] += (this.positions[i3 + 1] - this.cylinder.geometry.attributes.position.array[i3 + 1]) * 0.1;
      }
    }

    if (this.activeLight) {
      for (let i = 0; i < this.lights.length; i++) {
        this.lights[i].distance += (700 - this.lights[i].distance) * 0.09;
      }
    } else {
      for (let i = 0; i < this.lights.length; i++) {
        this.lights[i].distance += (- this.lights[i].distance) * 0.09;
      }
    }

    this.cylinder.geometry.attributes.position.needsUpdate = true;
  }
}
