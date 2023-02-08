import { Controller } from "./Controller";
import { Scene, Vector3 } from "babylonjs";
import TestController from "./TestController";
export default class PlayerController extends TestController {
  constructor(scene: Scene, canvas: any) {
    super(scene, canvas);
    this.command.test = false;
    this.command.gravity.copyFrom(this.scene.gravity);
    if (this.scene._physicsEngine !== undefined) {
      this.scene._physicsEngine.setGravity(this.command.gravity);
    }
  }
  listenInput() {
    const inputMap = this.inputMapQueue[0];
    this.command.displacement = Vector3.Zero();
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
    this.inputMapQueue.unshift(inputMap);

    this.move(this.player.cam.camObj.position);
  }
}
