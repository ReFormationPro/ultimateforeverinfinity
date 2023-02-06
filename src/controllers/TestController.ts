import { Controller } from "./Controller";
import { Scene, IPhysicsEnginePlugin, Vector3, KeyboardInfo } from "babylonjs";
export default class TestController extends Controller {
  constructor(scene: Scene, canvas: any) {
    super(scene, canvas, [
      " "
    ]);
    this.command.test = true;
    this.command.gravity = Vector3.Zero();
    if (this.scene._physicsEngine !== undefined) {
      this.scene._physicsEngine.setGravity(this.command.gravity);
    }
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
    if (inputMap["AltGraph"]) {
      this.command.displacement.addInPlace(Vector3.Down());
    }
    if (inputMap["g"]) {
      if (this.command.gravity.equals(Vector3.Zero())) {
        this.command.gravity.copyFrom(this.scene.gravity)
      }
      else {
        this.command.gravity = Vector3.Zero();
      }
      this.scene._physicsEngine.setGravity(this.command.gravity);
    }
    this.inputMapQueue.unshift(inputMap);

    this.move(this.player.cam.camObj.position);
  };

  setNegTarget(negTarget: Vector3) {
    this.command.negTarget = Vector3.Zero();
    this.command.negTarget.copyFrom(negTarget);
  }
}
