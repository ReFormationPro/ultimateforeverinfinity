import { Controller } from "./Controller";
import { Scene, Vector3 } from "babylonjs";
import TestController from "./TestController";
export default class PlayerController extends TestController {
  constructor(scene: Scene, canvas: any) {
    super(scene, canvas);
    this.command.gravity.copyFrom(this.scene.gravity);
    this.command.test = false;
  }
  listenInput() {
    this.command.displacement = Vector3.Zero();

    if (this.inputMap["w"]) {
      this.command.displacement.addInPlace(Vector3.Forward());
    }
    if (this.inputMap["a"]) {
      this.command.displacement.addInPlace(Vector3.Left());
    }
    if (this.inputMap["s"]) {
      this.command.displacement.addInPlace(Vector3.Backward());
    }

    if (this.inputMap["d"]) {
      this.command.displacement.addInPlace(Vector3.Right());
    }
    if (this.inputMap[" "]) {
      this.command.displacement.addInPlace(Vector3.Up());
    }
    this.move();
  }
}
