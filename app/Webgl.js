import THREE from 'three';
window.THREE = THREE;
import Cube from './objects/Cube';
import Saber from './objects/Saber';
import Plane from './objects/Plane';
import RenderPass from './postprocessing/RenderPass';
import ShaderPass from './postprocessing/ShaderPass';
import BloomPass from './postprocessing/BloomPass';
import EffectComposer from './postprocessing/EffectComposer';
import CopyShader from './shaders/CopyShader';
import FXAAShader from './shaders/FXAAShader';

export default class Webgl {
  constructor(width, height) {
    this.params = {
      usePostprocessing: false,
    };

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    this.camera.position.z = 3000;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor('midnightblue');

    this.composer = null;
    this.initPostprocessing();

    this.prepareRaycaster();

    this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    this.hemiLight.color.setHSL( 0.6, 1, 0.6 );
    this.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    this.hemiLight.position.set( 0, 500, 0 );
    this.scene.add( this.hemiLight );

    this.saber = new Saber();
    this.scene.add( this.saber );

    this.cube = new Cube();
    this.scene.add( this.cube );

    this.ground = new Plane();
    this.scene.add( this.ground );
  }

  prepareRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.offset = new THREE.Vector3();

    this.plane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 5000, 5000, 8, 8 ),
			new THREE.MeshBasicMaterial( { visible: false } )
		);

    this.scene.add( this.plane );
  }

  initPostprocessing() {
    this.renderModel = new THREE.RenderPass( this.scene, this.camera);
    this.effectBloom = new THREE.BloomPass( 5.5 );
    this.effectCopy = new THREE.ShaderPass( THREE.CopyShader );

    this.effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );

    this.composer = new THREE.EffectComposer( this.renderer );

    const width = window.innerWidth || 2;
    const height = window.innerHeight || 2;

    this.effectFXAA.uniforms.resolution.value.set( 1 / width, 1 / height );

    this.effectCopy.renderToScreen = true;

    this.composer.addPass( this.renderModel );
    this.composer.addPass( this.effectFXAA );
    this.composer.addPass( this.effectBloom );
    this.composer.addPass( this.effectCopy );
  }

  resize(width, height) {
    if (this.composer) {
      this.composer.setSize(width, height);
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  moveSaber(event) {
    event.preventDefault();

    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    this.raycaster.setFromCamera( this.mouse, this.camera );

    const intersect = this.raycaster.intersectObject( this.plane );
    if (intersect.length > 0) {
      console.log(intersect);
      const point = intersect[ 0 ].point;
      this.saber.position.set( point.x, point.y, this.saber.position.z);
      console.log('intersect !');
    } else {
      console.log('not intersect !');
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    this.saber.update();
    this.cube.update();
    if (this.params.usePostprocessing) {
      this.composer.render();
    }
  }
}
