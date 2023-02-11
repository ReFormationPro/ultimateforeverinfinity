import { MeshBuilder, Vector3, Scene, Mesh } from "babylonjs";

import EntityObject from "./EntityObject";

export default class UFIPlane extends EntityObject {
  scene: Scene;
  width: number;
  height: number;

  constructor(
    scene: Scene,
    width: number,
    height: number,
    position: Vector3 = Vector3.Zero(),
    up: Vector3 = Vector3.Up(),
    target: Vector3 = Vector3.Forward(),
    isFacing: boolean = false
  ) {
    super(scene, "plane", position, up, target);
    this.width = width;
    this.height = height;
    this.createMesh();
    if (isFacing) {
      this.mesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
    }
  }
  createMesh() {
    this.mesh = MeshBuilder.CreatePlane(this.name, {
      width: this.width,
      height: this.height
    });

    this.createCompundMesh();
  }
}
