import { Controller } from "./Controller";
import { Scene, IPhysicsEnginePlugin, Vector3, KeyboardInfo } from "babylonjs";
export default class TestController extends Controller {
  constructor(scene: Scene, canvas: any) {
    super(scene, canvas);
    this.command.test = true;
  }
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
    if (this.inputMap["AltGraph"]) {
      this.command.displacement.addInPlace(Vector3.Down());
    }
    if (this.inputMap["g"]) {
      this.command.gravity =
        (this.command.gravity.equals(Vector3.Zero())) ? this.scene.gravity : Vector3.Zero();
      this.scene._physicsEngine.setGravity(this.command.gravity);
    }
    this.move();
  };
  calcUpVector() {
    if (this.player.compoundMesh.physicsImpostor === undefined && !this.command.gravity.equals(Vector3.Zero())) {
      this.command.up = this.command.gravity.multiplyByFloats(-1, -1, -1);
    }
    else {
      this.command.up = Vector3.Up()
    }
  }
  setTarget() {
    this.command.negTarget = Vector3.Zero();
    this.command.negTarget.copyFrom(this.player.cam.camObj.position);
  }
}
