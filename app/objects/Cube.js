import THREE from 'three';

export default class Cube extends THREE.Object3D {
  constructor() {
    super();

    for (let i = 0; i < 4; i++) {
      const positions = [
        [1000, 0],
        [-1000, 0],
        [0, 1000],
        [0, -1000],
      ];

      const geom = new THREE.BoxGeometry(200, 200, 200);
      const mat = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(positions[i][0], positions[i][1], 0);
      this.add(mesh);
    }
  }

  update() {
    this.rotation.x -= 0.01;
    this.rotation.z -= 0.01;
  }
}
