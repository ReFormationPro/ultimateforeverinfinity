import { Scene, MeshBuilder } from "babylonjs";
import EntityObject from "./EntityObject";
export default class UFIGround extends EntityObject {
  scene: Scene;
  width: number;
  height: number;

  constructor(scene: Scene, width: number = undefined, height: number = undefined) {
    super(scene, "ground");
    this.width = width;
    this.height = height;
    this.createMesh();
  }
  createMesh() {
    this.mesh = MeshBuilder.CreateGround(
      this.name,
      { width: this.width, height: this.height },
      this.scene
    );
    this.createCompundMesh();
  }
}
