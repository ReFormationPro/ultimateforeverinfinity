import Controller from "./Controller";
import { Vector3 } from "babylonjs";
import { BoxCollider } from "../objects/Collider";
export default class PlayerController extends Controller {
  //https://www.babylonjs-playground.com/#3EDS3A#96
  managePointerLock() {
    // Pointer lock
    let isLocked = false;
    this.scene.onPointerDown = (evt) => {
      if (!isLocked) {
        this.canvas.requestPointerLock =
          this.canvas.requestPointerLock ||
          this.canvas.msRequestPointerLock ||
          this.canvas.mozRequestPointerLock ||
          this.canvas.webkitRequestPointerLock;
        if (this.canvas.requestPointerLock) {
          this.canvas.requestPointerLock();
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

  listenInput() {
    this.scene.onBeforeRenderObservable.add(() => {
      this.displacement = Vector3.Zero();
      const boxCollider: BoxCollider = <BoxCollider>this.player.collider;

      if (this.inputMap["w"]) {
        this.displacement.addInPlace(Vector3.Forward());
      }
      if (this.inputMap["a"]) {
        this.displacement.addInPlace(Vector3.Left());
      }
      if (this.inputMap["s"]) {
        this.displacement.addInPlace(Vector3.Backward());
      }

      if (this.inputMap["d"]) {
        this.displacement.addInPlace(Vector3.Right());
      }
      if (this.inputMap[" "] && boxCollider.onObject) {
        this.displacement.addInPlace(Vector3.Up());
      }
      this.move();
    });
  }
}
