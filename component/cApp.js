import * as THREE from "three";
import PThreeTemplate from "./pThreeTemplate";
import CInteractive from "./cInteractive";
import vs_test from "../shader/test.vert?raw";
import fs_test from "../shader/test.frag?raw";
import vs_hemisphere from "../shader/hemisphere.vert?raw";
import fs_hemisphere from "../shader/hemisphere.frag?raw";
import vs_circle from "../shader/circle.vert?raw";
import fs_circle from "../shader/circle.frag?raw";

export default class CApp extends PThreeTemplate {
  constructor() {
    super({ wrapper: "#app", isFitScreen: true });
  }

  async init() {
    this.isReady = false;
    this.interactive = new CInteractive();
    this.position = [];
    this.addControls();

    this.count = 3000;
    this.dir = new THREE.Vector3(0, 1, 0).normalize();

    this.instancedCone = this.createInstancedCone(this.count);
    this.sphere = this.createSphere();

    this.scene.add(this.instancedCone);
    this.scene.add(this.sphere);

    this.d = new THREE.Object3D();

    console.log(this.isReady);
    this.isReady = true;
  }

  createInstancedCone(count) {
    const size = 10;
    const height = 30;
    const segments = 32;
    const max = window.innerWidth;
    const geo = new THREE.ConeGeometry(size, height, segments);
    const mat = new THREE.MeshLambertMaterial();
    const mesh = new THREE.InstancedMesh(geo, mat, count);
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      const x = Math.random() * max - max / 2;
      const y = Math.random() * max - max / 2;
      const z = Math.random() * max - max / 2;
      this.position.push({ x, y, z });
    }
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    return mesh;
  }

  createCone() {
    const size = 10;
    const height = 30;
    const segments = 32;
    const geo = new THREE.ConeGeometry(size, height, segments);
    const mat = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geo, mat);
    return mesh;
  }

  createSphere() {
    const size = 10;
    const wSegs = 32;
    const hSegs = 32;
    const geo = new THREE.SphereGeometry(size, wSegs, hSegs, 0, Math.PI * 2);
    const mat = new THREE.MeshLambertMaterial({ color: 0xd3262d });
    const mesh = new THREE.Mesh(geo, mat);
    return mesh;
  }

  render() {
    if (!this.isReady) return;
    if (this.interactive.mouse.x) {
      this.sphere.position.x = this.interactive.mouse.x;
      this.sphere.position.y = this.interactive.mouse.y;
    }

    for (let i = 0; i < this.count; i++) {
      const { x, y, z } = this.position[i];
      const d = new THREE.Object3D();
      d.position.set(x, y, z);
      const subVec = new THREE.Vector3().subVectors(
        new THREE.Vector3(
          this.interactive.mouse.x,
          this.interactive.mouse.y,
          0
        ),
        new THREE.Vector3(x, y, z)
      );
      subVec.normalize();
      const axis = new THREE.Vector3().crossVectors(this.dir, subVec);
      axis.normalize();
      const angle = subVec.dot(this.dir);
      const radians = Math.acos(angle);
      const qtn = new THREE.Quaternion().setFromAxisAngle(axis, radians);
      d.quaternion.premultiply(qtn);

      d.updateMatrix();
      this.instancedCone.setMatrixAt(i, d.matrix);
      this.instancedCone.instanceMatrix.needsUpdate = true;
    }
  }
}
