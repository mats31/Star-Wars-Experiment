import THREE from 'three';
window.THREE = THREE;
import Cube from './objects/Cube';
import Saber from './objects/Saber';
import Plane from './objects/Plane';
import Shot from './objects/Shot';
import Snow from './objects/Snow';
import Snowflake from './objects/Snowflake';
// import RenderPass from './postprocessing/RenderPass';
// import ShaderPass from './postprocessing/ShaderPass';
// import BloomPass from './postprocessing/BloomPass';
// import EffectComposer from './postprocessing/EffectComposer';
// import CopyShader from './shaders/CopyShader';
// import FXAAShader from './shaders/FXAAShader';

import WAGNER from '@superguigui/wagner';
import VignettePass from '@superguigui/wagner/src/passes/vignette/VignettePass';
import MultiPassBloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass';
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass';

export default class Webgl {
  constructor(width, height) {
    this.params = {
      usePostprocessing: false,
    };

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    this.camera.position.z = 3000;

    this.renderer = new THREE.WebGLRenderer({antialiasing: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor('#2c3e50');

    this.tabIsActive = true;

    this.params.volume = 0.5;

    this.composer = null;
    this.initPostprocessing();

    this.prepareRaycaster();

    this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.45 );
    this.hemiLight.color.setHSL( 0.6, 1, 0.6 );
    this.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    this.hemiLight.position.set( 1000, 0, 22 );
    this.scene.add( this.hemiLight );

    this.saber = new Saber();
    this.scene.add( this.saber );
    this.saber.position.z = 1500;

    // this.snowflake = new Snowflake();
    // this.snowflake.position.set(0, 0, 800);
    // this.snowflake.scale.set(1, 1, 1);
    // this.scene.add(this.snowflake);

    // this.cube = new Cube();
    // this.scene.add( this.cube );

    this.ground = new Plane();
    //this.scene.add( this.ground );

    this.snow = new Snow();
    //this.scene.add( this.snow );
    // this.scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );

    // Random shots
    this.shots = [];
    (function loop(that) {
      const rand = Math.round(Math.random() * (5000 - 1000)) + 1000;
      setTimeout(() => {
        if (that.tabIsActive) {
          that.laserGame();
        }
        loop(that);
      }, rand);
    }(this));

    // Random snowflake
    this.snowflakes = [];
    (function loop(that) {
      const rand = Math.round(Math.random() * (3000 - 500)) + 500;
      setTimeout(() => {
        if (that.tabIsActive) {
          that.snowflakePop();
        }
        loop(that);
      }, rand);
    }(this));
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
    // this.renderModel = new THREE.RenderPass( this.scene, this.camera);
    // this.effectBloom = new THREE.BloomPass( 5.5 );
    // this.effectCopy = new THREE.ShaderPass( THREE.CopyShader );
    //
    // this.effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
    //
    // this.composer = new THREE.EffectComposer( this.renderer );
    //
    // const width = window.innerWidth || 2;
    // const height = window.innerHeight || 2;
    //
    // this.effectFXAA.uniforms.resolution.value.set( 1 / width, 1 / height );
    //
    // this.effectCopy.renderToScreen = true;
    //
    // this.composer.addPass( this.renderModel );
    // this.composer.addPass( this.effectFXAA );
    // this.composer.addPass( this.effectBloom );
    // this.composer.addPass( this.effectCopy );
    //
    //
    // this.vignette = new VignettePass();
    // this.vignette.params.boost = 1.2;
    // this.vignette.params.reduction = 0.7;

    this.composer = new WAGNER.Composer(this.renderer);

    this.vignette = new VignettePass();
    this.vignette.params.boost = 3.4;
    this.vignette.params.reduction = 1.4;

    this.bloomPass = new MultiPassBloomPass();
    this.bloomPass.params.blendMode = 6.4;
    this.bloomPass.params.blurAmount = 0.5;

    this.fxaa = new FXAAPass();
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
      const point = intersect[ 0 ].point;
      this.saber.position.set( point.x, point.y, this.saber.position.z);
    }
  }

