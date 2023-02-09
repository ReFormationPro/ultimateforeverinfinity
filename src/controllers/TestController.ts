import { GRAVITY, canvas } from "../globals";
import BaseScene from "../scenes/BaseScene";
import { Controller } from "./Controller";
import { Scene, IPhysicsEnginePlugin, Vector3, KeyboardInfo } from "babylonjs";
export default class TestController extends Controller {
  constructor(scene: Scene) {
    super(scene, [
      " "
    ]);
    this.command.test = true;
  }
  //https://www.babylonjs-playground.com/#3EDS3A#96
  managePointerLock() {
    // Pointer lock
    let isLocked = false;
    this.scene.onPointerDown = (evt) => {
      if (!isLocked) {
        canvas.requestPointerLock =
          canvas.requestPointerLock ||
          canvas.msRequestPointerLock ||
          canvas.mozRequestPointerLock ||
          canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
          canvas.requestPointerLock();
          return;
        }
      }
    };

    const pointerlockchange = () => {
      // @ts-ignore
      const controlEnabled =
        document.mozPointerLockElement ||
        document.webkitPointerLockElement ||
        document.msPointerLockElement ||
        document.pointerLockElement ||
        null;
      if (!controlEnabled) {
        isLocked = false;
      } else {
        isLocked = true;
      }
    };
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener(
      "webkitpointerlockchange",
      pointerlockchange,
      false
    );
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
    if (inputMap["AltGraph"]) {
      this.command.displacement.addInPlace(Vector3.Down());
    }
    if (inputMap["g"]) {
      this.player.calcGravity = !this.player.calcGravity;
    }
  };
  setNegTarget() {
    this.command.negTarget = Vector3.Zero();
    this.command.negTarget.copyFrom(this.player.cam.camObj.position);
  }
  calcUpVector() {
    if (!this.scene.physicsEnabled || (<BaseScene>this.scene).gravityMagnitude === 0) {
      this.command.up = Vector3.Up()
    }
    else {
      this.command.up = this.player.gravity.negate().normalize();
    }
  }
}
