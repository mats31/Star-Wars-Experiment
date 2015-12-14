import THREE from 'three';
import '../loaders/OBJLoader.js';
const glslify = require('glslify');
let material;
let start = Date.now();
let loadedObject;
let particleSystem;

export default class Snowflake extends THREE.Object3D {
  constructor() {
    super();

    const self = this;

    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = function onProgress( item, loaded, total ) {
      console.log( item, loaded, total );
    };

    this.manager.onProgress = function onProgress( xhr ) {
      if ( xhr.lengthComputable ) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };

    const onError = function onError( xhr ) {
      console.log('error');
    };

    let clicked = false;

    document.body.onclick = function onClick() {
      if (!clicked) {
        // TweenMax.to(material.uniforms.move, 2, {value: 1.0, ease: Power1.easeOut});
        TweenMax.to(material.uniforms.ice, 1, {value: 2000.0, ease: Power2.easeOut});
        TweenMax.to(material.uniforms.space, 1, {value: 150.0, ease: Power2.easeOut});
        clicked = true;
      } else {
        // TweenMax.to(material.uniforms.move, 2, {value: 0.0, ease: Power1.easeOut});
        TweenMax.to(material.uniforms.ice, 1, {value: 0.0, ease: Power2.easeOut});
        TweenMax.to(material.uniforms.space, 1, {value: 0.0, ease: Power2.easeOut});
        clicked = false;
      }
    };

    // Shader from https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js
    material = new THREE.ShaderMaterial( {
      uniforms: {
        tSnow: {
          type: 't',
          value: THREE.ImageUtils.loadTexture( 'textures/texture.jpg' ),
        },
        time: {
          type: 'f',
          value: 0.0,
        },
        move: {
          type: 'f',
          value: 0.0,
        },
        ice: {
          type: 'f',
          value: 0.0,
        },
        space: {
          type: 'f',
          value: 0.0,
        },
      },
      vertexShader: glslify('../shaders/vertex.glsl'),
      fragmentShader: glslify('../shaders/fragment.glsl'),
    });

    this.loader = new THREE.OBJLoader( this.manager );
    this.loader.load( 'model/gifts.obj', ( object ) => {
      loadedObject = object;

      object.traverse( ( child ) => {
        if ( child instanceof THREE.Mesh ) {
          // child.material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
          child.material = material;
          // child.material.uniforms.needsUpdate = true;
          child.geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
          child.geometry.verticesNeedUpdate = true;

          const particles = new THREE.Geometry();
          const pMaterial = new THREE.PointsMaterial({
            color: 0x243B4A,
            size: Math.floor(Math.random() * (0.8 - 0.2)) + 0.2,
            map: THREE.ImageUtils.loadTexture(
              'textures/glow.jpg'
            ),
            blending: THREE.AdditiveBlending,
            transparent: true,
          });

          for (let i = 0; i < child.geometry.vertices.length / 4; i++) {
            const particle = child.geometry.vertices[i];
            particles.vertices.push(particle);
          }

          particleSystem = new THREE.Points(particles, pMaterial);
          particleSystem.position.set(0, 0, 0);
          particleSystem.scale.set(10, 10, 10);
          self.add(particleSystem);
        }
      });
      self.add(loadedObject);
    }, this.manager.onProgress, onError );
  }

  update() {
    material.uniforms.time.value = 0.00025 * ( Date.now() - start );
    if (loadedObject) {
      loadedObject.rotation.y += 0.01;
      loadedObject.rotation.x += 0.001;
      particleSystem.rotation.y += 0.02;
      particleSystem.rotation.x -= 0.01;
    }
  }
}