  attackSaber() {
    this.saber.animAttack();

    for (let i = 0; i < this.snowflakes.length; i++) {
      if ( this.snowflakes[i].position.x <= this.saber.position.x + 300 && this.snowflakes[i].position.x >= this.saber.position.x - 300 && this.snowflakes[i].position.y <= this.saber.position.y + 800 && this.snowflakes[i].position.y >= this.saber.position.y - 400 && this.snowflakes[i].position.z <= this.saber.position.z + 200 && this.snowflakes[i].position.z >= this.saber.position.z - 400 ) {
        this.snowflakes[i].destroy();
      }
    }
  }

  laserGame() {
    const shot = new Shot();
    const rand = Math.random();

    shot.position.set( ( Math.random() * (700 - (-700)) + (-700) ), ( Math.random() * (400 - (100)) + (100) ), -1000);
    shot.rotation.x = Math.PI / 2;
    shot.parade = false;
    this.shots.push(shot);
    this.scene.add(shot);

    if (rand > 0.5) {
      document.getElementById('laser1').pause();
      document.getElementById('laser1').currentTime = 0;
      document.getElementById('laser1').play();
    } else {
      document.getElementById('laser2').pause();
      document.getElementById('laser2').currentTime = 0;
      document.getElementById('laser2').play();
    }
  }

  snowflakePop() {
    const snowflake = new Snowflake();

    snowflake.position.set( ( Math.random() * (700 - (-700)) + (-700) ), ( Math.random() * (400 - (10)) + (10) ), -1000);
    this.snowflakes.push(snowflake);
    this.scene.add(snowflake);
  }

  checkParade(shot) {
    if (shot.position.z > 1000) {
      if ( shot.position.x <= this.saber.position.x + 150 && shot.position.x >= this.saber.position.x - 150 && shot.position.y <= this.saber.position.y + 800 && shot.position.y >= this.saber.position.y - 400 && shot.position.z <= this.saber.position.z + 200 && shot.position.z >= this.saber.position.z - 300 ) {
        const rand = Math.random();

        if (rand > 0.5) {
          document.getElementById('parade').pause();
          document.getElementById('parade').currentTime = 0;
          document.getElementById('parade').play();
        } else {
          document.getElementById('parade2').pause();
          document.getElementById('parade2').currentTime = 0;
          document.getElementById('parade2').play();
        }

        shot.parade = true;
        this.saber.animParade();
        return true;
      }
    }

    return false;
  }

  setVolume() {
    document.getElementById('parade').volume = this.params.volume;
    document.getElementById('parade2').volume = this.params.volume;
    document.getElementById('laser1').volume = this.params.volume;
    document.getElementById('laser2').volume = this.params.volume;
    document.getElementById('degaine').volume = this.params.volume;
    document.getElementById('on').volume = this.params.volume;
    document.getElementById('off').volume = this.params.volume;
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    this.saber.update();
    this.snow.update();
    for (let i = 0; i < this.snowflakes.length; i++) {
      this.snowflakes[i].update();
    }
    this.setVolume();

    /* Shots */
    for (let i = 0; i < this.shots.length; i++) {
      if (this.shots[i].parade) {
        this.shots[i].position.z -= 40;
      } else {
        // if ( this.checkParade( this.shots[i] ) ) {
        //   break;
        // }
        this.checkParade( this.shots[i] );
        this.shots[i].position.z += ( 5000 - this.shots[i].position.z ) * 0.02;
        this.shots[i].position.x += -this.shots[i].position.x * 0.01;
        this.shots[i].position.y += -this.shots[i].position.y * 0.01;
      }

      if (this.shots[i].position.z > 3000 || this.shots[i].position.z < -1100) {
        this.scene.remove(this.shots[i]);
        this.shots.splice(i, 1);
      }
    }

    /* Snowflakes */
    for (let i = 0; i < this.snowflakes.length; i++) {
      this.snowflakes[i].position.z += ( 5000 - this.snowflakes[i].position.z ) * 0.02;
      this.snowflakes[i].position.x += -this.snowflakes[i].position.x * 0.01;
      this.snowflakes[i].position.y += -this.snowflakes[i].position.y * 0.01;

      if (this.snowflakes[i].position.z > 3000) {
        this.scene.remove(this.snowflakes[i]);
        this.snowflakes.splice(i, 1);
      }
    }

    if (this.params.usePostprocessing) {
      // this.composer.render();

      this.renderer.autoClearColor = true;
      this.composer.reset();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.vignette);
      this.composer.pass(this.bloomPass);
      this.composer.pass(this.fxaa);
      this.composer.toScreen();
    }
  }
}
