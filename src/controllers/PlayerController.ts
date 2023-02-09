import { Controller } from "./Controller";
import { Scene, Vector3 } from "babylonjs";
import TestController from "./TestController";
export default class PlayerController extends TestController {
  constructor(scene: Scene) {
    super(scene);
    this.command.test = false;
  }
  listenInput(inputMap: object) {
    if (inputMap["w"]) {
      this.command.displacement.addInPlace(Vector3.Forward());
    }
    if (inputMap["a"]) {
      this.command.displacement.addInPlace(Vector3.Left());
    }
    if (inputMap["s"]) {
      this.command.displacement.addInPlace(Vector3.Backward());
    }

    if (inputMap["d"]) {
      this.command.displacement.addInPlace(Vector3.Right());
    }
    if (inputMap[" "]) {
      this.command.displacement.addInPlace(Vector3.Up());
    }
  }
}
