import THREE from 'three';

export default class Snow extends THREE.Object3D {
  constructor() {
    super();

    this.geometry = new THREE.Geometry();
    this.materials = [];

    this.particlesContainer = [];
    this.sprite1 = {};
    this.sprite2 = {};
    this.sprite3 = {};
    this.sprite4 = {};
    this.sprite5 = {};

    const loader = new THREE.TextureLoader();

    loader.load('textures/snowflake1.png', (texture1) => {
      this.sprite1 = texture1;
      loader.load('textures/snowflake2.png', (texture2) => {
        this.sprite2 = texture2;
        loader.load('textures/snowflake3.png', (texture3) => {
          this.sprite3 = texture3;
          loader.load('textures/snowflake3.png', (texture4) => {
            this.sprite4 = texture4;
            loader.load('textures/snowflake4.png', (texture5) => {
              this.sprite5 = texture5;
              this.setGeometry();
              this.setMaterial();
            });
          });
        });
      });
    });
  }

  setGeometry() {
    for ( let i = 0; i < 10000; i ++ ) {
      const vertex = new THREE.Vector3();
      vertex.x = Math.random() * 6000 - 3000;
      vertex.y = Math.random() * 6000 - 3000;
      vertex.z = Math.random() * 6000 - 3000;

      this.geometry.vertices.push( vertex );
    }
  }

  setMaterial() {
    const parameters = [
      [ [1.0, 0.2, 0.5], this.sprite2, 20 ],
      [ [0.95, 0.1, 0.5], this.sprite3, 15 ],
      [ [0.90, 0.05, 0.5], this.sprite1, 10 ],
      [ [0.85, 0, 0.5], this.sprite5, 8 ],
      [ [0.80, 0, 0.5], this.sprite4, 5 ],
    ];

    for ( let i = 0; i < parameters.length; i ++ ) {

      const color = parameters[i][0];
      const sprite = parameters[i][1];
      const size = parameters[i][2];

      this.materials[i] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true } );
      this.materials[i].color.setHSL( color[0], color[1], color[2] );

      this.particles = new THREE.Points( this.geometry, this.materials[i] );

      this.particles.rotation.x = Math.random() * 6;
      this.particles.rotation.y = Math.random() * 6;
      this.particles.rotation.z = Math.random() * 6;

      this.particlesContainer.push( this.particles );

      this.add( this.particles );
      console.log(this.particles);
    }
  }

  update() {
    const time = Date.now() * 0.00005;

    for (let i = 0; i < this.particlesContainer.length; i++) {
      this.particlesContainer[i].rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
    }
  }
}
