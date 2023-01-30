import TexturedPlane from "./TexturedPlane";
import {
  ArcRotateCamera,
  Vector3,
  Scene,
  Tools,
  Ray,
  RayHelper,
} from "babylonjs";
import { Controller } from "../controllers/Controller";
import PlayerController from "../controllers/PlayerController";
import { PLAYER_IMG_DIR } from "../globals";

export default class Player extends TexturedPlane {
  constructor(
    scene: Scene,
    url: string = PLAYER_IMG_DIR,
    width: number = 3,
    height: number = 3,
    position: Vector3 = new Vector3(0, height / 2, 0),
    rotation: Vector3 = new Vector3(0, 0, 0),
    speed: number = 5,
    jumpSpeed: number = 200,
  ) {
    super(scene, url, width, height, position, rotation, true);
    //units per second
    this.speed = speed;
    this.jumpSpeed = jumpSpeed;
    this.mesh.isPickable = false;
  }
  addController(controller: Controller) {
    controller.player = this;
    this.scene.onBeforeRenderObservable.add(() => {
      controller.listenInput();
    });
    const playerController = <PlayerController>controller;
    if (
      playerController.managePointerLock !== undefined &&
      playerController.managePointerLock !== null
    ) {
      playerController.managePointerLock();
    }
  }
  calcRelativeAxes(): Array<Vector3> {
    //w = -g is the negated unit gaze vector
    const w: Vector3 = this.cam.camObj.position
      .subtract(this.compoundMesh.position)

    // we need w parallel to the ground
    w.y = 0;
    w.normalizeToRef(w);
    //u is the unit right direction
    const u: Vector3 = Vector3.Cross(this.v, w);
    return [u, this.v, w];
  }
}
