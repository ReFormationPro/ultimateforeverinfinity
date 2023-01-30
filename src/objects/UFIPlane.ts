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
    rotation: Vector3 = Vector3.Zero(),
    isFacing: boolean = false
  ) {
    super(scene, "plane", position, rotation);
    this.width = width;
    this.height = height;
    this.createMesh();
    if (isFacing) {
      // This makes it always face the camera
      this.mesh.billboardMode = Mesh.BILLBOARDMODE_Y;
    }
  }
  createMesh() {
    this.mesh = MeshBuilder.CreatePlane(this.name, {
      width: this.width,
      height: this.height
    });
    console.log(this.position);

    this.createCompundMesh();
    this.mesh.position = Vector3.Zero();
    // this.mesh.rotation = this.rotation;
  }
}
