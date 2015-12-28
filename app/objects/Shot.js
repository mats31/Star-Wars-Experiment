import THREE from 'three';

export default class Shot extends THREE.Object3D {
  constructor() {
    super();

    this.paradeBis = false;
    this.geom = new THREE.CylinderGeometry( 5, 5, 250, 32 );
    this.mat = new THREE.MeshBasicMaterial({
      color: 'red',
    });
    this.mesh = new THREE.Mesh(this.geom, this.mat);

    this.add(this.mesh);
  }

  update() {
  }
}
