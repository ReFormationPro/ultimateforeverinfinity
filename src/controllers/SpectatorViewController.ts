import Controller from "./Controller";
import { Vector3 } from "babylonjs";
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

      //var keydown = false;
      if (this.inputMap["w"]) {
        this.displacement.addInPlace(Vector3.Forward());
        //newMeshes[0].rotation.y = 0
        //keydown=true;
      }
      if (this.inputMap["a"]) {
        this.displacement.addInPlace(Vector3.Left());
        //newMeshes[0].rotation.y = 3*Math.PI/2
        //keydown=true;
      }
      if (this.inputMap["s"]) {
        this.displacement.addInPlace(Vector3.Backward());
        //newMeshes[0].rotation.y = 2*Math.PI/2
        //keydown=true;
      }

      if (this.inputMap["d"]) {
        this.displacement.addInPlace(Vector3.Right());
        //newMeshes[0].rotation.y = Math.PI/2
        //keydown=true;
      }

      if (this.inputMap[" "]) {
        this.displacement.addInPlace(Vector3.Up());
        //newMeshes[0].rotation.y = Math.PI/2
        //keydown=true;
      }
      if (this.inputMap["Shift"]) {
        this.displacement.addInPlace(Vector3.Down());
        //newMeshes[0].rotation.y = Math.PI/2
        //keydown=true;
      }
      /*
      if(keydown){
          if(!animating){
              animating = true;
              scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
          }
      }else{
          animating = false;
          scene.stopAnimation(skeleton)
      }*/
      this.move();
    });
  }
}
